import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from './optimized-image';

const SubscriptionPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  // Memoize image data to prevent re-renders
  const imageData = useMemo(() => {
    const baseImages = [
      'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg',
      'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg',
      'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg',
      'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg',
      'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg',
    ];

    return {
      mobile: baseImages.slice(0, 3),
      tablet: baseImages.slice(0, 3),
      desktop: baseImages
    };
  }, []);

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

      {/* Optimized Image Stack Group */}
      <div className="relative w-full min-h-[20rem] sm:min-h-[22rem] md:min-h-[24rem] overflow-hidden flex justify-center items-end">
        {/* Mobile Stack (3 images) */}
        <div className="block sm:hidden">
          {imageData.mobile.map((imageUrl, index) => {
            const heights = ['h-40', 'h-48', 'h-40'];
            const zIndexes = ['z-10', 'z-20', 'z-10'];
            const positions = [
              'left-[calc(50%-150px)]',
              'left-[calc(50%-100px)]', 
              'left-[calc(50%-50px)]'
            ];
            
            return (
              <div
                key={`mobile-${index}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[200px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Website inspiration ${index + 1}`}
                  width={200}
                  height={index === 1 ? 192 : 160}
                  quality={75}
                  priority={index < 2}
                  className="w-full h-full"
                />
              </div>
            );
          })}
        </div>

        {/* Tablet Stack (3 images) */}
        <div className="hidden sm:block md:hidden">
          {imageData.tablet.map((imageUrl, index) => {
            const heights = ['h-48', 'h-56', 'h-48'];
            const zIndexes = ['z-10', 'z-20', 'z-10'];
            const positions = [
              'left-[calc(50%-210px)]',
              'left-[calc(50%-140px)]',
              'left-[calc(50%-70px)]'
            ];
            
            return (
              <div
                key={`tablet-${index}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[280px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Website inspiration ${index + 1}`}
                  width={280}
                  height={index === 1 ? 224 : 192}
                  quality={75}
                  priority={index < 2}
                  className="w-full h-full"
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Stack (5 images) */}
        <div className="hidden md:block">
          {imageData.desktop.map((imageUrl, index) => {
            const heights = ['h-48', 'h-64', 'h-80', 'h-64', 'h-48'];
            const zIndexes = ['z-10', 'z-20', 'z-30', 'z-20', 'z-10'];
            const positions = [
              'left-[calc(50%-337.5px)]',
              'left-[calc(50%-202.5px)]',
              'left-[calc(50%-135px)]',
              'left-[calc(50%-67.5px)]',
              'left-[calc(50%+67.5px)]'
            ];
            
            const heightMap = { 'h-48': 192, 'h-64': 256, 'h-80': 320 };
            const heightValue = heightMap[heights[index] as keyof typeof heightMap];
            
            return (
              <div
                key={`desktop-${index}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[270px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Website inspiration ${index + 1}`}
                  width={270}
                  height={heightValue}
                  quality={75}
                  priority={index < 3}
                  className="w-full h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { SubscriptionPage };