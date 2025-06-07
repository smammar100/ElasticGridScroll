import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PhoneCall, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedShinyTextDemo } from "@/components/ui/animated-shiny-text-demo";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex gap-6 sm:gap-8 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 items-center justify-center flex-col">
          <AnimatedShinyTextDemo />
          
          <div className="flex gap-4 sm:gap-6 flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl tracking-tighter text-center font-regular leading-tight">
              <span className="text-spektr-cyan-50 block sm:inline">This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed tracking-tight text-muted-foreground max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl text-center px-2 sm:px-4">
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>

            {/* CTA Buttons - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[48px] touch-manipulation"
                size="lg"
              >
                Get Started
                <MoveRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[48px] touch-manipulation"
                size="lg"
              >
                <PhoneCall className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };