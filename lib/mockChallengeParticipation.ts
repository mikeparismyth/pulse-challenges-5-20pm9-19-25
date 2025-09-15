// Mock challenge participation data - easily replaceable with API calls
'use client';

export interface ChallengeParticipation {
  id: string;
  userId: string;
  challengeId: string;
  status: 'JOINED' | 'COMPLETED' | 'CANCELLED';
  joinedAt: string;
  completedAt?: string;
  entryTxHash?: string;
  payoutTxHash?: string;
  finalRank?: number;
  prizeAmount?: string;
}

// Mock participation data - empty initially
export const mockParticipations: ChallengeParticipation[] = [];

// Helper functions for engineers to replace easily
export function getUserChallengeParticipation(userId: string, challengeId: string): ChallengeParticipation | undefined {
  return mockParticipations.find(p => p.userId === userId && p.challengeId === challengeId);
}

export function hasUserJoinedChallenge(userId: string, challengeId: string): boolean {
  return mockParticipations.some(p => p.userId === userId && p.challengeId === challengeId && p.status === 'JOINED');
}

export function joinChallenge(userId: string, challengeId: string, txHash: string): ChallengeParticipation {
  const participation: ChallengeParticipation = {
    id: `participation_${Date.now()}`,
    userId,
    challengeId,
    status: 'JOINED',
    joinedAt: new Date().toISOString(),
    entryTxHash: txHash
  };
  
  // Add to mock data
  mockParticipations.push(participation);
  
  return participation;
}

export function getUserParticipations(userId: string): ChallengeParticipation[] {
  return mockParticipations.filter(p => p.userId === userId);
}

export function completeChallenge(
  userId: string, 
  challengeId: string, 
  finalRank: number, 
  prizeAmount?: string,
  payoutTxHash?: string
): ChallengeParticipation | null {
  const participation = getUserChallengeParticipation(userId, challengeId);
  if (!participation) return null;
  
  participation.status = 'COMPLETED';
  participation.completedAt = new Date().toISOString();
  participation.finalRank = finalRank;
  participation.prizeAmount = prizeAmount;
  participation.payoutTxHash = payoutTxHash;
  
  return participation;
}

export function cancelChallengeParticipation(userId: string, challengeId: string): ChallengeParticipation | null {
  const participation = getUserChallengeParticipation(userId, challengeId);
  if (!participation) return null;
  
  participation.status = 'CANCELLED';
  
  return participation;
}

export function getChallengeParticipants(challengeId: string): ChallengeParticipation[] {
  return mockParticipations.filter(p => p.challengeId === challengeId);
}

export function getChallengeParticipantCount(challengeId: string): number {
  return mockParticipations.filter(p => p.challengeId === challengeId && p.status === 'JOINED').length;
}

// For engineers: Replace these functions with real API calls
// Example: joinChallenge becomes await api.joinChallenge(userId, challengeId, txHash)
// Example: getUserParticipations becomes await api.getUserParticipations(userId)
// Example: hasUserJoinedChallenge becomes await api.hasUserJoinedChallenge(userId, challengeId)