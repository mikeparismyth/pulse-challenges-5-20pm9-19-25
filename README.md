# Pulse Challenges

A responsive web application for competitive gaming challenges with multi-chain wallet integration and real-time leaderboards. Built with Next.js, TypeScript, and designed for seamless mobile and desktop experiences.

## Project Overview

Pulse Challenges enables users to create, join, and compete in skill-based gaming tournaments with cryptocurrency entry fees and prizes. The platform supports multiple games (Pudgy Party, NFL Rivals) with integrated leaderboards, platform requirement validation, and secure wallet connections.

**Current Status**: Production-ready frontend with complete authentication system, platform requirement validation, and challenge terminology consistency. Ready for backend API integration.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library (40+ components)
- **Authentication**: Privy SDK integration (mocked, ready for production)
- **Styling**: Glassmorphism design system with purple/teal gradient themes
- **State Management**: React state with localStorage session simulation
- **Deployment**: Vercel-ready with automatic preview deployments

### Core Systems

#### Authentication & User Management
- **Progressive Authentication**: Email/SMS OTP, social logins (Google, Discord, X, Telegram), wallet connections
- **Platform Integration**: Mythical Games OAuth for Pudgy Party/NFL Rivals access
- **Wallet Support**: Embedded EVM/Solana wallets (auto-provisioned), external wallet connections (MetaMask, Phantom, etc.)
- **Username System**: PRD-compliant validation with real-time availability checking

#### Challenge System
- **Multi-Game Support**: Pudgy Party and NFL Rivals with game-specific modes and scoring
- **Entry Types**: Cryptocurrency entry fees (MYTH, PENGU, USDC) with USD conversion display
- **Leaderboards**: Real-time scoring with multiple metrics (Top-1/3/10 finishes, coins earned, points scored)
- **Platform Requirements**: Challenge-specific platform validation (blocks join without required game platform)

#### Game Platform Integration
- **Mythical Games**: OAuth integration for Pudgy Party and NFL Rivals
- **Multi-Game Accounts**: Single platform connection works across multiple supported games
- **Real-Time Validation**: Platform requirement checking before challenge entry

## Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── challenge/[id]/           # Individual challenge pages
│   ├── challenges/               # Challenge browsing and filtering
│   ├── create/                   # Challenge creation (admin-only)
│   ├── profile/                  # User profile and settings
│   └── page.tsx                  # Homepage with featured challenges
├── components/
│   ├── auth/                     # Authentication modals and flows
│   │   ├── PrivySignInModal.tsx  # Progressive auth with 7 sign-in methods
│   │   ├── ConnectGameAccountModal.tsx # Game platform linking
│   │   └── RequiredPlatformModal.tsx   # Platform requirement blocking
│   ├── navigation/               # Header, bottom nav, notifications
│   ├── ui/                       # shadcn/ui component library (40+ components)
│   ├── ChallengeCard.tsx        # Game-themed challenge display cards
│   ├── ChallengeFilters.tsx     # Challenge filtering system
│   ├── FeaturedChallengesCarousel.tsx # Homepage hero carousel
│   ├── JoinChallengeModal.tsx   # Challenge entry flow with wallet selection
│   └── TransactionSigningModals.tsx   # Multi-wallet transaction flows
└── lib/
    ├── auth.ts                   # Authentication state management
    ├── mockData.ts              # Centralized challenge data (single source of truth)
    ├── types.ts                 # TypeScript interfaces (PRD-compliant)
    ├── mockChallengeParticipation.ts # Challenge participation tracking
    └── useWalletConnections.ts  # Wallet state management
