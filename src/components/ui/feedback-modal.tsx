import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const roles = [
  "Designer",
  "Developer",
  "Product Manager",
  "Marketing",
  "Other"
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8"
              >
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg bg-white p-4 sm:p-6 md:p-8 shadow-lg relative mx-auto max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <Dialog.Title className="text-lg sm:text-xl md:text-2xl font-semibold pr-4">
                        We'd love your feedback!
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button 
                          className="text-gray-400 hover:text-gray-600 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
                          aria-label="Close modal"
                        >
                          <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <form className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-2">
                          What best describes your role?
                        </label>
                        <Select.Root>
                          <Select.Trigger className="w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-md text-sm sm:text-base min-h-[48px] flex items-center justify-between touch-manipulation">
                            <Select.Value placeholder="Select your role" />
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-md shadow-lg border z-[10000] max-h-60 overflow-y-auto">
                              <Select.Viewport>
                                {roles.map((role) => (
                                  <Select.Item
                                    key={role}
                                    value={role}
                                    className="px-3 sm:px-4 py-3 sm:py-4 hover:bg-gray-100 cursor-pointer text-sm sm:text-base touch-manipulation"
                                  >
                                    <Select.ItemText>{role}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-2">
                          What's one thing you wish Curatit did better?
                        </label>
                        <textarea
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-md h-20 sm:h-24 md:h-28 resize-none text-sm sm:text-base touch-manipulation"
                          placeholder="Share your thoughts..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-2">
                          Suggest a brand you'd like to see posts from:
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-md text-sm sm:text-base min-h-[48px] touch-manipulation"
                          placeholder="e.g., Notion, Figma, Liquid Death, Monzo, Glossier"
                        />
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium mb-2">
                          How would you rate your experience so far?
                        </label>
                        <RadioGroup.Root className="flex gap-2 sm:gap-4 flex-wrap">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <RadioGroup.Item
                              key={value}
                              value={value.toString()}
                              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm sm:text-base font-medium touch-manipulation data-[state=checked]:bg-black data-[state=checked]:text-white data-[state=checked]:border-black"
                            >
                              {value}
                            </RadioGroup.Item>
                          ))}
                        </RadioGroup.Root>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-black text-white rounded-full py-3 sm:py-4 text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors min-h-[48px] touch-manipulation"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  </motion.div>
                </Dialog.Content>
              </motion.div>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export { FeedbackModal };