import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import { X, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useState } from "react";

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

  // Form state
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [brandSuggestion, setBrandSuggestion] = useState<string>("");
  const [rating, setRating] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct email body
    const emailBody = `
Curatit Feedback Submission
==========================

Role: ${selectedRole || 'Not specified'}

What could Curatit do better?
${feedbackText || 'No feedback provided'}

Brand Suggestion:
${brandSuggestion || 'No brand suggested'}

Experience Rating: ${rating || 'Not rated'}/5

---
Submitted on: ${new Date().toLocaleString()}
    `.trim();

    // Create mailto URL
    const subject = encodeURIComponent('Curatit Feedback');
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:syed.m.ammar@hotmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Reset form and close modal
    setSelectedRole("");
    setFeedbackText("");
    setBrandSuggestion("");
    setRating("");
    onClose();
  };

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
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-xl relative mx-auto max-h-[90vh] overflow-y-auto border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-6 sm:mb-8">
                      <Dialog.Title className="text-xl sm:text-2xl md:text-3xl font-semibold pr-4 text-text-primary">
                        We'd love your feedback!
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button 
                          className="text-text-tertiary hover:text-text-secondary w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors touch-manipulation"
                          aria-label="Close modal"
                        >
                          <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      <div>
                        <label className="block text-base sm:text-lg font-medium mb-3 text-text-primary">
                          What best describes your role?
                        </label>
                        <Select.Root value={selectedRole} onValueChange={setSelectedRole}>
                          <Select.Trigger className="w-full px-4 sm:px-5 py-4 sm:py-5 border border-gray-200 rounded-xl text-base sm:text-lg min-h-[52px] flex items-center justify-between touch-manipulation hover:border-gray-300 transition-colors font-normal text-text-primary">
                            <Select.Value placeholder="Select your role" />
                            <ChevronDown className="h-5 w-5 opacity-50" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-white rounded-xl shadow-xl border border-gray-100 z-[10000] max-h-60 overflow-y-auto">
                              <Select.Viewport>
                                {roles.map((role) => (
                                  <Select.Item
                                    key={role}
                                    value={role}
                                    className="px-4 sm:px-5 py-4 sm:py-5 hover:bg-gray-50 cursor-pointer text-base sm:text-lg touch-manipulation text-text-primary font-normal"
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
                        <label className="block text-base sm:text-lg font-medium mb-3 text-text-primary">
                          What's one thing you wish Curatit did better?
                        </label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          className="w-full px-4 sm:px-5 py-4 sm:py-5 border border-gray-200 rounded-xl h-24 sm:h-28 md:h-32 resize-none text-base sm:text-lg touch-manipulation hover:border-gray-300 transition-colors font-normal text-text-primary"
                          placeholder="Share your thoughts..."
                        />
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-medium mb-3 text-text-primary">
                          Suggest a brand you'd like to see posts from:
                        </label>
                        <input
                          type="text"
                          value={brandSuggestion}
                          onChange={(e) => setBrandSuggestion(e.target.value)}
                          className="w-full px-4 sm:px-5 py-4 sm:py-5 border border-gray-200 rounded-xl text-base sm:text-lg min-h-[52px] touch-manipulation hover:border-gray-300 transition-colors font-normal text-text-primary"
                          placeholder="e.g., Notion, Figma, Liquid Death, Monzo, Glossier"
                        />
                      </div>

                      <div>
                        <label className="block text-base sm:text-lg font-medium mb-3 text-text-primary">
                          How would you rate your experience so far?
                        </label>
                        <RadioGroup.Root value={rating} onValueChange={setRating} className="flex gap-3 sm:gap-4 flex-wrap">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <RadioGroup.Item
                              key={value}
                              value={value.toString()}
                              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-base sm:text-lg font-medium touch-manipulation data-[state=checked]:bg-text-primary data-[state=checked]:text-white data-[state=checked]:border-text-primary"
                            >
                              {value}
                            </RadioGroup.Item>
                          ))}
                        </RadioGroup.Root>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-text-primary text-white rounded-full py-4 sm:py-5 text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors min-h-[52px] touch-manipulation"
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