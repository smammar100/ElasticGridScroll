import { useEffect } from "react"
import { Navbar1 } from "@/components/ui/navbar-1"
import { Hero } from "@/components/ui/animated-hero"
import { Grid } from "@/components/ui/grid"
import { SubscriptionPage } from "@/components/ui/subscription-page"
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollSmoother from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

function App() {
  useEffect(() => {
    // Initialize ScrollSmoother globally once
    const smoother = ScrollSmoother.create({
      smooth: 0.8, // Reduced for better performance
      effects: true,
      normalizeScroll: true,
    })

    return () => {
      smoother?.kill()
    }
  }, [])

  return (
    <div id="smooth-wrapper" className="min-h-screen">
      <div id="smooth-content" className="w-full">
        <div className="min-h-screen bg-white">
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