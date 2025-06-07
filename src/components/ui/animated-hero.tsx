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
        <div className="flex gap-6 sm:gap-8 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 items-center justify-center flex-col">
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

      
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };