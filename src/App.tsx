import { useEffect } from "react"
import { Navbar1 } from "@/components/ui/navbar-1"
import { Hero } from "@/components/ui/animated-hero"
import { Grid } from "@/components/ui/grid"
import { SubscriptionPage } from "@/components/ui/subscription-page"
import { CardGridDemo } from "@/components/ui/card-grid-demo"
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

function App() {
  useEffect(() => {
    // Initialize ScrollSmoother with optimized settings for performance
    const smoother = ScrollSmoother.create({
      smooth: 0.6, // Reduced for better performance
      effects: true,
      normalizeScroll: true,
    })

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = 'https://images.pexels.com/photos/18111088/pexels-photo-18111088.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1';
    preloadLink.as = 'image';
    document.head.appendChild(preloadLink);

    return () => {
      smoother?.kill()
      document.head.removeChild(preloadLink);
    }
  }, [])

  // Check if we should show the card grid demo
  const showCardDemo = new URLSearchParams(window.location.search).get('demo') === 'cards';

  if (showCardDemo) {
    return <CardGridDemo />;
  }

  return (
    <div id="smooth-wrapper" className="min-h-screen">
      <div id="smooth-content" className="w-full">
        <div className="bg-white">
          <Navbar1 />
          <Hero />
          <Grid />
        </div>
        <SubscriptionPage />
      </div>
    </div>
  )
}

export default App