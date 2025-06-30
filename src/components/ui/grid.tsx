import { useEffect, useRef, useCallback, useState } from 'react';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import { OptimizedImage } from './optimized-image';
import { supabase, testSupabaseConnection, type CuratitRecord } from '@/lib/supabase';

interface BrandData {
  id: number;
  brand_name: string;
  postImage: string;
  logoContent: string;
  color: string;
  category: string;
  created_at: string;
}

interface GridProps {
  scrollSmoother?: any;
}

const colors = [
  "from-blue-500 to-purple-600", "from-green-500 to-teal-600", "from-red-500 to-pink-600",
  "from-yellow-500 to-orange-600", "from-indigo-500 to-blue-600", "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-600", "from-emerald-500 to-green-600", "from-rose-500 to-red-600",
  "from-violet-500 to-purple-600", "from-amber-500 to-yellow-600", "from-teal-500 to-cyan-600",
  "from-slate-500 to-gray-600", "from-lime-500 to-green-600", "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600", "from-sky-500 to-blue-600", "from-fuchsia-500 to-purple-600",
  "from-emerald-500 to-teal-600", "from-indigo-500 to-violet-600"
];

const fallbackImages = [
  'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
  'https://images.pexels.com/photos/18111089/pexels-photo-18111089.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
  'https://images.pexels.com/photos/18111090/pexels-photo-18111090.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
  'https://images.pexels.com/photos/18111091/pexels-photo-18111091.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
  'https://images.pexels.com/photos/18111092/pexels-photo-18111092.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
];

// GSAP ScrollSmoother lag configuration
const baseLag = 0.2;
const lagScale = 0.3;

