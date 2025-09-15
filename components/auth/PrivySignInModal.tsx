'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Smartphone, Wallet, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, mockUser } from '@/lib/auth';
import { toast } from 'sonner';

// Map display names to signin method keys
const mapToSigninMethod = (displayName: string): 'email' | 'sms' | 'metamask' | 'coinbase' | 'rainbow' | 'walletconnect' | 'phantom' | 'google' | 'discord' => {
  const mapping: { [key: string]: 'email' | 'sms' | 'metamask' | 'coinbase' | 'rainbow' | 'walletconnect' | 'phantom' | 'google' | 'discord' } = {
    'coinbase wallet': 'coinbase',
    'metamask': 'metamask',
    'rainbow': 'rainbow',
    'gnosis': 'walletconnect', // Treat as walletconnect
    'phantom': 'phantom',
    'walletconnect': 'walletconnect',
    'google': 'google',
    'discord': 'discord'
  };
  
  const key = displayName.toLowerCase();
  return mapping[key] || 'metamask'; // Default fallback
};

interface PrivySignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SignInStep = 'main' | 'sms' | 'email-otp' | 'sms-otp' | 'wallets' | 'more-wallets' | 'loading' | 'success';

export default function PrivySignInModal({ isOpen, onClose, onSuccess }: PrivySignInModalProps) {
  const [step, setStep] = useState<SignInStep>('main');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOTPMethod, setCurrentOTPMethod] = useState<'email' | 'sms'>('email');
  const { login } = useAuth();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('main');
      setEmail('');
      setPhone('');
      setOtpCode('');
      setIsLoading(false);
      setCurrentOTPMethod('email');
    }
  }, [isOpen]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setCurrentOTPMethod('email');
    setIsLoading(true);
    setStep('loading');
    
    // Simulate email OTP sending
    setTimeout(() => {
      setStep('email-otp');
      setIsLoading(false);
    }, 1500);
  };

  const handleSMSContinue = () => {
    setStep('sms');
  };

  const handleSMSSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setCurrentOTPMethod('sms');
    setIsLoading(true);
    setStep('loading');
    
    // Simulate SMS OTP sending
    setTimeout(() => {
      setStep('sms-otp');
      setIsLoading(false);
    }, 1500);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    
    setIsLoading(true);
    setStep('loading');
    
    // Simulate OTP verification
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        login(mockUser, currentOTPMethod);
        onSuccess();
        toast.success('Successfully signed in!');
      }, 1500);
    }, 2000);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setStep('loading');
    
    // Simulate social login
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        login(mockUser, mapToSigninMethod(provider));
        onSuccess();
        toast.success(`Successfully signed in with ${provider}!`);
      }, 1500);
    }, 2000);
  };

  const handleWalletConnect = async (wallet: string) => {
    setIsLoading(true);
    setStep('loading');
    
    // Simulate wallet connection
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        login(mockUser, mapToSigninMethod(wallet));
        onSuccess();
        toast.success(`Successfully connected ${wallet}!`);
      }, 1500);
    }, 2000);
  };

  const handleBack = () => {
    if (step === 'sms' || step === 'wallets' || step === 'more-wallets') {
      setStep('main');
    } else if (step === 'email-otp') {
      setStep('main');
      setEmail('');
    } else if (step === 'sms-otp') {
      setStep('sms');
      setOtpCode('');
    }
  };

  const handleClose = () => {
    setStep('main');
    setEmail('');
    setPhone('');
    setOtpCode('');
    setIsLoading(false);
    onClose();
  };

  const renderMainStep = () => (
    <motion.div
      key="main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-2xl font-bold text-white">pulse</span>
        </div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">Login or sign up</h2>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="mb-4">
        <div className="relative mb-4">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-12 pr-20 py-4 bg-gray-800/30 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-base"
            required
          />
          <button
            type="submit"
            disabled={!email || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Submit
          </button>
        </div>
      </form>

      {/* SMS Option */}
      <button
        onClick={handleSMSContinue}
        className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors mb-4"
      >
        <Smartphone className="w-5 h-5" />
        <span className="font-medium">Continue with SMS</span>
      </button>

      {/* Wallet Option */}
      <button
        onClick={() => setStep('wallets')}
        className="w-full flex items-center justify-between py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors mb-8"
      >
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5" />
          <span className="font-medium">Sign in with wallet</span>
        </div>
        <span className="text-gray-400">→</span>
      </button>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Protected by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
            <span className="font-semibold text-white">pulse</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSMSStep = () => (
    <motion.div
      key="sms"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-2xl font-bold text-white">pulse</span>
        </div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">Login or sign up with SMS</h2>
      </div>

      {/* Phone Form */}
      <form onSubmit={handleSMSSubmit} className="mb-8">
        <div className="flex gap-2 mb-4">
          <select className="px-3 py-4 bg-gray-800/30 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none">
            <option value="US +1">US +1</option>
          </select>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 000-0000"
            className="flex-1 px-4 py-4 bg-gray-800/30 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!phone || isLoading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
        >
          Submit
        </button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Protected by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
            <span className="font-semibold text-white">pulse</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderEmailOTPStep = () => (
    <motion.div
      key="email-otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-medium text-white mb-2">Enter confirmation code</h2>
        <p className="text-sm text-gray-400">
          Please check +1 (555) 555-5555 for a message with your login code.
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleOTPSubmit} className="mb-6">
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center bg-gray-800/30 border border-gray-600 rounded-lg text-white text-lg font-semibold focus:border-blue-500 focus:outline-none transition-colors"
              onChange={(e) => {
                const value = e.target.value;
                if (value && i < 5) {
                  const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                  nextInput?.focus();
                }
                const newCode = otpCode.split('');
                newCode[i] = value;
                setOtpCode(newCode.join(''));
              }}
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={otpCode.length !== 6 || isLoading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-xl font-medium transition-colors"
        >
          Continue
        </button>
      </form>

      {/* Resend */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-400 mb-2">Don't get a message?</p>
        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
          Resend code
        </button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Protected by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
            <span className="font-semibold text-white">pulse</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderWalletsStep = () => (
    <motion.div
      key="wallets"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-2xl font-bold text-white">pulse</span>
        </div>
        <h2 className="text-xl font-medium text-gray-300 mb-2">Login or sign up</h2>
      </div>

      {/* Email Form (repeated) */}
      <form onSubmit={handleEmailSubmit} className="mb-4">
        <div className="relative mb-4">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full pl-12 pr-20 py-4 bg-gray-800/30 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors text-base"
            required
          />
          <button
            type="submit"
            disabled={!email || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Wallet Options */}
      <div className="space-y-3 mb-4">
        <button
          onClick={() => handleWalletConnect('Coinbase Wallet')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-600/30 transition-colors"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="font-medium">Coinbase wallet</span>
        </button>

        <button
          onClick={() => handleWalletConnect('MetaMask')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors"
        >
          <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="font-medium">Metamask</span>
        </button>
      </div>

      {/* More Wallets */}
      <button
        onClick={() => setStep('more-wallets')}
        className="w-full flex items-center justify-between py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors mb-8"
      >
        <div className="flex items-center gap-3">
          <Wallet className="w-5 h-5" />
          <span className="font-medium">More wallets</span>
        </div>
        <span className="text-gray-400">→</span>
      </button>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Protected by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
            <span className="font-semibold text-white">pulse</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMoreWalletsStep = () => (
    <motion.div
      key="more-wallets"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-gray-300 mb-2">More wallets</h2>
      </div>

      {/* Wallet List */}
      <div className="space-y-3 mb-8">
        <button
          onClick={() => handleWalletConnect('Rainbow')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors"
        >
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg"></div>
          <span className="font-medium">Rainbow</span>
        </button>

        <button
          onClick={() => handleWalletConnect('Gnosis')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors"
        >
          <div className="w-6 h-6 bg-green-600 rounded-lg"></div>
          <span className="font-medium">Gnosis</span>
        </button>

        <button
          onClick={() => handleWalletConnect('Phantom')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors"
        >
          <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
          <span className="font-medium">Phantom</span>
        </button>

        <button
          onClick={() => handleWalletConnect('WalletConnect')}
          className="w-full flex items-center gap-3 py-4 px-4 bg-gray-800/30 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-colors"
        >
          <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
          <span className="font-medium">WalletConnect</span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Protected by</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-br from-[#8E1EFE] to-[#30FFE6] rounded-sm"></div>
            <span className="font-semibold text-white">pulse</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderLoadingStep = () => (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 text-center"
    >
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Signing you in...</h2>
      <p className="text-gray-400">Please wait while we authenticate your account</p>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-6 text-center"
    >
      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Success!</h2>
      <p className="text-gray-400 mb-4">You've successfully created an account.</p>
      <div className="text-sm text-gray-500">Redirecting...</div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 'main':
        return renderMainStep();
      case 'sms':
        return renderSMSStep();
      case 'email-otp':
      case 'sms-otp':
        return renderEmailOTPStep();
      case 'wallets':
        return renderWalletsStep();
      case 'more-wallets':
        return renderMoreWalletsStep();
      case 'loading':
        return renderLoadingStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderMainStep();
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
            onClick={step !== 'loading' ? handleClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-gaming-card overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Back/Close */}
              {step !== 'loading' && step !== 'success' && (
                <div className="flex items-center justify-between p-4">
                  {(step === 'sms' || step === 'email-otp' || step === 'sms-otp' || step === 'wallets' || step === 'more-wallets') ? (
                    <button
                      onClick={handleBack}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="w-9 h-9" />
                  )}
                  
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}