'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Home, Bell, Eye, Sparkles } from 'lucide-react';
import { AuthButton } from '@/components/ui/auth-button';

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(false);
  
  const issueTitle = searchParams.get('title') || 'Your Issue';
  const issueCategory = searchParams.get('category') || 'general';

  useEffect(() => {
    // Show confetti animation after page loads
    setTimeout(() => setShowConfetti(true), 500);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const checkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 10,
        delay: 0.8,
      },
    },
  };

  const sparkleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.7],
      transition: {
        duration: 0.6,
        delay: 1.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md space-y-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon with Animation */}
        <div className="relative flex justify-center">
          <motion.div
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            variants={checkVariants}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Animated Sparkles */}
          {showConfetti && (
            <>
              <motion.div
                className="absolute -top-2 -right-2"
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2"
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.4 }}
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
              </motion.div>
              <motion.div
                className="absolute top-0 left-0"
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.6 }}
              >
                <Sparkles className="w-5 h-5 text-pink-400" />
              </motion.div>
            </>
          )}
        </div>

        {/* Success Message */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Issue Reported Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Thank you for making your community better. Your report has been submitted and we'll keep you updated on the progress.
          </p>
        </motion.div>

        {/* Issue Details */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Your Report</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{issueTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400 capitalize">{issueCategory.replace('-', ' ')}</span>
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6"
          variants={itemVariants}
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">What happens next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">You'll receive notifications about updates</span>
            </div>
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Track progress in your history</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Get notified when it's resolved</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="space-y-3 pt-4" variants={itemVariants}>
          <AuthButton
            onClick={() => router.push('/')}
            className="w-full"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </AuthButton>
          
          <button
            onClick={() => router.push('/raise-issue')}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Report Another Issue
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Appreciation Message */}
        <motion.div 
          className="pt-4 border-t border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🙏 Thank you for being an active citizen and helping improve our community!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}