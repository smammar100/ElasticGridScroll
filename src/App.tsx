import { Hero } from "@/components/ui/animated-hero"
import { Grid } from "@/components/ui/grid"

function App() {
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <div className="min-h-screen bg-white">
          <Hero />
          <Grid />
        </div>
      </div>
    </div>
  )
}

export default App