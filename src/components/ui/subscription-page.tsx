import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OptimizedImage } from './optimized-image';
import { supabase } from '@/lib/supabase';

const SubscriptionPage = () => {
  const [email, setEmail] = useState('');
  const [supabaseImages, setSupabaseImages] = useState<string[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoadingImages(true);
        console.log('🖼️ Fetching images for subscription page...');
        
        // Fetch images from Supabase, prioritizing those with valid brand_post URLs
        const { data, error } = await supabase
          .from('Curatit')
          .select('brand_post, brand_name, id')
          .not('brand_post', 'is', null)
          .neq('brand_post', '')
          .order('created_at', { ascending: false })
          .limit(15); // Get more than we need in case some fail to load

        if (error) {
          console.error('❌ Error fetching images from Supabase:', error);
          setSupabaseImages([]);
        } else if (data && data.length > 0) {
          console.log('📊 Raw Supabase data:', data);
          
          // Filter out any invalid URLs and extract just the image URLs
          const validImages = data
            .filter(item => {
              const hasValidPost = item.brand_post && item.brand_post.trim() !== '';
              console.log(`🔍 Checking item ${item.id}: ${item.brand_name} - Valid post: ${hasValidPost}`);
              return hasValidPost;
            })
            .map(item => {
              const trimmedUrl = item.brand_post.trim();
              console.log(`🔗 Processing URL for ${item.brand_name}: ${trimmedUrl}`);
              return trimmedUrl;
            })
            .filter(url => {
              // Basic URL validation
              try {
                new URL(url);
                console.log(`✅ Valid URL: ${url.substring(0, 50)}...`);
                return true;
              } catch {
                console.log(`❌ Invalid URL: ${url}`);
                return false;
              }
            });

          console.log(`🎯 Found ${validImages.length} valid images from Supabase:`, validImages);
          setSupabaseImages(validImages);
        } else {
          console.log('📭 No data returned from Supabase');
          setSupabaseImages([]);
        }
      } catch (err) {
        console.error('💥 Error in fetchImages:', err);
        setSupabaseImages([]);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  // Memoize image data with Supabase images as priority
  const imageData = useMemo(() => {
    // Fallback images in case Supabase doesn't have enough images
    const fallbackImages = [
      'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111093/pexels-photo-18111093.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      'https://images.pexels.com/photos/18111094/pexels-photo-18111094.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    ];

    // Combine Supabase images with fallbacks, prioritizing Supabase images
    const combinedImages = [...supabaseImages, ...fallbackImages];
    
    console.log('🎨 Final image data:', {
      supabaseCount: supabaseImages.length,
      fallbackCount: fallbackImages.length,
      totalAvailable: combinedImages.length,
      mobile: combinedImages.slice(0, 3).length,
      tablet: combinedImages.slice(0, 3).length,
      desktop: combinedImages.slice(0, 7).length
    });

    return {
      mobile: combinedImages.slice(0, 3),
      tablet: combinedImages.slice(0, 3),
      desktop: combinedImages.slice(0, 7) // Use 7 images for desktop
    };
  }, [supabaseImages]);

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

        {/* Loading indicator for images */}
        {isLoadingImages && (
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            Loading your curated content...
          </div>
        )}
      </div>

      {/* Optimized Image Stack Group with Supabase Images */}
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
                key={`mobile-${index}-${imageUrl.substring(imageUrl.length - 10)}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[200px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Curated brand inspiration ${index + 1}`}
                  width={200}
                  height={index === 1 ? 192 : 160}
                  quality={80}
                  priority={index < 2}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log(`✅ Mobile image ${index + 1} loaded successfully`)}
                  onError={() => console.log(`❌ Mobile image ${index + 1} failed to load: ${imageUrl}`)}
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
                key={`tablet-${index}-${imageUrl.substring(imageUrl.length - 10)}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[280px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Curated brand inspiration ${index + 1}`}
                  width={280}
                  height={index === 1 ? 224 : 192}
                  quality={80}
                  priority={index < 2}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log(`✅ Tablet image ${index + 1} loaded successfully`)}
                  onError={() => console.log(`❌ Tablet image ${index + 1} failed to load: ${imageUrl}`)}
                />
              </div>
            );
          })}
        </div>

        {/* Desktop Stack (7 images) - Fixed positioning container */}
        <div className="hidden md:block relative w-[945px] mx-auto">
          {imageData.desktop.map((imageUrl, index) => {
            const heights = ['h-40', 'h-48', 'h-64', 'h-80', 'h-64', 'h-48', 'h-40'];
            const zIndexes = ['z-[5]', 'z-10', 'z-20', 'z-30', 'z-20', 'z-10', 'z-[5]'];
            // New absolute positioning relative to the 945px container
            const positions = [
              'left-[0px]',      // Far left
              'left-[135px]',    
              'left-[270px]',    
              'left-[337.5px]',  // Center
              'left-[405px]',    
              'left-[540px]',    
              'left-[675px]'     // Far right
            ];
            
            const heightMap = { 'h-40': 160, 'h-48': 192, 'h-64': 256, 'h-80': 320 };
            const heightValue = heightMap[heights[index] as keyof typeof heightMap];
            
            console.log(`🖼️ Desktop image ${index + 1}: ${imageUrl.substring(0, 50)}... at position ${positions[index]}`);
            
            return (
              <div
                key={`desktop-${index}-${imageUrl.substring(imageUrl.length - 10)}`}
                className={`absolute bottom-0 ${heights[index]} ${zIndexes[index]} ${positions[index]} w-[270px] rounded-t-xl overflow-hidden shadow-lg transform-gpu`}
                style={{ willChange: 'transform' }}
              >
                <OptimizedImage
                  src={imageUrl}
                  alt={`Curated brand inspiration ${index + 1}`}
                  width={270}
                  height={heightValue}
                  quality={80}
                  priority={index < 4} // Prioritize center images
                  className="w-full h-full object-cover"
                  onLoad={() => console.log(`✅ Desktop image ${index + 1} loaded successfully`)}
                  onError={() => console.log(`❌ Desktop image ${index + 1} failed to load: ${imageUrl}`)}
                />
              </div>
            );
          })}
        </div>

        {/* Overlay with brand info for the center image on desktop */}
        {!isLoadingImages && supabaseImages.length > 0 && (
          <div className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-sm font-medium text-gray-800">
                Featuring {supabaseImages.length} real brands from our curated collection
              </span>
            </div>
          </div>
        )}

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
            <div>Supabase: {supabaseImages.length}</div>
            <div>Loading: {isLoadingImages ? 'Yes' : 'No'}</div>
            <div>Total: {imageData.desktop.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SubscriptionPage };