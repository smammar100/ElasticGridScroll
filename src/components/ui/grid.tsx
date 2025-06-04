import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function Grid() {
  useEffect(() => {
    ScrollSmoother.create({
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    });
  }, []);

  return (
    <div className="grid">
      {[...Array(20)].map((_, i) => (
        <figure key={i} className="grid__item">
          <div 
            className="grid__item-img" 
            style={{
              backgroundImage: `url(https://images.pexels.com/photos/${18111088 + i}/pexels-photo-${18111088 + i}.jpeg)`
            }}
          />
          <figcaption className="grid__item-caption">Item {i + 1}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export { Grid };