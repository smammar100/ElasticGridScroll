import { useState } from 'react';
import { motion } from 'framer-motion';

const SubscriptionPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log('Subscribing email:', email);
    setEmail('');
  };

  // Sample images for the stack - responsive count
  const stackImages = [
    'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg',
    'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg',
    'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg',
    'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg',
    'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg',
  ];

  return (
    <div className="bg-white flex flex-col justify-between">
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        {/* Header Text Group */}
        <div className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mb-4 sm:mb-6 md:mb-8">
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-3 sm:mb-4 md:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get weekly top websites delivered to your inbox, every monday. No spam, only inspiration.
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

        {/* Subscribe Input Group */}
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

      {/* Responsive Image Stack - Centrally aligned with proper positioning */}
      <div className="relative w-full min-h-[20rem] sm:min-h-[24rem] md:min-h-[28rem] overflow-hidden flex justify-center items-end">
        {stackImages.map((imageUrl, index) => {
          // Responsive visibility: 3 on mobile/tablet, 5 on desktop
          const isVisible = {
            mobile: index < 3, // Show first 3 on mobile
            tablet: index < 3, // Show first 3 on tablet  
            desktop: index < 5 // Show all 5 on desktop
          };

          // Skip rendering hidden images for performance
          if (typeof window !== 'undefined') {
            const isMobile = window.innerWidth < 769;
            const isTablet = window.innerWidth >= 769 && window.innerWidth < 1025;
            
            if (isMobile && !isVisible.mobile) return null;
            if (isTablet && !isVisible.tablet) return null;
          }

          // Responsive heights for step effect
          const heights = {
            mobile: ['h-40', 'h-52', 'h-40'], // 3 images
            tablet: ['h-48', 'h-64', 'h-48'], // 3 images
            desktop: ['h-48', 'h-64', 'h-80', 'h-64', 'h-48'] // 5 images
          };

          // Responsive z-indexes
          const zIndexes = {
            mobile: ['z-10', 'z-30', 'z-10'],
            tablet: ['z-10', 'z-30', 'z-10'], 
            desktop: ['z-10', 'z-20', 'z-30', 'z-20', 'z-10']
          };

          // Responsive widths
          const widths = {
            mobile: 'w-[200px]', // Smaller on mobile
            tablet: 'w-[280px]',  // Medium on tablet
            desktop: 'w-[270px]'  // Standard on desktop
          };

          // Responsive positioning classes
          const positions = {
            mobile: ['left-[calc(50%-150px)]', 'left-[calc(50%-100px)]', 'left-[calc(50%-50px)]'],
            tablet: ['left-[calc(50%-210px)]', 'left-[calc(50%-140px)]', 'left-[calc(50%-70px)]'],
            desktop: ['left-[calc(50%-337.5px)]', 'left-[calc(50%-202.5px)]', 'left-[calc(50%-135px)]', 'left-[calc(50%-67.5px)]', 'left-[calc(50%+67.5px)]']
          };

          return (
            <motion.div
              key={index}
              className={`
                absolute bottom-0 rounded-t-xl overflow-hidden shadow-lg
                ${heights.mobile[index] || 'h-40'} ${widths.mobile} ${zIndexes.mobile[index] || 'z-10'} ${positions.mobile[index] || ''}
                sm:${heights.tablet[index] || 'h-48'} sm:${widths.tablet} sm:${zIndexes.tablet[index] || 'z-10'} sm:${positions.tablet[index] || ''}
                md:${heights.desktop[index] || 'h-48'} md:${widths.desktop} md:${zIndexes.desktop[index] || 'z-10'} md:${positions.desktop[index] || ''}
                ${index >= 3 ? 'hidden md:block' : ''} // Hide 4th and 5th images on mobile/tablet
              `}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            >
              <img
                src={imageUrl}
                alt={`Website inspiration ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index < 3 ? "eager" : "lazy"} // Eager load first 3, lazy load others
                decoding="async"
                style={{
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export { SubscriptionPage };