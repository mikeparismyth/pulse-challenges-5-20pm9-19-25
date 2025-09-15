'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, Smartphone, Shield, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { availableWallets } from '@/lib/mockWalletData';
import { ConnectedWallet } from '@/lib/mockWalletData';

interface JoinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletFlowStart: (walletType: string) => void;
  getConnectedWallet: (walletId: string) => ConnectedWallet | undefined;
  formatWalletAddress: (address: string) => string;
  challenge: {
    title: string;
    entryFee: string;
    prizePool: string;
    organizerFeeBps?: number;
    developerFeeBps?: number;
  };
}

export default function JoinChallengeModal({ 
  isOpen, 
  onClose, 
  onWalletFlowStart, 
  getConnectedWallet,
  formatWalletAddress,
  challenge 
}: JoinChallengeModalProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string>('');

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPaymentMethod('');
      setAcceptedTerms(false);
      setConnectingWallet('');
    }
  }, [isOpen]);

  // Extract token info from entry fee
  const extractTokenInfo = (tokenStr: string) => {
    const match = tokenStr.match(/^([\d,]+)\s+(\w+)$/);
    if (match) {
      const amount = match[1];
      const symbol = match[2];
      const rates: { [key: string]: number } = {
        'MYTH': 0.02,
        'PENGU': 0.15
      };
      const numAmount = parseFloat(amount.replace(/,/g, ''));
      const usdValue = numAmount * (rates[symbol] || 0.01);
      return { amount, symbol, usdValue };
    }
    return { amount: tokenStr, symbol: '', usdValue: 0 };
  };

  const entryInfo = extractTokenInfo(challenge.entryFee);
  const networkFeeUsd = 0.02; // Estimated gas fee
  const totalCostUsd = entryInfo.usdValue + networkFeeUsd;
  
  // Fee percentages for disclosure
  const developerFeePercent = ((challenge.developerFeeBps || 800) / 100).toFixed(0);
  const organizerFeePercent = ((challenge.organizerFeeBps || 0) / 100).toFixed(0);

  // Get payment methods with real connection status
  const paymentMethods = availableWallets;

  const handlePaymentMethodSelect = (methodId: string) => {
    const connectedWallet = getConnectedWallet(methodId);
    
    if (connectedWallet || methodId === 'card') {
      // Wallet is connected or it's a card payment - allow selection
      setSelectedPaymentMethod(methodId);
    } else {
      // Wallet is not connected - trigger connection flow first
      console.log('🔗 Wallet not connected, starting connection flow for:', methodId);
      handleWalletConnection(methodId);
    }
  };

  const handleWalletConnection = (walletType: string) => {
    console.log('🔗 Starting wallet connection for:', walletType);
    setConnectingWallet(walletType);
    // Start wallet connection flow
    onWalletFlowStart(walletType);
  };

  const canJoinChallenge = selectedPaymentMethod && acceptedTerms && (selectedPaymentMethod === 'card' || getConnectedWallet(selectedPaymentMethod));

  const handleJoinChallenge = () => {
    console.log('🚀 handleJoinChallenge called');
    console.log('📋 selectedPaymentMethod:', selectedPaymentMethod);
    console.log('✅ acceptedTerms:', acceptedTerms);
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    // Skip wallet check for card payments
    if (selectedPaymentMethod !== 'card') {
      const connectedWallet = getConnectedWallet(selectedPaymentMethod);
      if (!connectedWallet) {
        toast.error('Please connect your wallet first');
        return;
      }
    }
    
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    // Route to transaction signing for connected wallets
    console.log('🔄 Routing to transaction signing for:', selectedPaymentMethod);
    onWalletFlowStart(selectedPaymentMethod);
    console.log('✅ handleJoinChallenge completed');
  };

  const handleClose = () => {
    setSelectedPaymentMethod('');
    setAcceptedTerms(false);
    setConnectingWallet('');
    onClose();
  };

  return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
              onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-lg bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-gaming-card overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Join Challenge</h2>
                    <p className="text-sm text-gray-400 mt-1 truncate">{challenge.title}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cost Breakdown */}
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Entry Fee</span>
                      <span className="text-sm text-white font-medium">
                        {entryInfo.amount} {entryInfo.symbol} (${entryInfo.usdValue.toFixed(2)})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Network Fee</span>
                      <span className="text-sm text-white">~${networkFeeUsd.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-700/50 my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium text-white">Total</span>
                      <span className="text-base font-semibold text-[#30FFE6]">
                        {entryInfo.amount} {entryInfo.symbol} + gas (~${totalCostUsd.toFixed(2)})
                      </span>
                    </div>
                  </div>
                  
                  {/* Fee Disclosure */}
                  <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tournament fees (Developer: {developerFeePercent}%, Organizer: {organizerFeePercent}%) will be deducted from the total prize pool at tournament completion.
                    </p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-300 mb-4">Select Payment Method</h3>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.id === 'abstract' ? Shield :
                                   method.id === 'pulse' ? Zap :
                                   method.id === 'metamask' ? Wallet :
                                   method.id === 'walletconnect' ? Smartphone :
                                   method.id === 'card' ? CreditCard :
                                   Wallet;
                      const isSelected = selectedPaymentMethod === method.id;
                      const connectedWallet = getConnectedWallet(method.id);
                      
                      return (
                        <button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'border-[#8E1EFE] bg-[#8E1EFE]/10'
                              : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isSelected ? 'bg-[#8E1EFE]/20' : 'bg-gray-700/50'
                            }`}>
                              <Icon className={`w-5 h-5 ${
                                isSelected ? 'text-[#8E1EFE]' : 'text-gray-400'
                              }`} />
                            </div>
                            <div className="text-left">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-white">
                                  {method.name}
                                </span>
                                {method.recommended && (
                                  <Badge className="bg-[#30FFE6]/20 text-[#30FFE6] border-[#30FFE6]/30 text-xs">
                                    Recommended
                                  </Badge>
                                )}
                                {method.default && (
                                  <Badge className="bg-gray-600/20 text-gray-300 border-gray-600/30 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-400">{method.description}</p>
                              {connectedWallet && (
                                <p className="text-xs text-gray-500 font-mono">
                                  {formatWalletAddress(connectedWallet.address)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {connectedWallet || method.id === 'card' ? (
                              <>
                                {connectedWallet && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                    Connected
                                  </Badge>
                                )}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected ? 'border-[#8E1EFE] bg-[#8E1EFE]' : 'border-gray-600'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </>
                            ) : (
                              <div
                                className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                  connectingWallet === method.id 
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                                    : 'bg-[#30FFE6] hover:bg-[#30FFE6]/90 text-gray-900 cursor-pointer'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (connectingWallet !== method.id) {
                                    handleWalletConnection(method.id);
                                  }
                                }}
                              >
                                {connectingWallet === method.id ? 'Connecting...' : 'Connect'}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms and Join Button */}
                <div className="p-6 border-t border-gray-700/50">
                  <div className="flex items-start space-x-3 mb-6">
                    <button
                      onClick={() => setAcceptedTerms(!acceptedTerms)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        acceptedTerms
                          ? 'border-[#8E1EFE] bg-[#8E1EFE]'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {acceptedTerms && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div className="text-sm text-gray-400">
                      I agree to the{' '}
                      <span className="text-[#30FFE6] hover:underline cursor-pointer">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="text-[#30FFE6] hover:underline cursor-pointer">
                        Privacy Policy
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleJoinChallenge}
                    disabled={!canJoinChallenge}
                    className="w-full btn-gaming-primary text-base py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedPaymentMethod && !getConnectedWallet(selectedPaymentMethod) 
                      ? `Connect ${availableWallets.find(w => w.id === selectedPaymentMethod)?.name}`
                      : `Join Challenge - ${entryInfo.amount} ${entryInfo.symbol}`
                    }
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
  );
}