function Grid({ scrollSmoother }: GridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [brandData, setBrandData] = useState<BrandData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  
  const [columnData, setColumnData] = useState<BrandData[][]>([]);
  const [numColumns, setNumColumns] = useState(0);

  useEffect(() => {
    const testConnection = async () => {
      console.log('🔍 Testing Supabase connection...');
      const result = await testSupabaseConnection();
      
      if (result.success) {
        console.log('✅ Supabase connection successful');
        setConnectionStatus('connected');
      } else {
        console.error('❌ Supabase connection failed:', result.error);
        setConnectionStatus('failed');
        setError(`Connection failed: ${result.error}`);
      }
    };

    testConnection();
  }, []);

  const fetchBrandData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📡 Fetching data from Supabase...');
      
      const approaches = [
        () => supabase.from('Curatit').select('*').order('created_at', { ascending: false }),
        () => supabase.from('Curatit').select('*').order('id', { ascending: false }),
        () => supabase.from('Curatit').select('id, brand_name, brand_post, brand_logo, brand_category, created_at').order('created_at', { ascending: false }),
        () => supabase.from('Curatit').select('*')
      ];

      let successfulData = null;
      let lastError = null;

      for (let i = 0; i < approaches.length; i++) {
        try {
          console.log(`📡 Trying approach ${i + 1}...`);
          const { data, error, count } = await approaches[i]();
          
          if (error) {
            console.error(`❌ Approach ${i + 1} failed:`, error);
            lastError = error;
            continue;
          }

          if (data && data.length > 0) {
            console.log(`✅ Approach ${i + 1} successful! Found ${data.length} records`);
            successfulData = data;
            break;
          }
        } catch (err) {
          console.error(`💥 Approach ${i + 1} threw exception:`, err);
          lastError = err;
        }
      }

      if (!successfulData) {
        if (lastError) {
          throw new Error(`All query approaches failed. Last error: ${lastError.message || lastError}`);
        } else {
          throw new Error('No data found in any query approach');
        }
      }

      console.log('✅ Successfully fetched', successfulData.length, 'records');

      const processedData: BrandData[] = successfulData.map((item: CuratitRecord, index: number) => {
        const brandName = item.brand_name?.trim() || `Brand ${item.id}`;
        const postImage = item.brand_post?.trim() || fallbackImages[index % fallbackImages.length];
        const logoContent = item.brand_logo?.trim() || brandName.charAt(0).toUpperCase();
        const category = item.brand_category?.trim() || 'Uncategorized';

        return {
          id: item.id,
          brand_name: brandName,
          postImage,
          logoContent,
          color: colors[index % colors.length],
          category,
          created_at: item.created_at,
        };
      });

      console.log('🎨 Final processed data:', processedData);
      setBrandData(processedData);
    } catch (err) {
      console.error('💥 Error fetching brand data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch brand data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (connectionStatus === 'connected') {
      fetchBrandData();
    }
  }, [connectionStatus, fetchBrandData]);

  const getColumnCount = useCallback(() => {
    if (!gridRef.current) return 0;
    const styles = getComputedStyle(gridRef.current);
    return styles.getPropertyValue('grid-template-columns').split(' ').filter(Boolean).length;
  }, []);

  const groupDataIntoColumns = useCallback((data: BrandData[], columnCount: number) => {
    const columns: BrandData[][] = Array.from({ length: columnCount }, () => []);
    
    data.forEach((item, index) => {
      columns[index % columnCount].push(item);
    });

    console.log(`📐 Grouped ${data.length} items into ${columnCount} columns`);
    return columns;
  }, []);

  const initGrid = useCallback(() => {
    if (!gridRef.current || brandData.length === 0) return;
    
    console.log('🚀 Initializing grid...');
    
    const columnCount = getColumnCount();
    if (columnCount === 0) return;
    
    setNumColumns(columnCount);
    const columns = groupDataIntoColumns(brandData, columnCount);
    setColumnData(columns);
    
    console.log('✅ Grid initialization complete');
  }, [brandData, getColumnCount, groupDataIntoColumns]);

  // Apply ScrollSmoother effects to columns - FIXED VERSION
  useEffect(() => {
    if (!scrollSmoother || columnData.length === 0) {
      console.log('⚠️ ScrollSmoother not ready or no column data');
      return;
    }

    console.log('🎯 Applying ScrollSmoother effects to columns...');

    // Wait for DOM to be updated and ScrollSmoother to be ready
    const applyEffects = () => {
      columnRefs.current.forEach((columnElement, index) => {
        if (columnElement) {
          const lag = baseLag + (index + 1) * lagScale;
          
          try {
            // Apply ScrollSmoother effect with lag
            scrollSmoother.effects(columnElement, { speed: 1, lag });
            console.log(`✨ Applied ScrollSmoother effect to column ${index} with lag ${lag}`);
          } catch (error) {
            console.error(`❌ Failed to apply effect to column ${index}:`, error);
          }
        } else {
          console.warn(`⚠️ Column element ${index} not found`);
        }
      });
    };

    // Apply effects with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(applyEffects, 100);

    return () => clearTimeout(timeoutId);
  }, [scrollSmoother, columnData]);

  useEffect(() => {
    if (brandData.length > 0) {
      console.log(`🎯 Setting up grid for ${brandData.length} items`);
      
      // Wait for next tick to ensure DOM is updated
      setTimeout(() => {
        initGrid();
      }, 100);
    }
  }, [brandData, initGrid]);

  useEffect(() => {
    const handleResize = () => {
      const newColumnCount = getColumnCount();
      if (newColumnCount !== numColumns && newColumnCount > 0) {
        console.log(`📐 Column count changed: ${numColumns} → ${newColumnCount}`);
        setNumColumns(newColumnCount);
        const columns = groupDataIntoColumns(brandData, newColumnCount);
        setColumnData(columns);
      }
    };

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
  }, [numColumns, brandData, getColumnCount, groupDataIntoColumns]);

  const downloadImage = useCallback(async (imageUrl: string, brandName: string) => {
    try {
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>';
      }

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

  const setColumnRef = useCallback((element: HTMLDivElement | null, index: number) => {
    columnRefs.current[index] = element;
    console.log(`📍 Set column ref ${index}:`, element ? 'Found' : 'Null');
  }, []);

  if (connectionStatus === 'testing') {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-lg font-medium mb-2">Testing Supabase Connection...</div>
          <p className="text-gray-600">Please wait while we verify your database connection.</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'failed') {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <div className="text-red-600 text-lg font-medium mb-2">Database Connection Failed</div>
          <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>• Check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</p>
            <p>• Verify your Supabase project is active</p>
            <p>• Check Row Level Security policies on your Curatit table</p>
          </div>
          <button
            onClick={() => {
              setConnectionStatus('testing');
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
          <div className="text-red-600 text-lg font-medium mb-2">Failed to load brand data</div>
          <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
          <button
            onClick={fetchBrandData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (brandData.length === 0) {
    return (
      <div className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16">
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="text-gray-600 text-lg font-medium mb-2">No brand data found</div>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            Your Curatit table appears to be empty. Add some brands to see them here.
          </p>
          <button
            onClick={fetchBrandData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  const renderBrandItem = (brand: BrandData, index: number) => (
    <figure key={`brand-${brand.id}-${index}`} className="grid__item group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <OptimizedImage
          src={brand.postImage}
          alt={`${brand.brand_name} brand post`}
          width={400}
          height={400}
          quality={80}
          priority={index < 8}
          className="w-full h-full"
          style={{ aspectRatio: '1/1' }}
        />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-lg`}>
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

        <div className="absolute top-14 left-3 sm:top-16 sm:left-4 md:top-18 md:left-4 z-10">
          <h3 className="text-white font-medium text-sm sm:text-base md:text-lg bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            {brand.brand_name}
          </h3>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <span className="text-white text-xs sm:text-sm bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm border border-white/30">
            {brand.category}
          </span>
        </div>

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

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-xl"></div>
      </div>
    </figure>
  );

  return (
    <div 
      ref={gridRef} 
      className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16"
    >
      {columnData.length > 0 ? (
        // Render columns with React state management and GSAP effects
        columnData.map((column, columnIndex) => (
          <div
            key={`column-${columnIndex}`}
            ref={(el) => setColumnRef(el, columnIndex)}
            className="grid__column"
            data-lag={baseLag + (columnIndex + 1) * lagScale} // Debug attribute
          >
            {column.map((brand, itemIndex) => renderBrandItem(brand, itemIndex))}
          </div>
        ))
      ) : (
        // Fallback to simple grid rendering if columns aren't ready
        brandData.map((brand, i) => renderBrandItem(brand, i))
      )}
    </div>
  );
}

export { Grid }