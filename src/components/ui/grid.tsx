import { useEffect, useRef, useCallback } from 'react';
import { Download } from 'lucide-react';
import { OptimizedImage } from './optimized-image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const baseLag = 0.2;
const lagScale = 0.3;

// Sample brand data for demonstration
const brandData = [
  { name: "Zenith", logo: "Z", color: "from-blue-500 to-purple-600" },
  { name: "Nexus", logo: "N", color: "from-green-500 to-teal-600" },
  { name: "Apex", logo: "A", color: "from-red-500 to-pink-600" },
  { name: "Flux", logo: "F", color: "from-yellow-500 to-orange-600" },
  { name: "Vortex", logo: "V", color: "from-indigo-500 to-blue-600" },
  { name: "Echo", logo: "E", color: "from-purple-500 to-pink-600" },
  { name: "Prism", logo: "P", color: "from-cyan-500 to-blue-600" },
  { name: "Orbit", logo: "O", color: "from-emerald-500 to-green-600" },
  { name: "Nova", logo: "N", color: "from-rose-500 to-red-600" },
  { name: "Pulse", logo: "P", color: "from-violet-500 to-purple-600" },
  { name: "Spark", logo: "S", color: "from-amber-500 to-yellow-600" },
  { name: "Wave", logo: "W", color: "from-teal-500 to-cyan-600" },
  { name: "Drift", logo: "D", color: "from-slate-500 to-gray-600" },
  { name: "Shift", logo: "S", color: "from-lime-500 to-green-600" },
  { name: "Bloom", logo: "B", color: "from-pink-500 to-rose-600" },
  { name: "Glow", logo: "G", color: "from-orange-500 to-red-600" },
  { name: "Flow", logo: "F", color: "from-sky-500 to-blue-600" },
  { name: "Beam", logo: "B", color: "from-fuchsia-500 to-purple-600" },
  { name: "Core", logo: "C", color: "from-emerald-500 to-teal-600" },
  { name: "Edge", logo: "E", color: "from-indigo-500 to-violet-600" }
];

function Grid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const originalItemsRef = useRef<Element[]>([]);
  const currentColumnCountRef = useRef<number | null>(null);
  const smootherRef = useRef<any>(null);

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
      link.download = `${brandName.toLowerCase()}-brand-image.jpg`;
      
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
    if (!gridRef.current) return;
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
  }, [initGrid, getColumnCount]);

  return (
    <div 
      ref={gridRef} 
      className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16"
    >
      {brandData.map((brand, i) => {
        const imageUrl = `https://images.pexels.com/photos/${18111088 + i}/pexels-photo-${18111088 + i}.jpeg`;
        
        return (
          <figure key={i} className="grid__item group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <OptimizedImage
                src={imageUrl}
                alt={`${brand.name} brand inspiration`}
                width={400}
                height={400}
                quality={80}
                priority={i < 4} // Prioritize first 4 images
                className="w-full h-full"
                style={{ aspectRatio: '1/1' }}
              />

              {/* Brand Logo - Top Left */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-semibold text-sm sm:text-base md:text-lg">{brand.logo}</span>
                </div>
              </div>

              {/* Brand Name */}
              <div className="absolute top-14 left-3 sm:top-16 sm:left-4 md:top-18 md:left-4 z-10">
                <h3 className="text-white font-medium text-sm sm:text-base md:text-lg bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  {brand.name}
                </h3>
              </div>

              {/* Download Button */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10">
                <button 
                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 group-hover:bg-text-primary group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(imageUrl, brand.name);
                  }}
                  title={`Download ${brand.name} image`}
                  aria-label={`Download ${brand.name} image`}
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