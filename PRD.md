# **Pulse Challenges — Web App POC PRD (Next.js + Privy + Abstract)**

**Owner:** Michael Paris \
**Contributors:** Michael, John, Martin, Cameron, Tyson, Platform Team, and Others \
**Last updated:** Sept 19, 2025 \
**Status:** Draft v0.6


---


## **0) Executive Summary**

We will build **Pulse Challenges** as a responsive **web app** (mobile-first, desktop-ready) that we can ship rapidly, demo cleanly, and hand off to engineers for production hardening. It will use **Next.js** + **Vercel** for velocity, **Privy** for progressive auth + embedded/external wallets (EVM & Solana), and target **Abstract L2 (EVM)** first for on-chain escrow + payouts, with **Pudgy Party** as the flagship game. The app must preserve the Pulse tournament business logic (Top‑12 leaderboard, fees, low‑participation rules) and add multi‑token/multi‑network selection for entry/payouts (MYTH on Abstract; PENGU on Abstract and/or Solana; admin‑addable tokens).

Escrow, refund, and payout flows are provided by a third-party **Tournament Escrow Provider (TEP)** running on **Abstract L2**. This Master PRD summarizes how the app uses escrow; the detailed contract surface, events, and sequencing live in the **[TEP PRD](https://docs.google.com/document/d/1axy-KKL4aUXqua0RwBllSSitcxrxXrphbF1cav8X8f8/edit?usp=sharing)**.

Key differences from the prior MVP:



* **Wallet & Auth:** Replace Turnkey with Privy (embedded wallets, social/OTP, external wallet linking; key export enabled for non‑custodial UX). \

* **Chain:** Target **Abstract (EVM)** and later Solana for escrow/payouts \

* **Contracts:** Integrate a **third‑party tournament escrow provider (TEP)** or ship an interim audited EVM contract (escrow + fee splits) while we evaluate multi‑chain options. \

* **Game:** Spec for **Pudgy Party** leaderboard modes (i.e. Top‑1/Top‑3/Top‑10 Finishes, Coins Earned, etc.). \

* **Admin‑gated creation:** Challenge creation initially restricted to admins; designed to unlock UGC later. \

* **Analytics:** Snowplow + Looker with a clean event schema from auth → join → play → payout. \



---


## **1) Goals & Non‑Goals**


### **1.1 Goals**



* Ship a polished **web POC** of Challenges that is: \

    * **Production‑lean**: Clean architecture, typed interfaces, test coverage, infra ready to scale. \

    * **Playable end‑to‑end**: login → link wallets/accounts → join → play → leaderboard → payout. \

    * **Multi‑chain aware**: EVM first (Abstract), with adapters for Solana tokens later. \

    * **Admin tools**: Create/edit challenges; operational views for support & payouts. \

* Respect existing **Pulse tournament rules**: fees, Top‑12 splits, cancellations, fallbacks. \

* Design with **wallet‑app expansion** in mind (future Pulse Wallet features). \



### **1.2 Non‑Goals (v0/v1)**



* Native iOS/Android apps (we’ll keep the codebase portable to mobile later). \

* Full push notification service (we’ll implement rich in‑app toasts; push later). \

* On‑chain anti‑cheat or trustless oracles (we’ll use signed server telemetry; oracle vendors evaluated). \

* Marketplace features, chat/DMs, staking, or brand‑sponsored escalator mechanics (future phases). \



---


## **2) System Architecture**


### **2.1 High‑Level Diagram**



* **Next.js App Router** on Vercel (SSR + ISR for SEO pages; mostly client‑side for app shell). \

* **Privy React SDK**: Auth + wallets (embedded + external) for **EVM (Abstract)** and **Solana** (Phantom et al.). \

* **EVM RPC**: Abstract mainnet/testnet via RPC endpoints; viem/wagmi for EVM calls. \

* **Contracts layer**: TEP integration for escrow/payouts. Fallback: our audited EVM tournament escrow + 0xSplits for fee distribution. \

* **Backend API**: Next.js API routes or a lightweight Node service for: \

    * challenge CRUD (admin), \

    * join/pay flow (intent checks, allowance/permit flows), \

    * leaderboard ingestion from **Pudgy Party** server webhooks, \

    * payouts orchestration and post‑settlement accounting. \

* **DB**: Postgres (Neon), Prisma ORM. \

* **Cache/Real‑time**: Redis (Upstash) + WebSockets (Vercel WebSockets/Ably/Pusher). \

* **Telemetry**: Snowplow JS + server emitters → BigQuery → Looker dashboards. \

* **Images**: LLM image gen service (OpenAI image API) with prompt guardrails + review queue. \



### **2.2 Environments**



* **Dev** (preview branches); **Staging**; **Prod**. \

* Automatic Vercel previews per PR; feature flags via `@vercel/flags` or ConfigCat. \



---


## **3) Authentication & Account Linking**


### **3.0 Wallet Bootstrapping (Auto-Provision)**

On first successful Privy sign-in, the app **auto-provisions** embedded wallets so every user can transact immediately:



* **Embedded EVM wallet** (non-custodial, **exportable**) \

* **Embedded Solana wallet** (non-custodial, **exportable**) \


**Abstract Global Wallet (AGW)** is **optional**:



* If the user signs in with **Abstract** (Privy/Abstract provider), their AGW is created/linked during auth. \

* Otherwise, users can **add AGW later** via **Profile → Linked Wallets → “Connect Abstract”** (consent pop-up). \


**Acceptance Criteria:** After first login, **Linked Wallets** shows **Embedded EVM** and **Embedded Solana**; AGW appears only if the user signed in with Abstract or links it later.


### **3.1 Login Methods**



* **Enabled sign-in methods (Privy):** Email OTP, Passkey/WebAuthn, **Google, Discord, X (Twitter), Telegram**, Wallet (SIWE/SIWS). *(Apple optional, later.)* \

* Progressive onboarding: allow browse → prompt to authenticate at join/payout actions. \



### **3.2 User Object & Linking**

 A Pulse user may link multiple wallets and identities.** \
**



* **Profile: **`username` (required, unique).
* **Wallets:** Embedded **EVM** (auto), Embedded **Solana** (auto), optional **Abstract Global Wallet** (add later), external EVM/Solana wallets. \

* **Game Platforms:** zero or more **platform accounts** (v0: **Mythical**). Each mapping stores `{provider, accountId, displayName, games[]}`. \

* **Linked Wallets (Profile):** list/copy addresses; per-wallet balances & total (USD est.); **export keys for embedded only**; link/unlink externals; **Connect Abstract** CTA. \

* **Game Platforms (Profile):** link/unlink Mythical; show displayName and covered games; re-link on token expiry. \

* **Primary Wallets (per network):** user selects Primary **EVM/Abstract** and **Solana**; used for Join/Create/Seed/Payouts (overrideable per action). \

* **Abstract fallback:** if no Abstract wallet is linked, use **Embedded EVM** on Abstract L2 by default.

**See also:** **3.6 Pulse User Object (Reference)** for the canonical API/DB shape used across the app.

**3.2a Social Accounts (Privy native module) \
 \
Goal.** Let users link/revoke social sign-in methods using Privy’s built-in “Linked Accounts” experience.

**Scope (MVP, native only)**



* **Providers enabled in Privy dashboard:** **Google, Discord, X (Twitter), Telegram**. *(Apple optional, later.)*
* **Manage flow:** one **“Manage Social Accounts”** button opens the **Privy modal**. All link/unlink UX is handled **inside Privy**.
* **Guardrail:** Users must have **≥1** sign-in method on file. If only one remains, **Privy disallows unlink** (UI shows a warning and blocks).
* **Storage/source of truth:** `user.linkedAccounts` from **Privy**. **No Pulse DB table** is required in MVP.
* **Refresh:** after link/unlink, refresh the Privy user object (client) and session as needed. \


**Acceptance Criteria**



* Users can link/unlink Google, Discord, X, Telegram via native supported **Privy modals**.
* The app does **not** allow unlink if it would leave **0** sign-in methods.
* Settings shows a single **Manage Social Accounts** entry; no per-provider UI is required.


### **3.3 Sessions & Security**



* Privy session token + app JWT for API calls; rotate 24h; refresh on activity. \

* CSRF on POST; rate limits on sensitive endpoints (join/create/payout). \

* Device fingerprint (soft) for risk scoring (suspicious rapid account creation). \



### **3.4 Acceptance Criteria**



* User can login with OTP/Discord/Google, link ≥1 EVM wallet and Phantom, view all under **Profile → Linked Wallets**; sign a test message; export embedded key. \

* Logging out invalidates the app JWT; refresh is required for new actions.
* A blocking **Choose Username** step runs immediately after first login; users cannot proceed until a valid, unique username is set.

**3.5a Pulse Username (MVP)**



* After first successful Privy sign-in, users must set a unique **Pulse username** (handle) — e.g., `pengu_pro`.
* **Blocking step:** Users cannot enter the app or link a game account until a valid, unique username is saved.
* **Rules**
* Pattern: `^[a-z][a-z0-9_]{2,19}$` (3–20 chars, starts with a letter; lowercase letters, numbers, underscores only).
* Case-insensitive uniqueness (store a normalized lowercase).
* Reserved list rejected: `admin, mod, pulse, support, team, owner, abstract, eth, sol, null, undefined` (extendable).
* **UX \
**
    * Modal: **“Choose your username”** with inline availability check. \

    * On success, continue to **Connect Your Game Account** (non-blocking).
* **Storage**
    * Source of truth: DB columns `users.username` (displayed as typed) and `users.username_normalized` (lowercase, unique index).
    * Optional mirror to Privy custom metadata `{ username }` for client convenience (failure to mirror must not block). \

* **Changes**
    * **MVP:** username is **immutable** (no self-serve changes).


### **3.5b Game Platform Linking (Mythical v0**

**Precondition: **Username has been set** \
 \
Requirement:** Users can **browse** challenge listings without linking a game account. **Join** is **blocked** until the **required game platform** (e.g., **Mythical** for Pudgy Party) is linked.

**Post-Privy Auth (non-blocking): \
** After successful login, show a **“Connect Your Game Account”** modal: \
 • **Connect Mythical** (CTA) — proceeds to OAuth \
 • **Maybe later** — dismisses modal; user can browse freely (Join still requires link)

**Per-Challenge gating: \
** When user taps **Join**, if the challenge **requires a platform** that is not linked (e.g., `required_platform = MYTHICAL`), show the same connect modal **inline** and **block Join** until linking completes.

**OAuth (Mythical / FusionAuth):**



1. Redirect to FusionAuth with scopes: `profile:read`, `gameplay:read`. \

2. Callback: `POST /api/platforms/mythical/oauth/callback` (code exchange). \

3. Persist a **GamePlatformAccount** record: \
 `{ provider: 'MYTHICAL', accountId, displayName, games: ['PUDGY_PARTY','NFL_RIVALS'] } \
`
4. Mark user → platform mapping active; refresh eligibility checks. \


**Unlink:** Revokes tokens & marks mapping inactive; **Join** is blocked for games requiring that platform.

**Error handling: \
** OAuth rejected → retry prompt with support link. \
 Token refresh fails → prompt re-link at next Join/Leaderboard view.

**Acceptance Criteria: \
** • Users can **browse without linking**. \
 • If a challenge **requires Mythical**, Join is **blocked** until linked. \
 • Profile shows a **linked Game Platform** card with displayName and provider. \
 • Webhook payloads (e.g., `mythicalAccountId`) resolve via the **GamePlatformAccount** mapping.

 \
**3.6 Pulse User Object (Reference)**

This is the canonical shape the app exposes internally (TypeScript/DB) and returns from `/v1/profile`. It composes username, wallets (embedded + external), per-network primary payout wallets, linked game platforms (e.g., Mythical), and social accounts (via Privy). See **3.2 User Object & Linking** for behaviors and UI, and **3.5a/3.5b** for username & game-platform requirements. 


```
type PulseUser = {
  id: string
  createdAt: string
  // Identity
  username: string                 // required at first login (immutable in MVP)
  usernameNormalized: string       // lowercase, unique
  // Wallets
  wallets: {
    embeddedEvm?: { address: string }          // auto-provisioned
    embeddedSol?: { address: string }          // auto-provisioned
    abstract?: { address: string }             // AGW if user signed in w/ Abstract or linked later
    externals: Array<{
      chain: "evm" | "solana"
      address: string
      label?: string                           // e.g., "MetaMask", "Phantom"
    }>
  }
  primaryWallets: {
    evmOrAbstract?: string                     // payout default for EVM/Abstract
    solana?: string                            // payout default for Solana
  }
  // Game Platforms (Mythical v0)
  gamePlatforms: Array<{
    provider: "MYTHICAL"
    accountId: string
    displayName?: string
    games: string[]                            // e.g., ["PUDGY_PARTY","NFL_RIVALS"]
    linkedAt: string
  }>
  // Social Accounts (Privy source of truth)
  socialAccounts: {
    source: "privy"
    linkedAccounts: any[]                      // pass-through from Privy user.linkedAccounts
    hasAny: boolean
  }
  // Eligibility helpers (derived flags used by UI flows)
  eligibility: {
    hasUsername: boolean
    hasRequiredPlatformForChallenge?: boolean  // computed per viewed challenge
  }
  // Preferences
  preferences: {
    notifications?: Record<string, boolean>    // toast categories on/off
  }
  // Contract refs (challenge-level mapping lives on challenge rows)
  walletPref?: {                               // DB WalletPref
    evmPayoutAddr?: string
    solPayoutAddr?: string
  }
}
```


**Notes & references**



* Username is **blocking** at first login (immutable in MVP). \
Embedded EVM + Embedded Solana are **auto-provisioned**; Abstract Global Wallet is **optional** and may be linked later.
* Game platform linking is **required to Join** per challenge rules (e.g., Mythical for Pudgy Party).
* Social accounts are managed **entirely in Privy’s modal**; we just reflect `linkedAccounts`. \


**Acceptance criteria**



* `/v1/profile` returns the structure above (fields may be `null/undefined` if not set).
* UI components (Join, Create, Profile) rely on `primaryWallets` and `eligibility` flags for gating.
* No duplication between DB and Privy: socials come from Privy; username/wallet prefs from DB.


---


## **4) Wallets & Chains**


### **4.1 Supported Tokens & Networks**

**Supported Tokens (Entry Fees & Prizes):**



* **MYTH**: Abstract L2, Ethereum Mainnet
* **PENGU**: Abstract L2, Solana
* **USDC**: Abstract L2, Ethereum, Solana, Polygon, Avalanche
* **WETH (ERC-20): Abstract L2**
* **ETH (native): fast-follow; not used for MVP joins/escrow**
* **SOL**: Solana

**MVP: **Only **Abstract L2** tokens are enabled for join/payout; other networks remain fast-follow.

**Network Support:**



* **EVM Networks**: Abstract L2 (primary), Ethereum Mainnet, Avalanche
* **Non-EVM**: Solana

**Price Display Requirements:**



* All token amounts must show USD equivalent
* Live price updates every 1 minute via CoinGecko API
* Format: "10 MYTH (~$45.67 USD)" throughout UI
* Cache prices server-side with 60-second TTL


### **4.2 Wallet Types**



* **Embedded EVM (Privy)** — auto-provisioned; **exportable**.
* **Embedded Solana (Privy)** — auto-provisioned; **exportable**.
* **Abstract Global Wallet (AGW)** — **optional**; created when signing in with Abstract or later via “Connect Abstract”; **no private key export** (smart wallet).
* **External EVM wallets** — MetaMask, Rainbow, Coinbase Wallet (Privy connectors). \
**External Solana wallets** — Phantom, etc. \


**4.3 Primary Wallets (per network) \
 \
** In **Profile → Linked Wallets**, the user selects:



* **Primary EVM/Abstract** (default = **Embedded EVM**; can be AGW or any linked EVM)
* **Primary Solana** (default = **Embedded Solana**)

**Usage:**



* **Join** and **Create/Seed** default to the **Primary** for the challenge’s network; users can switch wallet inline.
* **Payouts** are sent to the **Primary** of that network at settlement.
* **Abstract fallback:** if no AGW/external Abstract is linked, **Embedded EVM** is offered and used for Abstract challenges. 


### **4.4 Multi-Network Wallet Support**

**Challenge Network Compatibility:**



* Each challenge specifies required network (e.g., "Abstract L2" for MYTH entry)
* Join flow checks if user's preferred payout wallet supports challenge network

**Wallet-Network Mismatch Scenarios:**

**Scenario 1: Preferred wallet doesn't support challenge network**



* Show wallet switcher filtered to compatible wallets only
* If no compatible wallets linked: Prompt "Connect [Network] Wallet" → Privy connector flow
* Fallback: Use embedded wallet (supports all EVM networks via RPC switching)
* If no Abstract wallet is linked, offer **Embedded EVM (Abstract L2)** as the default option; user may still link AGW later.

**Scenario 2: External wallet on wrong network**



* Show "Switch to [Correct Network]" button → Triggers Privy network switching
* If wallet doesn't support network: Prompt to use different wallet or embedded wallet

**Network Display Rules:**



* Challenge detail pages show network badge (e.g., "Abstract L2", "Solana")
* Entry fee displays include network: "10 MYTH on Abstract L2"
* Wallet selector shows network compatibility: "MetaMask ✓ Abstract" vs "MetaMask ✗ Solana"
* The wallet selector shows a **“Primary”** tag on the per-network default. 

**Acceptance Criteria**: Users can always join challenges regardless of wallet/network mismatches through guided flows \



---


## **5) Challenges — Core Objects**


### **5.1 Challenge Model**



* `id (uuid) \
`
* `slug` (derived from title) \

* `visibility` = public | private (invite code) | unlisted \

* `game` = PUDGY_PARTY (v0; enum allows future games) \

* `required_platform = MYTHICAL` *(derived from game; used to gate Join)* \

* `mode` = LEADERBOARD \

* **Leaderboard config \
**
    * `score_by` = TOP1_COUNT | TOP3_COUNT | TOP10_COUNT | COINS_EARNED | CUSTOM_METRIC \

    * `higher_is_better` = true \

    * `time_window` (UTC start/end) \

* **Entry & Prizes \
**
    * `entry_token = { chain: ABSTRACT | SOLANA | ETHEREUM, symbol, tokenAddr/mint, decimals }`
    * `entry_fee (min units)`
    * `prize_token = entry_token (MUST match - same token, same network)` \
`max_joiners `(optional) \

* **Fees \
**
    * `developer_fee_bps` (default 800 = 8%) \

    * `organizer_fee_bps` (0–1000) \

    * fee destinations: `dev_fee_wallet`, `organizer_fee_wallet \
`
* **State = DRAFT → PUBLISHED → LIVE → ENDED → SETTLED | CANCELLED**
    * **(We do not use a separate DISPUTE state in MVP; see dispute_hold flag.)** \

* **Created by** (userId), `allow_user_generated` (feature flag)
* dispute_window_hours = 24 // Time allowed for result disputes after ENDED
* dispute_hold = false (boolean; internal/admin override that delays settlement after the 24h window until cleared)
* Join Cutoff Rule: Users can join challenges up to 10 minutes before the scheduled end time
* Hero Image: hero_image (string, optional) - LLM-generated or uploaded challenge banner
* Invite Code: invite_code (string, optional) - Required for private challenges


### **5.2 Display Buckets (App Home)**



* **Active** – challenges the user **joined** and are **LIVE**. \

* **Happening Now** – all **LIVE** challenges. \

* **Upcoming** – start within **36h**; not started yet. \

* **Created by you** – user‑created DRAFT/UPCOMING/LIVE (admin‑only at v0). \



### **5.3 Acceptance Criteria**



* Only sections with ≥1 item render; sorting by startTime asc or join recency; infinite scroll. \



---


## **6) Challenge Creation (Admin v0)**


### **6.1 Form Fields/Config for Challenge Creation**


<table>
  <tr>
   <td><strong>Field</strong>
   </td>
   <td><strong>Description</strong>
   </td>
   <td><strong>Type</strong>
   </td>
   <td><strong>Required to Publish</strong>
   </td>
   <td><strong>Editability (see matrix below)</strong>
   </td>
   <td><strong>Notes</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Challenge Name (Title)</strong>
   </td>
   <td>Title of the Challenge
   </td>
   <td>Text (max 100)
   </td>
   <td>✅
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>Used in image prompt too
   </td>
  </tr>
  <tr>
   <td><strong>Hero Image</strong>
   </td>
   <td><strong>LLM-generated</strong> image based on <em>Game Challenge Image Gen Rules</em> + Title
   </td>
   <td>System (LLM gen)
   </td>
   <td>Auto
   </td>
   <td><strong>Admin always</strong>
   </td>
   <td>“Generate / Regenerate” w/ preview; stores seed & prompt
   </td>
  </tr>
  <tr>
   <td><strong>Description (About)</strong>
   </td>
   <td>Rules/context
   </td>
   <td>Long text
   </td>
   <td>❌
   </td>
   <td><strong>Admin always</strong>
   </td>
   <td>Shown in list + detail
   </td>
  </tr>
  <tr>
   <td><strong>Game</strong>
   </td>
   <td>Game used
   </td>
   <td>Enum: <strong>[Pudgy Party]</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Editable in DRAFT only
   </td>
  </tr>
  <tr>
   <td><strong>Game Mode</strong>
   </td>
   <td>Which modes count
   </td>
   <td>Enum (Pudgy): <strong>[All Modes, Battle Royale, Event]</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Default: All Modes
   </td>
  </tr>
  <tr>
   <td><strong>Score By</strong>
   </td>
   <td>Leaderboard metric
   </td>
   <td>Enum (Pudgy): <strong>[Top-1 Finishes, Top-3, Top-10, Coins Earned]</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Top-X = count of placements; Coins Earned = sum
   </td>
  </tr>
  <tr>
   <td><strong>Challenge Type</strong>
   </td>
   <td>Free vs Paid
   </td>
   <td>Enum: [Free, Paid]
   </td>
   <td>✅
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>Toggles Entry Fee visibility
   </td>
  </tr>
  <tr>
   <td><strong>Token</strong>
   </td>
   <td><strong>Entry & payout token</strong>
   </td>
   <td>Enum: <strong>[MYTH, PENGU, USDC, ETH, SOL]</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Drives denomination for Entry Fee & payouts. 
<p>
Entry and payout use the same ERC-20 token (no in-flow conversion).
<p>
(Aligns with the TEP join/settle math: single token per challenge.)
<p>
<strong>MVP gating:</strong> Only <strong>Abstract L2 ERC-20</strong> tokens are enabled (e.g., MYTH, USDC, WETH, PENGU on Abstract). <strong>ETH (native)</strong> and <strong>SOL</strong> are <strong>disabled</strong> in v0.
   </td>
  </tr>
  <tr>
   <td><strong>Network</strong>
   </td>
   <td>Settlement network for token
   </td>
   <td>Constrained enum per token
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Must be valid combo (see combos)
   </td>
  </tr>
  <tr>
   <td><strong>Required Game Platform</strong>
   </td>
   <td>Platform needed for Join | <strong>System (derived)</strong>
   </td>
   <td>System (derived)
   </td>
   <td>Auto
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Set from <strong>Game</strong> (v0: PUDGY_PARTY ⇒ MYTHICAL). Shown as read-only.
   </td>
  </tr>
  <tr>
   <td><strong>Entry Fee Amount</strong>
   </td>
   <td>Cost to enter (in Token)
   </td>
   <td>Number (≥0; token decimals)
   </td>
   <td>✅ if Paid
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>If Free: 0 & disabled
   </td>
  </tr>
  <tr>
   <td><strong>Sponsor Prize Amount</strong>
   </td>
   <td>Organizer-funded <strong>seed</strong> pot (in Token)
   </td>
   <td>Number (≥0; token decimals)
   </td>
   <td>✅ (0 allowed)
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>Forms base pool; entry fees add on top
   </td>
  </tr>
  <tr>
   <td><strong>Organizer Fee %</strong>
   </td>
   <td>% cut post game-dev fee
   </td>
   <td>Slider (0–10%)
   </td>
   <td>✅
   </td>
   <td><strong>Until first join (only reduce)</strong>
   </td>
   <td>Default 5%
   </td>
  </tr>
  <tr>
   <td><strong>Payout Structure</strong>
   </td>
   <td>Distribution
   </td>
   <td>Auto: <strong>Top 12 token payout</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>NFT prize removed
   </td>
  </tr>
  <tr>
   <td><strong>Start Date / Time</strong>
   </td>
   <td>Challenge start (UTC)
   </td>
   <td>DateTime
   </td>
   <td>✅
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>—
   </td>
  </tr>
  <tr>
   <td><strong>End Date / Time</strong>
   </td>
   <td>Challenge end (UTC)
   </td>
   <td>DateTime
   </td>
   <td>✅
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>Must be after Start
   </td>
  </tr>
  <tr>
   <td><strong>Max Joiners</strong>
   </td>
   <td>cap on <em>wallets that pay the entry</em>/can join the challenge
   </td>
   <td>Integer (1–1000; default no cap)
   </td>
   <td>❌
   </td>
   <td><strong>Until first join (only increase)</strong>
   </td>
   <td>—
   </td>
  </tr>
  <tr>
   <td><strong>Visibility</strong>
   </td>
   <td>Discovery mode
   </td>
   <td>Enum: <strong>[Public, Private, Unlisted]</strong>
   </td>
   <td>✅
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>Unlisted = link-only
   </td>
  </tr>
  <tr>
   <td><strong>Invite Code</strong>
   </td>
   <td>Required if Private
   </td>
   <td>Text (auto-gen, editable)
   </td>
   <td>Conditional
   </td>
   <td><strong>Until first join</strong>
   </td>
   <td>“Generate/Regenerate”
   </td>
  </tr>
  <tr>
   <td><strong>Share Link</strong>
   </td>
   <td>Direct URL
   </td>
   <td>System
   </td>
   <td>Auto
   </td>
   <td>Read-only
   </td>
   <td>Always shown
   </td>
  </tr>
  <tr>
   <td><strong>Funding Confirmed</strong>
   </td>
   <td>Backend prize validation
   </td>
   <td>System
   </td>
   <td>Auto
   </td>
   <td>Read-only
   </td>
   <td>Covers sponsor seed (optional) and fee flow; seed increases prize pool at settlement. Seed handling on cancel is governed by TEP PRD; UI does not show sponsor refunds in MVP.
   </td>
  </tr>
  <tr>
   <td><strong>Challenge Status</strong>
   </td>
   <td>Draft/Published/Live/Completed/Settled
   </td>
   <td>System
   </td>
   <td>Auto
   </td>
   <td>Admin/system
   </td>
   <td>State drives edit locks
   </td>
  </tr>
  <tr>
   <td><strong>Escrow Contract Refs</strong>
   </td>
   <td>Internal payout/escrow identifiers
   </td>
   <td>System
   </td>
   <td>Auto
   </td>
   <td><strong>Never after Publish</strong>
   </td>
   <td>Auditability
   </td>
  </tr>
</table>



### Participants = wallets that played ≥1 match (appear on leaderboard); Joiners = wallets that paid the entry.** \
 \
Supported Token ↔ Network Combos**



* **MYTH:** Abstract L2, Ethereum Mainnet \

* **PENGU:** Abstract L2, Solana \

* **USDC:** Abstract L2, Ethereum, Solana, Polygon, Avalanche \

* **ETH:** Ethereum Mainnet, Abstract L2 \

* **SOL:** Solana

**MVP chain:** escrow lives on **Abstract L2**; other networks remain fast-follow. \



### **6.2 Validation**



* Entry fees & prize tokens must be whitelisted (admin list).
* **Join Cutoff:** joining closes **10 minutes before** `endAt` (UI + on-chain guard).
* **Dispute Window:** settlement allowed **24h after** `endAt`.
* Start &lt; End; min duration 30m;
* When **Token** changes, **Network** must be re-validated (and reset if incompatible).
* **Entry Fee Amount** and **Sponsor Prize Amount** inputs show the selected token symbol and allow decimals appropriate for that token.
* The **Prize Pool** displayed to users = *Sponsor Prize Amount* + *Σ(Entry Fees)* − fees (game-dev fee, organizer fee as applicable).
* **Game Mode** + **Score By** apply only to the selected **Game** (here: Pudgy Party).
* Organizer fee range 0–10% (enforced by UI & server). \



### **6.3 Smart Contract Hooks (EVM v0)**



* On **Publish**:
    1. Create challenge in DB with status **UPCOMING**.
    2. Call **TEP Factory** `createTournament(CreateArgs)` with: `challengeId (keccak(UUID))`, `entryToken`, `tokenDecimals`, `entryFee`, `startAt`, `endAt`, `joinCutoffSecs=600`, `disputeWindowSecs=86400`, `devFeeBps=800`, `orgFeeBps (0..1000)`, `devFeeWallet`, `orgFeeWallet`, `maxJoiners (1..1000)`.
    3. Persist returned `escrowAddress`.
    4. (Optional) Organizer may call **seedSponsor(amount)** to add a sponsor pot.
    5. Store contract deployment/interaction gas estimates for user display


### **6.4 Acceptance Criteria**



* Admin can create/publish; a view page exists; contract init succeeds on Abstract testnet; errors roll back server state.


### **6.5 Challenge Editing Permissions**

**Always Editable (Admin only):**



* Challenge description
* Hero image

**Editable Until First Participant Joins:**



* Title, start/end times, entry fee amount, prize token configuration, max joiners, organizer fee percentage, visibility settings

**Never Editable After Publishing:**



* Game selection, game mode selection, scoring method (score_by), entry token/network, escrow contract references

**State-Based Restrictions:**



* **DRAFT**: All fields editable
* **UPCOMING** (no participants): Limited editing allowed
* **UPCOMING** (≥1 participant): Only description/image editable
* **LIVE/ENDED/SETTLED**: Read-only


### **6.6 Ops Automation (MVP):**



* **Cancel evaluator** (every 2–5 min): in `[endAt − 30m, endAt]` if `participants_count ≤ 3`, call `cancelIfUnderfilled(participantCount)` → refunds.
* **Settlement gate** (every 5 min): pick `status=ENDED` where `now >= endAt + 24h`, `dispute_hold=false`, `participants_count ≥ 4`, not yet settled; publish results artifact; call `settle(...)`; retry with backoff; alert on repeated failures \



---


## **7) Join Flow (Entry Fee & Lock‑in)**


### **7.1 UX**



* **Join drawer** shows: Entry Fee, Token/Network, Prize Pool estimate, Fees (Dev + Organizer), Deadline, and **Selected Wallet** (switcher). The **Selected Wallet** defaults to the **Primary** for the challenge’s network (EVM/Abstract vs. Solana) and only shows **compatible wallets**; users can switch. If the **required platform** for the challenge isn’t linked, a **Connect Game Account** modal appears and **Join is blocked** until linking completes. The modal is dismissible outside the Join flow. \

* **First‑time**: prompt to link wallet(s); otherwise default to user’s preferred EVM wallet. \



### **7.2 On‑chain Steps (EVM)**



* For ERC‑20 entry: \

    * use the **Primary EVM/Abstract** wallet (or the user’s selection) → estimate gas for approve/permit + join → prompt **Permit2** (fallback to `approve`) → ensure allowance → call the **challenge escrow’s** `join(entryFee, permitOrApprove)`.  \

* Guards (on-chain):
    * One entry per wallet
    * `amount == entryFee`
    * `now &lt;= endAt - 10m`
    * `totalJoiners &lt; maxJoiners`
* Record on server: `join_tx_hash`, participant link.
* If Permit2 is unavailable, we fall back to standard `approve`. \



### **7.3 Cancel & Refund Rules**



* Auto‑cancel if ≤3 participants by cutoff; refund 100% (minus network fees).
    * **Auto-cancel window:** at **endAt − 30m**, Operator calls `cancelIfUnderfilled(participantCount)` if **participants ≤ 3** → **100% refunds** of entry fees (gas/network costs excluded) \

* If 4–11 participants, distribute prize pot to top N per fallback logic (below), after fees.
* Seed handling on cancel is governed by the TEP (see **[TEP PRD](https://docs.google.com/document/d/1axy-KKL4aUXqua0RwBllSSitcxrxXrphbF1cav8X8f8/edit?usp=sharing) §16 Open Questions**); UI must not display sponsor refunds in MVP.


### **7.4 Gas Estimation & Cost Display**

**Pre-Transaction Gas Estimates:**



1. **ERC-20 Approval**: Use `eth_estimateGas` for `approve(spender, amount)` call
2. **Join Transaction**: Estimate gas for **join(entryFee, permitOrApprove)** on the challenge escrow
3. **Total Cost Calculation**: Entry fee + (gas estimate × current gas price)
4. **Gas Price Source**: Network's suggested gas price (fast/standard tier)

**UI Display in Join Drawer:**

**Dynamic Updates:**



* Refresh gas estimates every 30 seconds while drawer is open
* Show "Estimating..." state during calculation
* Warning if gas price spikes >50% from initial estimate

**Error Handling:**



* Gas estimation failures → Show "Gas estimate unavailable, proceed with caution"
* Network congestion → Display "High network activity, consider waiting"
* Insufficient gas token → "Insufficient ETH for transaction fees" with "Add Funds" link

**Acceptance Criteria**: Users see accurate total costs before signing, gas failures don't block transactions

**7.5 Settlement (on-chain)**

• At `endAt`, challenge enters **ENDED**. A **24-hour dispute window** begins.

• **Automation:** when `now >= endAt + 24h` **and** `dispute_hold = false`, the backend:

– finalizes winners (Top-12 math; **dust → rank #1**),

– publishes `results.json` (IPFS/Arweave) → obtains **resultsURI**, computes **resultsRoot**,

– calls **<code>settle(winners[], resultsRoot, resultsURI)</code>** on the **per-challenge escrow**.

• **Fee timing & math (at settlement):**

– `entryPool = sum(join amounts)` (ERC-20).

– `devFee = entryPool * devFeeBps / 10_000`; `orgFee = entryPool * orgFeeBps / 10_000` (**wallets fixed at publish**).

– `prizePool = (entryPool − devFee − orgFee) + sponsorSeed`.

– **<code>winners[]</code> amounts must sum to <code>prizePool</code>** (post-fee).

• **Event order:** **ResultsCommitted → FeePaid (dev & organizer) → WinnerPaid (batched) → Settled**.

• **Manual hold:** ops can set `dispute_hold = true` to delay settlement; clearing the flag resumes the next scheduled run.

• **Failures:** if any transfer fails, the settlement **tx reverts**; the backend **retries with backoff**. If an issue persists (e.g., token paused), ops set `dispute_hold = true` and settle when resolved. \



---


## **8) Leaderboards & Scoring (Pudgy Party v0)**


### **8.1 Modes**



* **Top‑1 Finishes** – count of 1st place finishes in the time window. \

* **Top‑3 Finishes** – count of top‑3 placements. \

* **Top‑10 Finishes** – count of top‑10 placements. \

* **Coins Earned** – sum of in‑match coins.

**8.1a Game & Scoring**

Game: All challenges use `PUDGY_PARTY` game type

Challenge Titles: Should reflect Pudgy Party gameplay modes rather than other game names

Examples: "Pudgy Ice Sprint Challenge", "Penguin Coin Rush Tournament", "Arctic Victory Challenge"

At settlement, Pulse commits a **Merkle root** + **resultsURI (IPFS/Arweave)** for the final leaderboard to the escrow; raw stats remain in Pulse DB.


### **8.2 Data Ingestion**



* **Primary**: Pudgy Party **server → webhook** to Challenges API with signed JWT (shared secret/rotating keys). Payload includes `mythicalAccountId`, `matchId`, `placements[]`, `coins`, `timestamp`.
* **Authentication & Mapping:**
    * **User Mapping:** `platformAccountId` (e.g., `mythicalAccountId`) → lookup user via **GamePlatformAccount** mapping `{provider, accountId}`.
    * **Username Validation:** Cross-reference platform `accountId` with stored `displayName` for audit trail.
* **Idempotency & Deduplication:**
    * **Match ID Uniqueness**: `matchId` serves as idempotency key per challenge
    * **Upsert Logic**: New match → insert; duplicate `matchId` → update existing aggregates
    * **Score Reconciliation**: Handle out-of-order webhook delivery with timestamp-based conflict resolution
* **Latency**: ≤ 10 seconds typical; interim UI shows "Pending updates…".
* **Webhook retry policy:** "Retry policy: exponential backoff up to 5 attempts over 30 minutes for failed webhook deliveries"


### **8.3 Anti‑tamper**



* Only server‑signed events are accepted; optional score caps per window; anomaly detection (e.g., > X firsts per hour) flags review. \



### **8.4 Acceptance Criteria**



* Leaderboard updates in near‑real time; ties broken by earliest achievement; downloadable CSV; winner preview matches the final payout set.
* Leaderboard UI: **Name shown** = <code>username </code>**and avatar image**


---


## **9) Payouts & Settlement**


### **9.1 Fee Model**



* **Developer fee**: default **8%** of **total entry pool**, configurable per challenge by admin within policy. \

* **Organizer fee**: **0–10%** configurable per challenge. \

* Fees are taken **before** player payouts. \



### **9.2 Payout Logic & Distribution**

**Fee Calculation (Applied First):**



* **Developer Fee**: 8% of total entry pool
* **Organizer Fee**: 0-10% of total entry pool (set during creation)
* **Net Prize Pool (P)**: Total entries - dev fee - organizer fee

**Cancellation Rules:**



* **≤3 participants**: Auto-cancel 30 minutes before end
* **Full refunds**: 100% entry fees returned, zero fees collected
* **UI Message**: "Challenge cancelled due to insufficient participation"

**Standard Distribution (12+ participants):**



* Use Top-12 percentage table from net prize pool (P)
* **Minimum guarantee**: Ranks 7-12 should receive at least full entry fee refund
    * **Holds true as long as total fees &lt; 50%**

**Low Participation (4-11 participants):**



1. Apply Top-12 percentages to actual participant count
2. Calculate unallocated percentage from unfilled ranks (7-12)
3. Redistribute unallocated amount evenly across all actual ranks
4. **Example (6 participants, 1000 MYTH net pool)**:
    * Standard allocation: 1st=450, 2nd=180, 3rd=100, 4th-6th=50 each
    * Total allocated: 880 MYTH
    * Unallocated: 120 MYTH (from ranks 7-12)
    * Redistribution: +20 MYTH to each rank
    * **Final**: 1st=470, 2nd=200, 3rd=120, 4th-6th=70 each


### **9.3 Prize Types**



* ERC-20/SPL prize pool paid to **Top-12** per schedule.


### **9.4 Payout Execution (EVM v0)**



* **At END:**
    1. Server computes winners & shares (**post-fee**) and obtains admin review.
    2. Server calls the escrow: **<code>settle(winners[], resultsRoot, resultsURI)</code>**.
    3. Contract emits **ResultsCommitted → FeePaid → WinnerPaid → Settled**; UI updates state to **SETTLED**.
    4. User receives tokens to the **Primary** payout wallet for that network.  \



### **9.5 Acceptance Criteria**



* Payout tx shown on challenge page & profile; fee receipts recorded; handle revert paths (insufficient liquidity, paused token) with retry queue.


### **9.6 Token Matching Requirements**

**Simplified Rule**: Entry token and prize token MUST be identical (same token contract, same network)

**Rationale**: Eliminates cross-chain bridging complexity, token conversion rates, and liquidity management

**Examples:**



* ✅ Valid: Entry = 10 MYTH on Abstract, Prize Pool = MYTH on Abstract
* ✅ Valid: Entry = 5 PENGU on Solana, Prize Pool = PENGU on Solana
* ❌ Invalid: Entry = MYTH on Abstract, Prize = PENGU on Solana
* ❌ Invalid: Entry = USDC on Ethereum, Prize = USDC on Polygon

**Challenge Creation Validation**:



* Prize token field auto-populates to match entry token selection
* Prize token field is read-only (cannot be changed independently)
* UI shows: "Prize Pool: Paid in [ENTRY_TOKEN] on [NETWORK]"

**Acceptance Criteria**: All challenges have matching entry/prize tokens, creation form enforces this rule, no cross-chain conversion needed \



---


## **10) Token Prices & Display**

**Primary Price Source**: CoinGecko API (server-side cached, 60s TTL)

**Fallback Strategy (CoinGecko failures):**



1. **Stale Cache**: Extend cached prices up to 5 minutes with "Price may be outdated" disclaimer
2. **Secondary API**: CoinMarketCap API as backup (30-second delay between attempts)
3. **Graceful Degradation**: If all APIs fail, show token amounts only with "(USD unavailable)" label

**Display Format**: "10 MYTH (~$5.67 USD)" with price source indicator when using fallbacks

**Acceptance Criteria**: Price failures don't block core functionality, clear user messaging about data freshness


---


## **11) Notifications (In‑App Toasters)**


### **11.1 Design Principles**



* **Short, punchy, gamified**; clear primary CTA; respect rate limits. \



### **11.2 MVP Notifications**

 \
See Challenge Related Notifications to be included: [https://docs.google.com/spreadsheets/d/1pn1KQe8sQXpYsyjlWEKEwIa315m_wnkbVXUvd-byeqQ/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1pn1KQe8sQXpYsyjlWEKEwIa315m_wnkbVXUvd-byeqQ/edit?usp=sharing) 


<table>
  <tr>
   <td><strong>Event</strong>
   </td>
   <td><strong>App Trigger</strong>
   </td>
   <td><strong>Toast Notification Title Copy</strong>
   </td>
   <td><strong>Toast Notification Subtitle Copy</strong>
   </td>
   <td><strong>Link/CTA</strong>
   </td>
  </tr>
  <tr>
   <td>Challenge Starting
   </td>
   <td>Challenge Start Time
   </td>
   <td>{Challenge Title} is starting!
   </td>
   <td>It's time to compete and climb the leaderboard! &lt;Challenge image preview>
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Top 12 Winner
   </td>
   <td>Challenge ends and user places Top 12
   </td>
   <td>You crushed it! 🏆 Placed #{placement 1-12} in {Challenge Title}!
   </td>
   <td>You won {amount} MYTH. Check out the results! &lt;Challenge image preview>
   </td>
   <td>Challenge Results Modal (on Challenge Detail Page)
   </td>
  </tr>
  <tr>
   <td>Challenge Non-Winner
   </td>
   <td>Challenge ends and user does not place Top 12
   </td>
   <td>🏁 {Challenge Title} has ended!
   </td>
   <td>See where you ranked on the leaderboard for {Challenge Title}
   </td>
   <td>Challenge Results Modal (on Challenge Detail Page)
   </td>
  </tr>
  <tr>
   <td>Challenge Joined
   </td>
   <td>User's join/participation in challenge was processed
   </td>
   <td>🎉 You're In!
   </td>
   <td>You’ve successfully joined the challenge: {Challenge Title}. Good luck!
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Join Failure
   </td>
   <td>User could not join challenge due to capacity met or other errror
   </td>
   <td>😕 Something Went Wrong
   </td>
   <td>Your entry couldn’t be processed. No funds were deducted. Please try again.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Cancelled
   </td>
   <td>Challege cancelled due to low participation (&lt;4 participants (played matches) on leaderboard)
   </td>
   <td>😕 {Challenge Title} has been cancelled!
   </td>
   <td>Fewer than 4 players qualified. Your entry fee has been refunded.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Leaderboard Position Change (Up/Down)
   </td>
   <td>User’s position on leaderboard changes
   </td>
   <td>📈 You moved to #{newPosition}!
   </td>
   <td>Keep playing to climb higher in {Challenge Title}.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>New Participant Joined
   </td>
   <td>Another user joins the same challenge
   </td>
   <td>👋 {username} just joined!
   </td>
   <td>The competition in {Challenge Title} is heating up. Jump back in!
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Starting Soon – 30 min
   </td>
   <td>30 minutes before challenge start
   </td>
   <td>⏳ {Challenge Title} starts in 30 min
   </td>
   <td>Get ready to play and secure your spot on the leaderboard.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Starting Soon – 3 min
   </td>
   <td>3 minutes before challenge start
   </td>
   <td>⚡ {Challenge Title} is about to start!
   </td>
   <td>Don’t miss the party! Time to get in the game.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Ending Soon – 30 min
   </td>
   <td>30 minutes before challenge ends
   </td>
   <td>⏳ {Challenge Title} ends in 30 min
   </td>
   <td>Last chance to improve your rank before time runs out!
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
  <tr>
   <td>Challenge Ending Soon – 3 min
   </td>
   <td>3 minutes before challenge ends
   </td>
   <td>⚡ {Challenge Title} is almost over!
   </td>
   <td>Just 3 minutes left. Now's your time to shine.
   </td>
   <td>Challenge Detail Page
   </td>
  </tr>
</table>



---


## **12) Admin & Ops**



* Admin panel: challenge CRUD; participant list; anti‑cheat flags; payout preview; manual settle/cancel; CSV exports; feature flags (UGC toggle). \

* Audit log of admin actions. \



---


## **13) Legal/Compliance Notes (Non‑binding)**



* Terms/Privacy hosted on **mythical.games** or **pulse.xyz** per org policy; in‑app surfaces link at sign‑up and join. \

* Regional restrictions and age gating TBD; organizer fee disclosures on join screen. \

* No gambling/wagering verbiage; “entry fees” and “skill competition.” \



---


## **14) Telemetry & Analytics (Snowplow)**


### **14.1 Core KPIs**



* Funnel: **signup → link Mythical → link wallet → join → place (ranked) → payout**. \

* Engagement: D1/D7/D30 retention; **active challenges joined/created**; **LLM image attach rate**. \

* Monetization: total entry volume by token/chain; dev/organizer fees; payout velocity. \



### **14.2 Event Schema (selected)**



* `auth_login_started` { method } \

* `auth_login_succeeded` { method, hasEmbeddedWallet } \

* `wallet_linked` { chain, wallet_type, is_default } \

* `username_set { length } \
`
* `join_blocked_missing_game_platform { challenge_id }` \

* `platform_linked `{ provider: 'MYTHICAL', scopes } \

* `challenge_created` { id, game, score_by, entry_token, fee_bps } \

* `challenge_join_started` { id, token, fee } \

* `challenge_join_confirmed` { id, tx_hash, wallet } \

* `leaderboard_update` { id, score_by, delta } \

* `payout_settled` { id, winners: [{rank, amount, wallet}], dev_fee, org_fee }
* 
* Page views on each page \

* All tracked with `user_id` and session context; PII minimized. \



---


## **15) Detailed Flows**


### **15.1 Sign Up / Sign In (Privy Integration)**

**Supported Login Methods:**



* **Email OTP** (Privy native)
* **SMS OTP** (Privy native)
* **Social SSO**: Apple, Google, Discord
* **External Wallets**: MetaMask, WalletConnect, Rainbow, Phantom
* **Passkey/WebAuthn** (Privy native)
* **MFA Support** (Privy native, post-login)

**Flow:**



1. User lands on Home (browsable without auth).
2. Click **Sign In** → Privy modal (Email OTP, Passkey, Discord, Google, Wallet, **Abstract**).
3. First-time users: complete auth → app **auto-provisions** **Embedded EVM** and **Embedded Solana** wallets.
4. If user signs in via **Abstract**, their **AGW** is created/linked during auth. Otherwise, they can **Connect Abstract** later in **Linked Wallets**.
5. **Required to complete registration:** **Choose your username** → validate + save (server enforces uniqueness).
6. **Not required to complete registration:** **Connect Your Game Account** (can skip; Join/Create will require per-challenge platform).
7. **Post-auth:** route to Challenges Home; user pill shows the **Embedded EVM** address; prompt to **link a game account (Mythical** Account) (required before Join Challenge)

**Privy Cross-App Ecosystem Integration:**



* Enable "Log in to Abstract" flow for Abstract L2 ecosystem wallets
* Support cross-app wallet sharing within Privy ecosystem
* Maintain wallet state across supported dApps

**Terms & Privacy:**



* Privy handles terms acceptance during signup flow
* Link to mythical.games/pulse.xyz privacy policy as required

**Edge Cases:**



* In-app browser OAuth fallback to OTP/SMS
* Wallet connection failures → retry with guidance
* Show Privy's native error handling UX


### **15.2 Profile Settings & Account Management (Privy UI)**

**Leverage Privy's existing UI screens for:**



* **Linked Accounts**: View/manage social logins (Apple, Google, Discord)
* **Security**: MFA setup, passkey management, password changes
* **Wallets**: View linked external wallets
    * **Export private key** for **Embedded EVM** and **Embedded Solana** only. **AGW and external wallets**: *no key export*.
* **Sessions**: Active device management, logout options
* **Connect Abstract**: create/link your Abstract Global Wallet (optional). If skipped, Abstract challenges use **Embedded EVM** by default. 

**Custom Pulse Settings (our UI):**



* **Username: **shows the current username. *(MVP: read-only; change disabled).*
* **Avatar (optional, future): **upload image, crop/preview.
* **Primary Wallet**: Set default per network (EVM/Abstract, Solana)
* **Notifications**: Opt-in/out of toast notifications per event type
* **Game Platforms (Mythical, etc.):** Link/unlink platform accounts; show displayName & games; re-link on token expiry.
* **Social Accounts:** **Manage Social Accounts** (opens Privy modal). Linking/revoking happens inside Privy; after completion, the app refreshes the current user. 


### **15.3 Join Challenge Flow (Transaction Signing)**

**Eligibility Check:** 



1. If `required_platform` is not linked for the user, prompt Connect Game Account (Mythical); upon success, continue to wallet selection; otherwise, cancel Join.

**Wallet Selection:**



1. User clicks **Join** on challenge detail page
2. **Join Drawer** shows: Entry fee, token/network, total cost estimate, selected wallet switcher
3. **Wallet Options**: All linked wallets (embedded + external) for the challenge's network
4. **Default**: User's preferred payout wallet for that network; fallback to embedded wallet

**External Wallet Flow (MetaMask, Rainbow, etc.):**



1. Select external wallet → Privy triggers wallet connection
2. Check token balance + allowance for entry fee
3. If insufficient allowance: Request **approve** transaction → user signs in wallet
4. Request **join/deposit** transaction → user signs in wallet
5. Both transactions show gas estimates in wallet UI

**Embedded Wallet Flow (Privy):**



1. Select embedded wallet → Privy handles internally
2. Check balance/allowance (same logic)
3. Privy's embedded wallet UI for transaction approval
4. User confirms via Privy's secure signing flow (biometric/PIN if configured)

**Abstract L2 Integration:**



* Support Privy's "Sign with Abstract" functionality
* Display Abstract network-specific gas estimates
* Handle Abstract L2 RPC calls via Privy connectors

**Error Handling:**



* Insufficient balance → Show "Add Funds" options or wallet switcher
* Transaction rejected → Retry guidance with clear error messaging
* Network switching prompts via Privy's network management


### **15.4 Challenge Creation & Contract Integration**

**Pre-Publishing (DRAFT state):**



1. Admin completes creation form → Save as DRAFT
2. No contract interaction yet
3. All fields remain editable

**Publishing Flow:**



1. Admin clicks **Publish** → Triggers contract deployment
2. **TEP Integration**: Call `createTournament(config)` → Returns `escrowId` and `escrowAddress`
3. Store contract references in database
4. Update challenge state: DRAFT → UPCOMING
5. **Configuration Lock**: Once first participant joins, challenge config becomes immutable

**Contract Association:**



* Each published challenge maps to unique escrow contract instance
* Entry fees flow to challenge-specific escrow address
* Settlement calls are sent directly to the **escrowAddress**; no ID parameter is used on-chain.


### **15.5 End & Settlement **

**Auto-Cancellation (≤3 participants):**



1. Check participant count 30 minutes before end
2. If ≤3 participants: Auto-cancel → Full refunds via **cancelIfUnderfilled(participantCount)**
3. UI notification: "Challenge cancelled - entry fees refunded"

**Normal Settlement (4+ participants):**



1. Challenge ends → Ingest final scores → Compute rankings
2. **Admin Review**: Preview winners & payout amounts
3. **Calculate Fees**: 8% dev + 0-10% organizer from total entry pool
4. **Apply Payout Logic**:
    * 4-11 participants: Use simplified redistribution (see detailed math below)
    * 12+ participants: Standard Top-12 split
5. **Contract Settlement: **Call **settle(winners[], resultsRoot, resultsURI)** on the per-challenge escrow.
6. **Payout Execution: **Tokens are sent to users’ **Primary** payout wallet for that network.
7. **UI Updates**: Show "SETTLED" state with transaction links


---


## **16) Third‑Party Tournament Escrow Provider (TEP) — Interface Requirements**


    We will evaluate providers that support **EVM (Abstract)** now and **Solana** next. If none satisfy both, we ship our own audited EVM contract now, and integrate a Solana program later.

**Must‑have API (conceptual):**



* `createTournament(CreateArgs) -> escrowAddress`
* `join(amount, permitOrPermit2)                     // called on the per-challenge escrow`
* `cancelIfUnderfilled(participantCount)             // called on the per-challenge escrow`
* `settle(winners[], resultsRoot, resultsURI)        // called on the per-challenge escrow \
`
* Events: `TournamentCreated, Seeded, Joined, Cancelled, Refunded,ResultsCommitted, FeePaid, WinnerPaid, Settled`
* Query methods: 
    * `getTournamentState(escrowId) → state, participants, totalDeposits`
    * `getParticipantDeposit(escrowId, participant) → amount, timestamp`

**Contract semantics:**



* Token‑agnostic (any ERC‑20); supports dynamic fee split recipients; safe math; reentrancy guards. \

* Admin/owner role for **operator** (Pulse) to trigger settle. \

* Pluggable **oracle hook** later for trustless result attestation. \


**If building in‑house (EVM v0):**



* Minimal `TournamentEscrow` + `PrizeDistributor` + **0xSplits** for dev/org fees. \

* Add **Chainlink Automation** to guard settle windows; **EAS** attestations for result proofs later. \



---


## **17) LLM Image Generation (Challenge Banners)**



* Prompt template swaps **NFL** assets for **Pudgy** style: cute arctic settings, celebratory confetti, abstracted jerseys with **no logos or numbers**, penguin mascots in generic gear; mobile‑safe focal point; text‑free images. \

* Admin preview & approve; fallback to a fixed safe set if model outputs fail policy checks. \


**Prompt scaffold (example):**


    “Create a dynamic, colorful banner for a **Pudgy Party** mobile game challenge titled ‘**Icy Sprint**’. Show cheerful, stylized penguin characters racing through a winter obstacle course with balloons, confetti, and glowing coin pickups. Avoid real logos, team branding, numbers, faces, or athletes. Keep composition center‑weighted for a 16:9 mobile banner. No text.”


---


## **18) UI/UX — Screens & Components**


### **18.1 Tech Stack & Libraries**



* **Next.js (App Router)**, **TypeScript**, **Tailwind**, **shadcn/ui**, **framer‑motion**, **wagmi/viem**, **Privy React SDK**. \



### **18.2 Global**



* App shell with sticky bottom nav (mobile): **Home**, **My Challenges**, **Create** (admin), **Profile**. \

* Theme: dark; subtle glass blur; rounded‑2xl; micro‑interactions on actions (join/settle). \



### **18.3 Home / Listings**



* Sections: Active, Happening Now, Upcoming. \

* Cards show: hero, title, game tag, time status, entry token/network + fee, prize pool (with USD est), joined indicator. \



### **18.4 Challenge Detail**



* Tabs: **Overview**, **Leaderboard**, **Rules**. \

* Overview shows: time remaining, entry details, fees disclosure (`Fees: 8% Dev + up to 10% Organizer`), prize pool calculator, **Join** CTA. \

* Leaderboard: top ranks with sticky your‑rank row; live deltas. \



### **18.5 Create/Edit (Admin)**



* Multi‑step wizard: Basics → Tokens & Fees → Schedule → Review. \

* Token selectors filtered by chain; validation on decimals/minimums. \



### **18.6 Profile**



* **Linked Accounts** (Mythical, Discord/Google), **Linked Wallets** (EVM/Solana), **Preferred Payouts**, **Export Embedded Key**, **Notifications** opt‑in/opt‑out. \



### **18.7 Microcopy (concise)**



* Prize pool note on Overview: “**MYTH prize pool** is funded by entry fees. Dev (8%) & Organizer (up to 10%) fees are deducted before payouts.” \



---


## **19) APIs & Data Contracts**


### **19.1 Public API (server routes)**



* `POST /api/auth/webhook` – Privy auth webhooks (user created/linked/unlinked) \

* `POST /api/platforms/mythical/oauth/callback `– link exchange (Mythical provider) \

* `POST /api/challenges` – admin create \

* `POST /api/challenges/{id}/publish` – create escrow + set UPCOMING \

* `POST /api/challenges/{id}/join` – record intent; return contract calldata; server signs `permit` if applicable \

* `POST /api/challenges/{id}/settle` – admin settle (payouts) \

* `POST /api/pudgy/webhook` – signed game events \

* `GET /v1/profile/username/available?username=` → `{ available: boolean } \
`
* `POST /v1/profile/username { username }` → 201 on success; 409 if taken/invalid.

 \



### **19.2 Webhook (Pudgy → Pulse)**


### **19.3 DB (Prisma schema excerpt)**


---


## **20) Fee & Payout Math (Deterministic)**

Given:



* `E = sum(entry_fees) \
`
* `dev = E * devFeeBps/10_000 \
`
* `org = E * orgFeeBps/10_000 \
`
* `P = E - dev - org \
`

Top‑12 weights `W = [45,18,10,5,5,5,2,2,2,2,2,2]` → normalized shares. \
 If `participants ≤ 3` → cancel & refund. \
 If `4 ≤ participants &lt; 12` → let `R = participants`; distribute `P` using the first `R` weights from the Top-12 table, then redistribute the remaining weight sum equally among those `R` positions (equal split across filled ranks).

**Precision:** Use integer math in token minimal units; only rounding down to avoid over‑distribution; Leftover ‘dust’ after integer math is added to rank #1.


---


## **21) Edge Cases & Fallbacks**



* Wallet rejected or insufficient allowance → show guided retry. \

* Token paused/blacklisted → block join; surface error. \

* Webhook outages → pause leaderboard updates; show timestamp of last update; allow manual upload CSV by admin for emergency settle (admin‑only). \

* Image gen fail → fallback to curated banner set. \



---


## **22) Performance & SLOs**



* P95 route latency &lt; 300ms (cached) / &lt; 800ms (uncached). \

* Leaderboard update fan‑out &lt; 3s to clients. \

* Join throughput: 50 TPS burst (queued/signature gating), 500 concurrent users browsing. \



---


## **23) Security Checklist**



* Strict Content Security Policy; isolate wallet iframes; same‑site cookies Lax; JWT exp ≤ 24h. \

* Reentrancy & checks‑effects‑interactions in any owned contracts; pause/guardian role. \

* Admin actions require 2FA + audit log. \



---


## **24) Instrumentation & Observability**



* Snowplow events as above; Sentry errors (frontend/backend); Log drains to Datadog. \

* Health endpoints + synthetic join/settle tests on cron. \



---


## **25) Rollout Plan**



* **Phase A (v0 POC)**: Abstract testnet; embedded wallets; admin‑only create; MYTH test token; end‑to‑end join→settle. \

* **Phase B**: Abstract mainnet; external wallets; MYTH on Abstract; production payouts; Pudgy ingested telemetry; image gen gating. \

* **Phase C**: Solana adapter for PENGU (Phantom payouts), cross‑chain token selector; oracle/attestation option. \



---


## **26) Implementation Tasks (Jira‑ready excerpts)**


    Use these as templates; break down further as needed. Each task has **User Story**, **Description**, **Tech Spec**, **Acceptance Criteria**.


### **26.1 Auth & Wallets**

**PCH‑A1 — Integrate Privy Auth & Embedded EVM Wallet (Next.js)**



* **Story:** As a user, I can sign in with OTP/social and receive an embedded EVM wallet. \

* **Spec:** Add `@privy-io/react-auth`, configure login methods, enable embedded wallets on login. \

* **AC:** OTP & Google sign‑in success; `user.wallets` contains an embedded wallet; can sign message; logout clears session. \


**PCH‑A2 — External Wallet Linking (EVM & Solana)**



* **Story:** As a user, I can link MetaMask and Phantom to my account. \

* **Spec:** Enable connectors, UI for link/unlink; show addresses under Profile. \

* **AC:** Link/unlink flows succeed; multiple wallets are shown; active wallet switcher on join. \


**PCH‑A3 — Preferred Payout Wallets**



* **Story:** I can set default payout wallets per network. \

* **Spec:** DB `WalletPref`; Profile UI; server validates address checksums. \

* **AC:** Payouts use selected wallet; update persists across sessions. \


**PCH‑A4 — Mythical OAuth Link**



* **Story:** I can link my Mythical account for scoring. \

* **Spec:** OAuth code grant; tokens stored encrypted; mapping table. \

* **AC:** Linked state shown; unlink revokes; webhook from Pudgy resolves to my user. \



### **26.2 Challenges & Contracts**

**PCH‑C1 — Challenge CRUD (Admin)**



* **Story:** Admin can create/edit/publish challenges. \

* **Spec:** Form wizard; validation; publish triggers escrow init (TEP stub). \

* **AC:** Challenge visible in listings; state transitions valid. \


**PCH‑C2 — Join Flow (EVM)**



* **Story:** I can pay the entry fee and join. \

* **Spec:** Allowance check, approve/permit → join; server records tx. \

* **AC:** User shows as participant; on‑chain join event present; UI success toast. \


**PCH‑C3 — Payout & Settle**



* **Story:** Admin can settle and winners get paid. \

* **Spec:** Compute shares; call TEP `settle`; write payout receipts. \

* **AC:** Winners’ wallets receive tokens; fees routed; explorer links shown. \



### **26.3 Leaderboards & Telemetry**

**PCH‑L1 — Pudgy Webhook Ingestion**



* **Story:** Scores update in near real‑time. \

* **Spec:** Signed JWT webhook; idempotent upsert; aggregate by challenge/time window & metric. \

* **AC:** Live leaderboard updates; replay safe. \


**PCH‑L2 — Snowplow Schema & Emitters**



* **Story:** Product can analyze conversion & payouts. \

* **Spec:** Implement events; context schema; server‑side forwarding for sensitive events. \

* **AC:** Dashboard shows funnel; sample data validated. \



### **26.4 Images & UI**

**PCH‑I1 — LLM Banner Generation + Review Queue**



* **Story:** Admin can generate/approve a safe banner per challenge. \

* **Spec:** Prompt templates; moderation checks; asset CDN. \

* **AC:** Approved image attaches; fallback on failure. \


**PCH‑U1 — Gamified Toasts**



* **Story:** I get delightful, timely nudges. \

* **Spec:** Toast queue with rate limit; standardized variants; deeplinks. \

* **AC:** Toasters appear per triggers; a11y & motion‑reduced variants. \



---


## **27) Open Questions**



* Preferred **TEP** candidates for EVM+Solana? If none, green‑light in‑house EVM escrow now + Solana program later. \

* Regulatory review for multi‑region token entry fees; any blocked geos? \

* Who owns dev fee wallet(s) and revenue accounting flow? \

* Final domain policy (mythical.games vs pulse.xyz) for Terms/Privacy links. \



---


## **28) Risks & Mitigations**



* **Multi‑chain complexity** → Stage Solana integration; start EVM on Abstract first. \

* **Oracle/trust** → Use server‑signed telemetry initially; plan oracle vendor RFP. \

* **Fraud/abuse** → Rate limits, anomaly detection, admin reviews, capped entries/user. \

* **Token volatility** → Price display is informational; payouts based on token amounts. \



---


## **29) Glossary (A–Z)**

**Joiners** = wallets that paid the entry to a challenge. 

** \
Participants** = wallets that recorded ≥1 match (appear on leaderboard).


## **0xSplits** — On-chain protocol that splits incoming funds (ETH/ERC‑20) to multiple recipients based on fixed percentages. Useful for automatically routing **Developer** and **Organizer** fees during settlement.


## **Account Abstraction (AA, ERC‑4337)** — A framework that lets **smart‑contract wallets** behave like normal accounts. Enables features like **gas sponsorship** (Paymasters), **bundled actions**, and **social recovery** using a new transaction type called a **UserOperation** handled by **Bundlers**.


## **Admin / Operator** — Privileged role (backend and/or contract) allowed to publish challenges, trigger settlement, cancel, and manage fee destinations. All actions are audited.


## **Allowance** — ERC‑20 approval amount a user grants to a contract (e.g., escrow) allowing it to move tokens up to a limit; set via approve() or signed **Permit**.


## **Allowlist (Token)** — Curated list of tokens/networks permitted for entry fees and prize pools.


## **API Route** — Next.js server endpoint (e.g., /api/challenges/{id}/join) used by the web app for challenge CRUD, join orchestration, webhooks, and settlements.


## **Attestation (EAS)** — Verifiable claim recorded on-chain (e.g., final results attested by Pulse or an oracle). Optional future trust layer.


## **Basis Points (BPS)** — Finance unit of one‑hundredth of a percent: 1 bps = 0.01%. Example: 8% developer fee = **800 bps**.


## **BigQuery / Looker** — Data warehouse and BI stack receiving Snowplow events for dashboards (funnel, engagement, revenue).


## **Bundler (4337)** — Network service that collects **UserOperations** from smart‑contract wallets and submits them to the chain as transactions.


## **Cancelation Rules** — Automatic outcomes based on participation thresholds (e.g., ≤3 participants → cancel & full refunds; 4–11 → fallback distribution).


## **Chain ID** — Numeric identifier for a blockchain network (used by wallets/RPC). Example: each EVM chain/L2 has a unique Chain ID.


## **Chainlink Automation** — Scheduled/triggered jobs run by Chainlink nodes (a possible guardrail to enforce settle windows on EVM).


## **Challenge (Object)** — Core tournament entity with title, schedule, scoring mode, token/network, fees, and prize configuration; transitions through states **DRAFT → UPCOMING → LIVE → ENDED → SETTLED/CANCELLED**.


## **CoinGecko API** — Price feed used to show USD approximations for tokens (server‑side cached).


## **CSRF** — Cross‑Site Request Forgery protections for state‑changing HTTP requests (join/create/settle).


## **Custodial vs. Non‑custodial Wallet** — Custodial keys are held by a service; non‑custodial keys are controlled by the user (e.g., Privy embedded wallet with export enabled, or MetaMask/Phantom).


## **DB / Prisma / Postgres / Neon** — Application database (Postgres) accessed via Prisma ORM; Neon provides serverless Postgres hosting.


## **EOA (Externally Owned Account)** — A regular EVM wallet controlled by a private key (e.g., MetaMask address). Contrasts with **smart‑contract wallets**.


## **EVM (Ethereum Virtual Machine)** — Execution environment for Ethereum‑style smart contracts. “EVM‑compatible” chains (e.g., L2s) run the same bytecode/tooling.


## **ERC‑20 / ERC‑721 / ERC‑1155** — Token standards on EVM chains for fungible tokens (ERC‑20) and NFTs (721 single‑id, 1155 multi‑token).


## **Escrow (Tournament)** — Smart contract or provider holding entry fees during a challenge; releases funds on **settlement** per rules and fee splits.


## **Explorer** — Public web UI (e.g., block explorer) for viewing transactions, addresses, and contract state.


## **Fees (Developer / Organizer)** — Percentages of the **total entry pool** routed to the developer (default 8%) and organizer (0–10%) **before** player payouts.


## **Feature Flags** — Runtime switches to enable/disable functionality (e.g., UGC creation) per env/user cohort.


## **FusionAuth (OAuth2)** — Identity provider used by Mythical; we link users’ Mythical accounts via OAuth to fetch gameplay stats.


## **Gas** — Network fee paid to execute a transaction (in the chain’s native token).


## **Gas Sponsorship / Paymaster** — In ERC‑4337, a **Paymaster** can subsidize or charge a different token for gas on behalf of a user’s smart‑contract wallet.


## **Idempotency** — Property of API/webhook processing where repeated requests with the same key produce one effect (prevents duplicate score inserts).


## **Join (Flow)** — Client and contract sequence where a participant approves (or Permits) the entry token, then deposits into tournament escrow.


## **JSON Web Token (JWT)** — Signed token encoding user/session claims; used for authenticated API calls (short expiry, rotated).


## **KYC/AML** — Know‑Your‑Customer / Anti‑Money Laundering checks. Out of scope for POC; may affect regional access/payout thresholds later.


## **Leaderboard** — Real‑time ranking list calculated from Pudgy telemetry (e.g., Top‑1/Top‑3/Top‑10 finishes; Coins Earned) within the challenge window.


## **LLM Image Generation** — Automated banner art creation from prompts with content guardrails (no logos, faces, or trademarked assets).


## **L1 / L2** — Layer‑1 base chains (e.g., Ethereum, Solana) vs. Layer‑2 networks built atop an L1 (e.g., EVM L2s) for scalability and lower fees.


## **MetaMask / Phantom** — Popular external wallets for EVM (MetaMask) and Solana (Phantom). Users can link them via Privy.


## **MYTH / PENGU** — Project tokens used for entry fees/prizes (MYTH on Abstract L2; PENGU on Solana and Abstract ecosystem)


## **NFT** — Non‑fungible token representing unique assets (e.g., ERC‑721 on EVM, SPL NFT on Solana). 


## **Oracle (Results)** — External data attester that posts/verifies tournament outcomes on‑chain. We start with server‑signed scores; oracle integration is a future enhancement.


## **Permit (EIP‑2612) / Permit2** — Signed approvals allowing a contract to transfer ERC‑20 tokens without a separate on‑chain approve() (gas/user‑flow optimization). **Permit2** is a generalized approval system.


## **Payout (Settlement)** — Final distribution of escrowed funds after fees. Implements Top‑12 split, or fallback splits for 4–11 participants; transaction(s) recorded and linked in UI.


## **Post‑fee Prize Pool (P)** — P = sum(entries) − developerFee − organizerFee; basis for Top‑12 payouts.


## **Preferred Payout Wallet** — User‑selected wallet per network where winnings are sent (e.g., Abstract EVM address, Solana address).


## **Privy** — Auth + wallet toolkit providing social/OTP login, **embedded** non‑custodial EVM wallets (exportable), and external wallet linking (EVM + Solana) with transaction signing.


## **RPC Endpoint** — Remote node URL used by the app to read/write blockchain state.


## **Score‑by Methods** — Challenge scoring modes for Pudgy Party: **Top‑1/Top‑3/Top‑10 finishes** and **Coins Earned** (sum). Higher is better unless specified.


## **Server‑signed Telemetry** — Game server posts signed webhooks with match outcomes; Pulse verifies signatures before updating leaderboards.


## **SIWE / SIWS** — **Sign‑In With Ethereum** / **Sign‑In With Solana** message‑signature login flows that prove wallet control without sharing keys.


## **Smart‑contract Wallet** — Wallet implemented as a contract (vs. EOA), enabling AA features like session keys, spending limits, social recovery.


## **Snowplow** — Event analytics SDK + pipeline feeding product metrics (funnel, retention, revenue) into BigQuery/Looker.


## **SPL (Solana Program Library)** — Solana’s token/NFT standard stack (SPL tokens are the canonical fungible tokens on Solana).


## **TEP (Tournament Escrow Provider)** — Third‑party or in‑house smart‑contract system handling tournament **escrow, joins, cancellations, and settlement**, with fee routing.


## **Token (Fungible)** — Blockchain asset with decimals and supply (e.g., MYTH ERC‑20, PENGU SPL). Distinct from NFTs.


## **Top‑12 Distribution** — Default payout weights of **45/18/10/5/5/5/2/2/2/2/2/2** applied to the **post‑fee** pool. Low‑participation rules adjust payouts or cancel.


## **UserOperation (4337)** — Data structure representing an intended action by a smart‑contract wallet; submitted by a bundler and executed on-chain.


## **Vercel / Next.js** — Hosting and framework used for the web app (edge‑friendly, preview deployments, App Router, API routes, ISR/SSR support).


## **Viem / wagmi** — Type‑safe EVM tooling and React hooks for wallet connection, reads/writes, and contract calls.


## **WebAuthn / Passkey** — Passwordless authentication using platform authenticators (biometrics, device security keys).


## **Webhook** — Server‑to‑server HTTP callback used for events (e.g., match results). Must be authenticated, signed, and idempotent.


## **WebSockets / Real‑time** — Pub/sub channel for live leaderboard updates and in‑app toasts (e.g., position changes, payout confirmations).

**Game Platform** — An external identity provider for gameplay/telemetry (v0: **Mythical/FusionAuth**). Users link a platform account so Pulse can verify scores and associate gameplay with their profile. \


**GamePlatformAccount** — Pulse record mapping `{provider, accountId, displayName, games[]}` to a user; used to gate **Join** and resolve webhook payloads to users. 


## **30) Appendix**



* **Top‑12 table** and fallback math proofs. \

* **Error code catalog** for wallet and contract failures.

** \
30.1 Pulse User Object — Example Payload**


```
{
  "id": "usr_2e1c...",
  "createdAt": "2025-09-18T18:12:33Z",
  "username": "pengu_pro",
  "usernameNormalized": "pengu_pro",
  "wallets": {
    "embeddedEvm": { "address": "0x12ab...cdef" },
    "embeddedSol": { "address": "6Jsd...PQeX" },
    "abstract": null,
    "externals": [
      { "chain": "evm", "address": "0x9f88...42A1", "label": "MetaMask" }
    ]
  },
  "primaryWallets": {
    "evmOrAbstract": "0x12ab...cdef",
    "solana": "6Jsd...PQeX"
  },
  "gamePlatforms": [
    {
      "provider": "MYTHICAL",
      "accountId": "myth_abc123",
      "displayName": "PudgyFan",
      "games": ["PUDGY_PARTY","NFL_RIVALS"],
      "linkedAt": "2025-09-18T18:15:04Z"
    }
  ],
  "socialAccounts": {
    "source": "privy",
    "linkedAccounts": [
      { "provider": "google", "linkedAt": "2025-09-18T18:12:30Z" }
    ],
    "hasAny": true
  },
  "eligibility": {
    "hasUsername": true,
    "hasRequiredPlatformForChallenge": false
  },
  "preferences": {
    "notifications": { "challenge_starting": true, "challenge_ending": true }
  },
  "walletPref": {
    "evmPayoutAddr": "0x12ab...cdef",
    "solPayoutAddr": "6Jsd...PQeX"
  }
}
