import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/ui/auth-button';
import { motion } from 'framer-motion';

// Define the props for the WelcomeScreen component
interface WelcomeScreenProps {
  imageUrl: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  secondaryActionText?: React.ReactNode;
  onSecondaryActionClick?: () => void;
  className?: string;
}

/**
 * A responsive and animated welcome screen component.
 * It uses framer-motion for animations and is styled with shadcn/ui theme variables.
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  imageUrl,
  title,
  description,
  buttonText,
  onButtonClick,
  secondaryActionText,
  onSecondaryActionClick,
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);
  // Animation variants for the container and its children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
  
  const imageVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        duration: 0.8,
      },
    },
  };

  return (
    <div
      className={cn(
        'flex h-screen w-full flex-col items-center justify-between bg-background min-h-screen',
        className
      )}
    >
      {/* Top Image Section with a curved clip-path */}
      <motion.div 
        className="relative w-full"
        initial="hidden"
        animate="visible"
        variants={imageVariants}
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt="Welcome"
            className="h-auto w-full object-cover"
            style={{ clipPath: 'ellipse(100% 60% at 50% 40%)' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="h-64 w-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center"
            style={{ clipPath: 'ellipse(100% 60% at 50% 40%)' }}
          >
            <svg
              className="w-24 h-24 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="flex flex-1 flex-col items-center justify-center space-y-6 p-8 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Title */}
        <motion.h1
          className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="max-w-md text-muted-foreground"
          variants={itemVariants}
        >
          {description}
        </motion.p>
      </motion.div>
      
      {/* Actions Section */}
      <motion.div 
        className="w-full space-y-4 p-8 pt-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Primary Button */}
        <motion.div variants={itemVariants}>
          <AuthButton onClick={onButtonClick} className="w-full" size="lg">
            {buttonText}
          </AuthButton>
        </motion.div>

        {/* Secondary Action Link */}
        {secondaryActionText && onSecondaryActionClick && (
          <motion.div variants={itemVariants} className="text-center">
            <AuthButton
              variant="link"
              onClick={onSecondaryActionClick}
              className="text-sm"
            >
              {secondaryActionText}
            </AuthButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};