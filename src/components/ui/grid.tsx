import { useEffect, useRef, useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { OptimizedImage } from './optimized-image';
import { supabase, type CuratitRecord } from '@/lib/supabase';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const baseLag = 0.2;
const lagScale = 0.3;

// Interface for processed brand data
interface BrandData {
  id: number;
  brand_name: string;
  postImage: string; // This will be brand_post from Supabase
  logoContent: string; // This will be brand_logo from Supabase
  color: string;
  category: string;
}

// Color gradients for brand logos
const colors = [
  "from-blue-500 to-purple-600", "from-green-500 to-teal-600", "from-red-500 to-pink-600",
  "from-yellow-500 to-orange-600", "from-indigo-500 to-blue-600", "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600", "from-emerald-500 to-green-600", "from-rose-500 to-red-600",
  "from-violet-500 to-purple-600", "from-amber-500 to-yellow-600", "from-teal-500 to-cyan-600",
  "from-slate-500 to-gray-600", "from-lime-500 to-green-600", "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600", "from-sky-500 to-blue-600", "from-fuchsia-500 to-purple-600",
  "from-emerald-500 to-teal-600", "from-indigo-500 to-violet-600"
];

// Fallback images for when brand_post is null
const fallbackImages = [
  'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg',
  'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg',
  'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg',
  'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg',
  'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg',
];

function Grid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const originalItemsRef = useRef<Element[]>([]);
  const currentColumnCountRef = useRef<number | null>(null);
  const smootherRef = useRef<any>(null);
  
  // State for Supabase data
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  const fetchBrandData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching data from Supabase...');
      
      const { data, error: supabaseError } = await supabase
        .from('Curatit')
        .select('id, brand_name, brand_post, brand_logo, brand_category')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }

      console.log('Fetched data:', data);

      // Process the data to match our component's expected format
      const processedData: BrandData[] = (data || []).map((item: CuratitRecord, index: number) => ({
        id: item.id,
        brand_name: item.brand_name || `Brand ${item.id}`,
        postImage: item.brand_post || fallbackImages[index % fallbackImages.length],
        logoContent: item.brand_logo || (item.brand_name || `Brand ${item.id}`).charAt(0).toUpperCase(),
        color: colors[index % colors.length],
        category: item.brand_category || 'Uncategorized',
      }));

      console.log('Processed data:', processedData);
      setBrandData(processedData);
    } catch (err) {
      console.error('Error fetching brand data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch brand data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchBrandData();
  }, [fetchBrandData]);

  const getColumnCount = useCallback(() => {
    if (!gridRef.current) return 0;
    const styles = getComputedStyle(gridRef.current);
    return styles.getPropertyValue('grid-template-columns').split(' ').filter(Boolean).length;
  }, []);

  const groupItemsByColumn = useCallback(() => {
    if (!gridRef.current) return { columns: [], numColumns: 0 };
    const numColumns = getColumnCount();
    const columns = Array.from({ length: numColumns }, () => []);
    
    gridRef.current.querySelectorAll('.grid__item').forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    return { columns, numColumns };
  }, [getColumnCount]);

  const clearGrid = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.grid__column').forEach(col => col.remove());
    originalItemsRef.current.forEach(item => gridRef.current?.appendChild(item));
  }, []);

  const buildGrid = useCallback((columns: Element[][]) => {
    if (!gridRef.current) return [];
    const fragment = document.createDocumentFragment();
    const columnContainers: { element: HTMLDivElement; lag: number }[] = [];

    columns.forEach((column, i) => {
      const lag = baseLag + (i + 1) * lagScale;
      const columnContainer = document.createElement('div');
      columnContainer.className = 'grid__column';
      
      column.forEach(item => columnContainer.appendChild(item));
      
      fragment.appendChild(columnContainer);
      columnContainers.push({ element: columnContainer, lag });
    });

    gridRef.current.appendChild(fragment);
    return columnContainers;
  }, []);

  const initGrid = useCallback(() => {
    if (!gridRef.current) return;
    clearGrid();
    const { columns, numColumns } = groupItemsByColumn();
    currentColumnCountRef.current = numColumns;
    const columnContainers = buildGrid(columns);

    if (smootherRef.current) {
      columnContainers.forEach(({ element, lag }) => {
        smootherRef.current.effects(element, { speed: 1, lag });
      });
    }
  }, [clearGrid, groupItemsByColumn, buildGrid]);

  // Optimized download function with better error handling
  const downloadImage = useCallback(async (imageUrl: string, brandName: string) => {
    try {
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>';
      }

      // Use fetch with optimized headers
      const response = await fetch(imageUrl, {
        headers: {
          'Accept': 'image/webp,image/jpeg,image/*,*/*;q=0.8',
        },
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-brand-image.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
      }
    } catch (error) {
      console.error('Download failed:', error);
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
      }
    }
  }, []);

  useEffect(() => {
    if (!gridRef.current || brandData.length === 0) return;
    
    // Wait for next tick to ensure DOM is updated
    setTimeout(() => {
      if (gridRef.current) {
        originalItemsRef.current = Array.from(gridRef.current.querySelectorAll('.grid__item'));

        // Initialize ScrollSmoother with optimized settings
        if (!smootherRef.current) {
          smootherRef.current = ScrollSmoother.create({
            smooth: 0.6, // Reduced for better performance
            effects: true,
            normalizeScroll: true,
          });
        }

        initGrid();
      }
    }, 0);

    const handleResize = () => {
      const newColumnCount = getColumnCount();
      if (newColumnCount !== currentColumnCountRef.current) {
        initGrid();
      }
    };

    // Debounce resize handler for better performance
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [initGrid, getColumnCount, brandData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="grid__item">
            <div className="relative overflow-hidden rounded-xl shadow-md">
              <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shiny-text" style={{ aspectRatio: '1/1' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="text-red-600 text-lg font-medium mb-2">Failed to load brand data</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchBrandData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (brandData.length === 0) {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="text-gray-600 text-lg font-medium mb-2">No brand data found</div>
          <p className="text-gray-500 mb-4">Add some brands to your Curatit table to see them here.</p>
          <button
            onClick={fetchBrandData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef} 
      className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16"
    >
      {brandData.map((brand, i) => {
        return (
          <figure key={brand.id} className="grid__item group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <OptimizedImage
                src={brand.postImage}
                alt={`${brand.brand_name} brand post`}
                width={400}
                height={400}
                quality={80}
                priority={i < 8} // Prioritize first 8 images for better performance
                className="w-full h-full"
                style={{ aspectRatio: '1/1' }}
              />

              {/* Brand Logo - Top Left */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-lg`}>
                  {/* Check if logoContent is a URL (image) or text */}
                  {brand.logoContent.startsWith('http') ? (
                    <img 
                      src={brand.logoContent} 
                      alt={`${brand.brand_name} logo`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm sm:text-base md:text-lg">
                      {brand.logoContent}
                    </span>
                  )}
                </div>
              </div>

              {/* Brand Name */}
              <div className="absolute top-14 left-3 sm:top-16 sm:left-4 md:top-18 md:left-4 z-10">
                <h3 className="text-white font-medium text-sm sm:text-base md:text-lg bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {brand.brand_name}
                </h3>
              </div>

              {/* Category Badge - Top Right */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                <span className="text-white text-xs sm:text-sm bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/30">
                  {brand.category}
                </span>
              </div>

              {/* Download Button */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
                <button 
                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 group-hover:bg-text-primary group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(brand.postImage, brand.brand_name);
                  }}
                  title={`Download ${brand.brand_name} image`}
                  aria-label={`Download ${brand.brand_name} image`}
                >
                  <Download size={16} className="text-text-secondary group-hover:text-white w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-xl"></div>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

export { Grid }