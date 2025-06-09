import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { VariableSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { ErrorBoundary } from 'react-error-boundary';
import { debounce, throttle } from 'lodash-es';

// Types
interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  timestamp: number;
  isLoaded?: boolean;
  hasError?: boolean;
}

interface VirtualCardGridProps {
  totalItems: number;
  loadMoreItems: (startIndex: number, stopIndex: number) => Promise<CardData[]>;
  onCardClick?: (card: CardData) => void;
  className?: string;
}

interface PerformanceMetrics {
  fcp: number;
  tti: number;
  memoryUsage: number;
  frameRate: number;
  renderTime: number;
}

// Skeleton Card Component
const SkeletonCard: React.FC = React.memo(() => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shiny-text"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
));

// Error Fallback Component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <div className="text-red-600 mb-2">⚠️ Something went wrong</div>
    <p className="text-sm text-red-500 mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Individual Card Component
const Card: React.FC<{ 
  data: CardData; 
  onClick?: (card: CardData) => void;
  style?: React.CSSProperties;
}> = React.memo(({ data, onClick, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleClick = useCallback(() => {
    onClick?.(data);
  }, [data, onClick]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger image loading when card comes into view
            const img = entry.target.querySelector('img');
            if (img && !img.src) {
              img.src = data.imageUrl;
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [data.imageUrl]);

  if (!data.isLoaded) {
    return <SkeletonCard />;
  }

  return (
    <div
      ref={cardRef}
      style={style}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shiny-text"></div>
        )}
        
        {imageError ? (
          <div className="h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Image failed to load</span>
          </div>
        ) : (
          <img
            data-src={data.imageUrl}
            alt={data.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        )}
        
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full backdrop-blur-sm">
            {data.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{data.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{data.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {new Date(data.timestamp).toLocaleDateString()}
          </span>
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
});

// Performance Monitor Hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    tti: 0,
    memoryUsage: 0,
    frameRate: 0,
    renderTime: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    // Monitor FCP and TTI
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
      });
    });

    observer.observe({ entryTypes: ['paint', 'navigation'] });

    // Monitor frame rate
    const measureFrameRate = () => {
      frameCountRef.current++;
      const now = performance.now();
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setMetrics(prev => ({ ...prev, frameRate: fps }));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);

    // Monitor memory usage
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({ 
          ...prev, 
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) 
        }));
      }
    };

    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
};

// Main Virtual Card Grid Component
export const VirtualCardGrid: React.FC<VirtualCardGridProps> = ({
  totalItems,
  loadMoreItems,
  onCardClick,
  className = '',
}) => {
  const [items, setItems] = useState<Map<number, CardData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const gridRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const metrics = usePerformanceMonitor();

  // Calculate grid dimensions
  const CARD_WIDTH = 320;
  const CARD_HEIGHT = 400;
  const GAP = 16;

  const columnCount = Math.floor((dimensions.width + GAP) / (CARD_WIDTH + GAP)) || 1;
  const rowCount = Math.ceil(totalItems / columnCount);

  // Resize observer for responsive grid
  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const entry = entries[0];
        if (entry) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }, 100)
    );

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Load items function with error handling
  const loadItems = useCallback(
    throttle(async (startIndex: number, stopIndex: number) => {
      if (isLoading) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const startTime = performance.now();
        const newItems = await loadMoreItems(startIndex, stopIndex);
        const endTime = performance.now();
        
        setMetrics(prev => ({ ...prev, renderTime: endTime - startTime }));
        
        setItems(prevItems => {
          const updatedItems = new Map(prevItems);
          newItems.forEach((item, index) => {
            updatedItems.set(startIndex + index, { ...item, isLoaded: true });
          });
          return updatedItems;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load items');
        console.error('Error loading items:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200),
    [loadMoreItems, isLoading]
  );

  // Check if item is loaded
  const isItemLoaded = useCallback((index: number) => {
    return items.has(index);
  }, [items]);

  // Cell renderer for react-window
  const Cell = useCallback(({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    
    if (index >= totalItems) {
      return null;
    }

    const item = items.get(index);
    
    if (!item) {
      return (
        <div style={style}>
          <div style={{ margin: GAP / 2 }}>
            <SkeletonCard />
          </div>
        </div>
      );
    }

    return (
      <div style={style}>
        <div style={{ margin: GAP / 2 }}>
          <Card data={item} onClick={onCardClick} />
        </div>
      </div>
    );
  }, [items, columnCount, totalItems, onCardClick]);

  // Performance metrics display (development only)
  const showMetrics = process.env.NODE_ENV === 'development';

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div ref={containerRef} className={`w-full h-full ${className}`}>
        {showMetrics && (
          <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
            <div>FCP: {metrics.fcp.toFixed(0)}ms</div>
            <div>Memory: {metrics.memoryUsage}MB</div>
            <div>FPS: {metrics.frameRate}</div>
            <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {dimensions.width > 0 && (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={totalItems}
            loadMoreItems={loadItems}
            threshold={10}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeGrid
                ref={(grid) => {
                  gridRef.current = grid;
                  ref(grid);
                }}
                columnCount={columnCount}
                columnWidth={() => CARD_WIDTH + GAP}
                height={dimensions.height}
                rowCount={rowCount}
                rowHeight={() => CARD_HEIGHT + GAP}
                width={dimensions.width}
                onItemsRendered={({
                  visibleColumnStartIndex,
                  visibleColumnStopIndex,
                  visibleRowStartIndex,
                  visibleRowStopIndex,
                }) => {
                  onItemsRendered({
                    overscanStartIndex: visibleRowStartIndex * columnCount + visibleColumnStartIndex,
                    overscanStopIndex: visibleRowStopIndex * columnCount + visibleColumnStopIndex,
                    visibleStartIndex: visibleRowStartIndex * columnCount + visibleColumnStartIndex,
                    visibleStopIndex: visibleRowStopIndex * columnCount + visibleColumnStopIndex,
                  });
                }}
                overscanRowCount={2}
                overscanColumnCount={1}
              >
                {Cell}
              </VariableSizeGrid>
            )}
          </InfiniteLoader>
        )}

        {isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading more cards...</span>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default VirtualCardGrid;