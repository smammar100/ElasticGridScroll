import React, { useState, useCallback } from 'react';
import { VirtualCardGrid } from './virtual-card-grid';

interface DemoCardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  timestamp: number;
}

// Mock data generator
const generateMockCard = (index: number): DemoCardData => {
  const categories = ['Design', 'Development', 'Marketing', 'Business', 'Technology'];
  const titles = [
    'Modern Web Design Trends',
    'React Performance Optimization',
    'Digital Marketing Strategies',
    'Startup Growth Hacks',
    'AI in Web Development',
    'UX Design Principles',
    'JavaScript Best Practices',
    'Brand Identity Design',
    'Product Management Tips',
    'Cloud Architecture Patterns'
  ];
  
  const descriptions = [
    'Explore the latest trends in modern web design and user experience.',
    'Learn advanced techniques for optimizing React applications.',
    'Discover effective strategies for digital marketing campaigns.',
    'Proven methods for scaling your startup business.',
    'How artificial intelligence is transforming web development.',
    'Essential principles for creating exceptional user experiences.',
    'Best practices and patterns for writing clean JavaScript code.',
    'Creating memorable and effective brand identities.',
    'Strategic approaches to successful product management.',
    'Scalable cloud architecture patterns and implementations.'
  ];

  return {
    id: `card-${index}`,
    title: titles[index % titles.length],
    description: descriptions[index % descriptions.length],
    imageUrl: `https://images.pexels.com/photos/${18111088 + (index % 20)}/pexels-photo-${18111088 + (index % 20)}.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1`,
    category: categories[index % categories.length],
    timestamp: Date.now() - (index * 86400000), // Spread over days
  };
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CardGridDemo: React.FC = () => {
  const [totalItems] = useState(2000); // Simulate 2000 total items
  const [loadedItems, setLoadedItems] = useState<Map<number, DemoCardData>>(new Map());

  // Simulate loading items from an API
  const loadMoreItems = useCallback(async (startIndex: number, stopIndex: number) => {
    // Simulate network delay
    await delay(Math.random() * 500 + 200);
    
    // Simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Network error: Failed to fetch data');
    }

    const items: DemoCardData[] = [];
    for (let i = startIndex; i <= stopIndex; i++) {
      if (i < totalItems) {
        items.push(generateMockCard(i));
      }
    }

    // Update loaded items cache
    setLoadedItems(prev => {
      const updated = new Map(prev);
      items.forEach((item, index) => {
        updated.set(startIndex + index, item);
      });
      return updated;
    });

    return items;
  }, [totalItems]);

  const handleCardClick = useCallback((card: DemoCardData) => {
    console.log('Card clicked:', card);
    // Handle card click - could open modal, navigate, etc.
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            High-Performance Card Grid
          </h1>
          <p className="text-gray-600">
            Efficiently displaying {totalItems.toLocaleString()} cards with virtual scrolling, 
            lazy loading, and performance monitoring.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>✓ Virtual scrolling for smooth performance</span>
            <span>✓ Lazy loading with skeleton states</span>
            <span>✓ Error boundaries and fallbacks</span>
            <span>✓ Performance monitoring</span>
            <span>✓ Responsive grid layout</span>
          </div>
        </div>
        
        <div className="h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
          <VirtualCardGrid
            totalItems={totalItems}
            loadMoreItems={loadMoreItems}
            onCardClick={handleCardClick}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default CardGridDemo;