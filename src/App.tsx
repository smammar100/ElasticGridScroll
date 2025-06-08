import { Navbar1 } from "@/components/ui/navbar-1"
import { Hero } from "@/components/ui/animated-hero"
import { Grid } from "@/components/ui/grid"
import { SubscriptionPage } from "@/components/ui/subscription-page"

function App() {
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