import React from 'react';
import { mockTournaments } from '@/lib/mockData';

// MOCK: Replace with API call to /api/challenges for static generation
// Server component for static generation
export async function generateStaticParams() {
  return mockTournaments.map((tournament) => ({
    id: tournament.id,
  }));
}

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}