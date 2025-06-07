"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { FeedbackModal } from "./feedback-modal"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-2 sm:py-4 px-4 sm:px-6 md:px-8">
      <div className="flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-white/50 rounded-full shadow-lg w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl relative backdrop-blur-sm">
        <div className="flex items-center">
          <motion.div
            className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FF9966] to-[#FF5E62]" />
          </motion.div>
        </div>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="inline-flex items-center justify-center px-3 sm:px-4 md:px-5 py-2 text-sm sm:text-base text-white bg-black rounded-full hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px]"
          >
            Share Feedback
          </button>
        </motion.div>

        {/* Mobile Menu Button - Touch-friendly size */}
        <motion.button 
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors touch-manipulation" 
          onClick={toggleMenu} 
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 md:hidden overflow-y-auto"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
            </motion.button>
            
            <div className="flex flex-col space-y-6 sm:space-y-8">
              {["Home", "Pricing", "Docs", "Projects"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a 
                    href="#" 
                    className="text-lg sm:text-xl text-gray-900 font-medium block py-2 touch-manipulation" 
                    onClick={toggleMenu}
                  >
                    {item}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-4 sm:pt-6"
              >
                <button
                  onClick={() => {
                    toggleMenu();
                    setIsFeedbackModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg text-white bg-black rounded-full hover:bg-gray-800 transition-colors touch-manipulation min-h-[48px]"
                >
                  Share Feedback
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </div>
  )
}

export { Navbar1 }