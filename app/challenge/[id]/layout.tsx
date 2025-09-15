import React from 'react';

// Server component for static generation
export async function generateStaticParams() {
  return [
    { id: 'tournament-1' },
    { id: 'tournament-2' },
    { id: 'tournament-3' },
    { id: 'tournament-4' },
    { id: 'tournament-5' },
    { id: 'tournament-6' },
  ];
}

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}