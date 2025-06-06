import { useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
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

  const getColumnCount = () => {
    if (!gridRef.current) return 0;
    const styles = getComputedStyle(gridRef.current);
    return styles.getPropertyValue('grid-template-columns').split(' ').filter(Boolean).length;
  };

  const groupItemsByColumn = () => {
    if (!gridRef.current) return { columns: [], numColumns: 0 };
    const numColumns = getColumnCount();
    const columns = Array.from({ length: numColumns }, () => []);
    
    gridRef.current.querySelectorAll('.grid__item').forEach((item, index) => {
      columns[index % numColumns].push(item);
    });

    return { columns, numColumns };
  };

  const clearGrid = () => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.grid__column').forEach(col => col.remove());
    originalItemsRef.current.forEach(item => gridRef.current?.appendChild(item));
  };

  const buildGrid = (columns: Element[][]) => {
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
  };

  const initGrid = () => {
    if (!gridRef.current) return;
    clearGrid();
    const { columns, numColumns } = groupItemsByColumn();
    currentColumnCountRef.current = numColumns;
    const columnContainers = buildGrid(columns);

    const smoother = ScrollSmoother.get();
    if (smoother) {
      columnContainers.forEach(({ element, lag }) => {
        smoother.effects(element, { speed: 1, lag });
      });
    }
  };

  // Function to download image
  const downloadImage = async (imageUrl: string, brandName: string) => {
    try {
      // Show loading state
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.innerHTML = '<div class="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>';
      }

      // Fetch the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${brandName.toLowerCase()}-brand-image.jpg`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Reset button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
      }
    } catch (error) {
      console.error('Download failed:', error);
      
      // Reset button on error
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = '<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
      }
      
      // Show error message
      alert('Download failed. Please try again.');
    }
  };

  useEffect(() => {
    if (!gridRef.current) return;
    originalItemsRef.current = Array.from(gridRef.current.querySelectorAll('.grid__item'));

    const smoother = ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });

    initGrid();

    const handleResize = () => {
      const newColumnCount = getColumnCount();
      if (newColumnCount !== currentColumnCountRef.current) {
        initGrid();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      smoother?.kill();
    };
  }, []);

  return (
    <div 
      ref={gridRef} 
      className="grid demo-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16"
    >
      {brandData.map((brand, i) => {
        const imageUrl = `https://images.pexels.com/photos/${18111088 + i}/pexels-photo-${18111088 + i}.jpeg`;
        
        return (
          <figure key={i} className="grid__item group cursor-pointer">
            <div 
              className="grid__item-img relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              style={{
                backgroundImage: `url(${imageUrl})`,
                aspectRatio: '1/1',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Brand Logo - Top Left - Responsive sizing */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${brand.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-sm sm:text-lg md:text-xl">{brand.logo}</span>
                </div>
              </div>

              {/* Brand Name - Below Logo - Responsive sizing */}
              <div className="absolute top-12 left-2 sm:top-16 sm:left-3 md:top-18 md:left-3 z-10">
                <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                  {brand.name}
                </h3>
              </div>

              {/* Download Button - Bottom Right - Touch-friendly sizing */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
                <button 
                  className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 group-hover:bg-black group-hover:text-white disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(imageUrl, brand.name);
                  }}
                  title={`Download ${brand.name} image`}
                  aria-label={`Download ${brand.name} image`}
                >
                  <Download size={16} className="text-gray-700 group-hover:text-white w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 rounded-lg"></div>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

export { Grid }