import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const baseLag = 0.2;
const lagScale = 0.3;

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
    <div ref={gridRef} className="grid demo-3">
      {[...Array(20)].map((_, i) => (
        <figure key={i} className="grid__item">
          <div 
            className="grid__item-img" 
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/${18111088 + i}/pexels-photo-${18111088 + i}.jpeg)`,
              aspectRatio: '1/1',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <figcaption className="grid__item-caption">Item {i + 1}</figcaption>
        </figure>
      ))}
    </div>
  );
}