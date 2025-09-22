import React from 'react';
import { mockChallenges } from '@/lib/mockData';

// MOCK: Replace with API call to /api/challenges for static generation
// Server component for static generation
export async function generateStaticParams() {
  return mockChallenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}