```

## Key Features

### Complete Authentication System
- **7 Sign-in Methods**: Email OTP, SMS OTP, wallet connections, social logins
- **Embedded Wallets**: Auto-provisioned EVM and Solana wallets (exportable private keys)
- **External Wallet Support**: MetaMask, Rainbow, Coinbase Wallet, Phantom
- **Abstract Global Wallet**: Optional smart wallet integration
- **Session Management**: Persistent user sessions with proper cleanup

### Platform Requirement System
- **Game-Specific Validation**: Challenges require specific platform accounts (e.g., Mythical for Pudgy Party)
- **Smart Blocking**: Users cannot join challenges without required platform connections
- **Multi-Game Support**: Single platform connection enables access across multiple games
- **Three-State Flow**: Disconnected → Connecting → Connected with auto-progression

### Challenge Management
- **Centralized Data**: Single source of truth in `lib/mockData.ts` for all challenge data
- **Game Theming**: Dynamic styling and assets based on game type (Pudgy Party vs NFL Rivals)
- **Consistent Terminology**: Complete "challenge" labeling throughout (no "tournament" references)
- **PRD Compliance**: Challenge interface matches backend webhook schemas exactly

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile with desktop support
- **Glassmorphism**: Modern design system with backdrop blur and gradient overlays
- **Game Theming**: Dynamic colors and assets per game type
- **Micro-Interactions**: Smooth animations and hover effects throughout
- **Accessibility**: Semantic markup and keyboard navigation support

## Development Status

### Phase B2 Complete: Platform Requirement Integration
- ✅ RequiredPlatformModal with game-specific messaging
- ✅ Challenge-specific platform validation and blocking
- ✅ Multi-game platform support (single Mythical → all games)
- ✅ Auto-progression from platform connection to join modal
- ✅ Complete modal state management and exit handling

### Challenge Terminology Cleanup Complete
- ✅ Complete interface overhaul (Tournament → Challenge)
- ✅ Component renaming (TournamentCard.tsx → ChallengeCard.tsx)
- ✅ UI text consistency (all user-facing text uses "challenge")
- ✅ NFL Rivals mode updates (SEASON/PLAYOFFS/TOURNAMENT → ALL_MODES/STADIUMS/EVENT/LEAGUE)
- ✅ Type system cleanup with zero compilation errors

### Quality Metrics
- **Authentication Flows**: Complete end-to-end user flows working
- **Platform Blocking**: Proper challenge entry prevention without required platforms
- **Form Validation**: Real-time username validation and state persistence
- **TypeScript**: Strict mode with comprehensive type coverage
- **Mock Integration**: Ready for API replacement with clear integration points

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd pulse-challenges

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Setup
The application currently runs with mock data and simulated authentication. No environment variables required for development.

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript compilation check
```

## Mock Data & API Integration

### Current Mock Implementation
All data and authentication flows use mock implementations with clear replacement points:

```typescript
// lib/mockData.ts - Challenge data
// MOCK: Replace with API call to /api/challenges
export const mockChallenges: Challenge[] = [...]

// lib/auth.ts - Authentication
// MOCK: Replace with Privy React SDK integration

// Platform validation
// MOCK: Replace with API call to /api/platforms/mythical/status
```

### API Integration Points
Ready for backend integration with documented endpoints:
- `GET /api/challenges` - Challenge listings
- `GET /api/challenges/[id]` - Individual challenge details
- `POST /api/challenges` - Challenge creation
- `GET /api/profile` - User profile data
- `POST /api/platforms/mythical/oauth` - Game platform linking
- `GET /api/platforms/mythical/status` - Platform validation

## Game Configuration

### Supported Games
- **Pudgy Party**: Battle Royale, All Modes, Event challenges
- **NFL Rivals**: All Modes, Stadiums, Event, League challenges

### Game Modes & Scoring
```typescript
// Pudgy Party scoring options
'TOP1_COUNT' | 'TOP3_COUNT' | 'TOP10_COUNT' | 'COINS_EARNED'

// NFL Rivals scoring options  
'POINTS_SCORED' | 'WINS' | 'TOUCHDOWNS'
```

### Platform Requirements
- **Pudgy Party**: Requires Mythical Games account
- **NFL Rivals**: Requires Mythical Games account
- **Extensible**: Easy to add new platform requirements per game

## Deployment

### Vercel Deployment (Recommended)
- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variables managed through Vercel dashboard

### Build Output
- Static files optimized for CDN delivery
- Server-side rendering for SEO
- Dynamic imports for code splitting

## Contributing

### Code Style
- TypeScript strict mode required
- ESLint configuration enforced
- Tailwind CSS for styling
- Component composition over inheritance

### Mock Integration Guidelines
When replacing mock implementations:
1. Maintain existing TypeScript interfaces
2. Preserve component prop contracts
3. Update mock replacement comments
4. Test authentication flows end-to-end

### Testing Approach
- Manual testing for user flows
- Component integration testing
- TypeScript compilation validation
- Cross-browser compatibility

## Known Issues
- Minor console warning: Duplicate React keys in OTP input fields (development-only, non-blocking)
- Ready for resolution in cleanup session

## Architecture Decisions

### Why Next.js App Router
- Server-side rendering for SEO
- File-based routing simplicity
- API routes for backend integration
- Vercel optimization

### Why Privy for Authentication
- Progressive web3 onboarding
- Embedded wallet auto-provisioning
- Social login integration
- Multi-chain wallet support

### Why TypeScript Strict Mode
- Compile-time error prevention
- Enhanced developer experience
- API contract enforcement
- Refactoring confidence
