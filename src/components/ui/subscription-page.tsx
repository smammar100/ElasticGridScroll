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

  // Sample images for the stack - using Pexels URLs
  const stackImages = [
    'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg',
    'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg',
    'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg',
    'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg',
    'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg',
    'https://images.pexels.com/photos/18111093/pexels-photo-18111093.jpeg',
    'https://images.pexels.com/photos/18111094/pexels-photo-18111094.jpeg',
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Content Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        {/* Header Text Group */}
        <div className="text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mb-8 sm:mb-12 md:mb-16">
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4 sm:mb-6"
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
          className="w-full max-w-md sm:max-w-lg md:max-w-xl mb-12 sm:mb-16 md:mb-20"
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

      {/* Image Stack Group */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden flex justify-center items-end">
        {stackImages.map((imageUrl, index) => {
          // Calculate height and z-index for step effect
          const heights = ['h-48', 'h-64', 'h-80', 'h-96', 'h-80', 'h-64', 'h-48'];
          const zIndexes = ['z-10', 'z-20', 'z-30', 'z-40', 'z-30', 'z-20', 'z-10'];
          
          return (
            <motion.div
              key={index}
              className={`image-stack-item-${index + 1} absolute bottom-0 ${heights[index]} ${zIndexes[index]} w-24 sm:w-32 md:w-40 rounded-t-xl overflow-hidden shadow-lg`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            >
              <img
                src={imageUrl}
                alt={`Website inspiration ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export { SubscriptionPage };