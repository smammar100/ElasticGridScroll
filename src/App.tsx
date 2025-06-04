import { Navbar1 } from "@/components/ui/navbar-1"
import { Hero } from "@/components/ui/animated-hero"
import { Grid } from "@/components/ui/grid"

function App() {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div className="min-h-screen bg-white">
          <Navbar1 />
          <Hero />
          <Grid />
        </div>
      </div>
    </div>
  )
}

export default App