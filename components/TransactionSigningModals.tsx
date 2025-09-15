'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2, Shield, Wallet, CreditCard, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ConnectedWallet } from '@/lib/mockWalletData';

interface TransactionSigningModalsProps {
  isOpen: boolean;
  walletType: string;
  onClose: () => void;
  onSuccess: () => void;
  connectedWallet: ConnectedWallet;
  challenge: {
    title: string;
    entryFee: string;
  };
}

type TransactionStep = 'approve' | 'transaction' | 'loading' | 'success';

export default function TransactionSigningModals({ 
  isOpen, 
  walletType, 
  onClose, 
  onSuccess,
  connectedWallet,
  challenge 
}: TransactionSigningModalsProps) {
  const [step, setStep] = useState<TransactionStep>('approve');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(walletType === 'abstract' ? 'approve' : 'transaction');
      setIsLoading(false);
    }
  }, [isOpen, walletType]);

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
  const networkFee = 0.03;
  const totalUsd = entryInfo.usdValue + networkFee;

  const handleApprove = async () => {
    setIsLoading(true);
    setStep('loading');
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStep('success');
      setIsLoading(false);
      
      // Auto close and show success after 2 seconds
      setTimeout(() => {
        onSuccess();
        toast.success('Tournament joined successfully!');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setStep('approve');
      toast.error('Transaction failed. Please try again.');
    }
  };

  const handleNotNow = () => {
    onClose();
  };

  const renderAbstractFlow = () => (
    <AnimatePresence mode="wait">
      {step === 'approve' && (
        <motion.div
          key="abstract-approve"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-900">Approve connection</h2>
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <p className="text-sm text-gray-600">https://create-abstract-app-vercel.app</p>
          </div>

          {/* Permissions */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-900 mb-4">Would like to</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  View your Abstract wallet address, balance, and assets
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Request transactions like moving assets
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-900 mb-3">Will not</p>
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  Take action without your consent
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Abstract wallet</p>
                <p className="text-xs text-gray-600 font-mono">
                  {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">0.063 ETH</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => setStep('transaction')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Approve
            </Button>
            <button
              onClick={handleNotNow}
              className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium transition-colors"
            >
              Not now
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-black rounded-sm"></div>
                <span className="font-semibold text-black">privy</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'transaction' && (
        <motion.div
          key="abstract-transaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Approve transaction</h2>
            <p className="text-sm text-gray-600">
              Abstract wants your permission to complete the following transaction.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-sm font-medium text-gray-900">${totalUsd.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">To</span>
              <span className="text-sm font-mono text-gray-900">0x1234...4568</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Network</span>
              <span className="text-sm font-medium text-gray-900">Abstract</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                Estimated fee
                <Info className="w-3 h-3" />
              </span>
              <span className="text-sm font-medium text-gray-900">${networkFee.toFixed(2)}</span>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Abstract wallet</p>
                <p className="text-xs text-gray-600 font-mono">
                  {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
                </p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">0.063 ETH</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Approve
            </Button>
            <button
              onClick={handleNotNow}
              className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm font-medium transition-colors"
            >
              Not now
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-black rounded-sm"></div>
                <span className="font-semibold text-black">privy</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'loading' && (
        <motion.div
          key="abstract-loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing Transaction...</h2>
          <p className="text-gray-400">Please wait while we process your transaction on Abstract</p>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          key="abstract-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Transaction Complete!</h2>
          <p className="text-gray-400 mb-4">Successfully joined {challenge.title}</p>
          <div className="text-sm text-gray-500">Redirecting to tournament...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderMetaMaskFlow = () => (
    <AnimatePresence mode="wait">
      {step === 'transaction' && (
        <motion.div
          key="metamask-transaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          {(() => {
            // Dynamic wallet configuration
            const walletConfigs = {
              metamask: { name: 'MetaMask', color: 'orange-600', icon: 'M' },
              walletconnect: { name: 'WalletConnect', color: 'blue-500', icon: 'W' },
              coinbase: { name: 'Coinbase Wallet', color: 'blue-600', icon: 'C' }
            };
            
            const config = walletConfigs[walletType as keyof typeof walletConfigs] || walletConfigs.metamask;
            
            return (
              <>
          {/* Left Side - Desktop Confirmation */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 bg-${config.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className={`text-${config.color} font-bold text-sm`}>{config.icon}</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Confirming with {config.name}</h2>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-sm font-medium text-white">${totalUsd.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-sm font-mono text-white">0x1234...4568</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Network</span>
                <span className="text-sm font-medium text-blue-400">Base</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  Estimated fee
                  <Info className="w-3 h-3" />
                </span>
                <span className="text-sm font-medium text-white">${networkFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Mobile Wallet Mockup */}
          <div className="bg-gray-900 rounded-2xl p-4 mb-6 border border-gray-700">
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">E</span>
                  </div>
                  <span className="text-white text-sm">Ethereum Main Network</span>
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full" />
              </div>
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {entryInfo.amount} {entryInfo.symbol}
                </div>
                <div className="text-gray-400 text-sm">${entryInfo.usdValue.toFixed(2)}</div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg text-sm">
                  Reject
                </button>
                <button 
                  onClick={handleApprove}
                  className={`flex-1 bg-${config.color} text-white py-2 px-4 rounded-lg text-sm`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <span className="font-semibold text-white">privy</span>
              </div>
            </div>
          </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {step === 'loading' && (
        <motion.div
          key="metamask-loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          {(() => {
            const walletConfigs = {
              metamask: { name: 'MetaMask', color: 'orange-600' },
              walletconnect: { name: 'WalletConnect', color: 'blue-500' },
              coinbase: { name: 'Coinbase Wallet', color: 'blue-600' }
            };
            
            const config = walletConfigs[walletType as keyof typeof walletConfigs] || walletConfigs.metamask;
            
            return (
              <>
          <div className={`w-16 h-16 bg-${config.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing Transaction...</h2>
          <p className="text-gray-400">Confirming transaction on the blockchain</p>
              </>
            );
          })()}
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          key="metamask-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          {(() => {
            const walletConfigs = {
              metamask: { name: 'MetaMask', color: 'orange-600' },
              walletconnect: { name: 'WalletConnect', color: 'blue-500' },
              coinbase: { name: 'Coinbase Wallet', color: 'blue-600' }
            };
            
            const config = walletConfigs[walletType as keyof typeof walletConfigs] || walletConfigs.metamask;
            
            return (
              <>
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Success!</h2>
          <p className="text-gray-400 mb-4">
            You've successfully added 0.05 ETH to your Circular wallet.
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors mb-4">
            Explore
          </Button>
              </>
            );
          })()}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
                <span className="font-semibold text-white">privy</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderPulseFlow = () => (
    <AnimatePresence mode="wait">
      {step === 'transaction' && (
        <motion.div
          key="pulse-transaction"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Confirm Transaction</h2>
            <p className="text-gray-400">
              Review and confirm your tournament entry
            </p>
          </div>

          {/* Account Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Account</label>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Pulse Wallet</div>
                  <div className="text-gray-400 text-xs font-mono">
                    {connectedWallet.address.slice(0, 6)}...{connectedWallet.address.slice(-4)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">{connectedWallet.balance?.eth} ETH</div>
                <div className="text-gray-400 text-xs">${connectedWallet.balance?.usd}</div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
            <h3 className="text-white font-medium mb-3">Transaction Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Tournament Entry</span>
                <span className="text-white text-sm font-medium">
                  {entryInfo.amount} {entryInfo.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Network Fee</span>
                <span className="text-white text-sm">${networkFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-700 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Total</span>
                <span className="text-[#30FFE6] font-semibold">
                  ${totalUsd.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8E1EFE] to-[#30FFE6] hover:opacity-90 text-white py-3 rounded-lg font-medium transition-opacity disabled:opacity-50"
            >
              Confirm & Join Tournament
            </Button>
            <button
              onClick={handleNotNow}
              className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
                <span className="font-semibold text-white">pulse</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 'loading' && (
        <motion.div
          key="pulse-loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Processing Transaction...</h2>
          <p className="text-gray-400">Joining tournament and processing entry fee</p>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          key="pulse-success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 text-center"
        >
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Welcome to the Tournament!</h2>
          <p className="text-gray-400 mb-4">
            You've successfully joined {challenge.title}
          </p>
          <Button className="w-full bg-gradient-to-r from-[#8E1EFE] to-[#30FFE6] hover:opacity-90 text-white py-3 rounded-lg font-medium transition-opacity mb-4">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Tournament
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Protected by</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
                <span className="font-semibold text-white">pulse</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCardPaymentFlow = () => {
    const feeMatch = challenge.entryFee.match(/^([\d,]+)\s+(\w+)$/);
    const amount = feeMatch ? feeMatch[1] : '50';
    const symbol = feeMatch ? feeMatch[2] : 'MYTH';
    
    return (
      <AnimatePresence mode="wait">
        {step === 'transaction' && (
          <motion.div
            key="card-payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">Pay with Card</h2>
              <p className="text-gray-400">
                Purchase {amount} {symbol} (~${entryInfo.usdValue.toFixed(2)}) to join the tournament
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">
                {amount} {symbol}
              </div>
              <div className="text-gray-400">≈ ${entryInfo.usdValue.toFixed(2)}</div>
            </div>

            {/* Card Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleApprove}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Pay ${entryInfo.usdValue.toFixed(2)} & Join Tournament
            </Button>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>Powered by Coinbase Commerce</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="card-loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Processing Payment...</h2>
            <p className="text-gray-400">Please wait while we process your card payment</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="card-success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Complete!</h2>
            <p className="text-gray-400 mb-4">
              Successfully purchased {amount} {symbol} and joined the tournament!
            </p>
            <div className="text-sm text-gray-500">Redirecting to tournament...</div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderTransactionFlow = () => {
    switch (walletType) {
      case 'abstract':
        return renderAbstractFlow();
      case 'metamask':
      case 'walletconnect':
      case 'coinbase':
        return renderMetaMaskFlow();
      case 'pulse':
        return renderPulseFlow();
      case 'card':
        return renderCardPaymentFlow();
      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Transaction Signing</h2>
            <p className="text-gray-400">This wallet's transaction flow is not yet implemented</p>
          </div>
        );
    }
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
            onClick={step !== 'loading' ? onClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={`w-full max-w-md ${
                walletType === 'abstract' ? 'bg-white' : 'bg-gray-900/95'
              } backdrop-blur-xl border ${
                walletType === 'abstract' ? 'border-gray-200' : 'border-gray-700/50'
              } rounded-2xl shadow-gaming-card overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {step !== 'loading' && (
                <button
                  onClick={onClose}
                  className={`absolute top-4 right-4 p-2 ${
                    walletType === 'abstract' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-400 hover:text-white'
                  } hover:bg-gray-800/50 rounded-lg transition-colors z-10`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Content */}
              {renderTransactionFlow()}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}