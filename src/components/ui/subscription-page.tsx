import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from './optimized-image';
import { supabase } from '@/lib/supabase';

const SubscriptionPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="bg-white flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mb-4 sm:mb-6 md:mb-8">
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-3 sm:mb-4 md:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get weekly top posts delivered to your inbox, every monday. No spam, only inspiration.
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-text-secondary font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Unsubscribe anytime.
          </motion.p>
        </div>

        <motion.form 
          onSubmit={handleSubmit}
          className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-4 sm:mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 sm:px-5 md:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-full focus:border-text-primary focus:outline-none transition-colors font-normal text-text-primary placeholder-text-tertiary"
              required
            />
            <button
              type="submit"
              className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-text-primary text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-base sm:text-lg whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export { SubscriptionPage };