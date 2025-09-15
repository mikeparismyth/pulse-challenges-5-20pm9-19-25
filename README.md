# Pulse Challenges - Tournament Platform

## Overview
Gaming tournament platform built with Next.js 14, featuring glassmorphism design and comprehensive wallet integration flows.

## Development Status
- **Current Phase**: Mock data consolidation and wallet flow fixes
- **Live Demo**: https://next-js-14-gaming-to-cbye.bolt.host
- **Documentation**: See HANDOFF.md for current development state

## Tech Stack
- Next.js 14.2.15 LTS with App Router
- TypeScript strict mode
- shadcn/ui component library (40+ components integrated)
- Tailwind CSS with glassmorphism design system
- Framer Motion for animations

## Project Structure
app/
├── challenge/[id]/     # Dynamic challenge pages
├── challenges/         # Tournament listings
├── create/            # Admin tournament creation
└── profile/           # User profile management
components/
├── ui/                # shadcn/ui components
├── wallet/           # Wallet connection & transaction flows
└── challenge/        # Tournament-specific components
lib/
├── types.ts          # PRD-compliant data models
├── mockData.ts       # Centralized mock data
└── utils.ts          # Helper functions

## Getting Started
```bash
npm install
npm run dev
```

## Engineer Handoff Ready
- Mock APIs match PRD webhook schemas exactly
- Component architecture prepared for Privy SDK integration
- TypeScript interfaces ready for backend API replacement
- Clean separation between UI logic and data layer