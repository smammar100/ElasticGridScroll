import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import { X } from "lucide-react";
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
                className="fixed inset-0 bg-black/50 z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed left-[50%] top-[50%] z-50 w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg"
              >
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    We'd love your feedback!
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="text-gray-400 hover:text-gray-600">
                      <X size={24} />
                    </button>
                  </Dialog.Close>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What best describes your role?
                    </label>
                    <Select.Root>
                      <Select.Trigger className="w-full px-3 py-2 border rounded-md">
                        <Select.Value placeholder="Select your role" />
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white rounded-md shadow-lg">
                          <Select.Viewport>
                            {roles.map((role) => (
                              <Select.Item
                                key={role}
                                value={role}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
                    <label className="block text-sm font-medium mb-2">
                      What's one thing you wish Curatit did better?
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                      placeholder="Share your thoughts..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Suggest a brand you'd like to see posts from:
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="e.g., Notion, Figma, Liquid Death, Monzo, Glossier"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      How would you rate your experience so far?
                    </label>
                    <RadioGroup.Root className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <RadioGroup.Item
                          key={value}
                          value={value.toString()}
                          className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        >
                          {value}
                        </RadioGroup.Item>
                      ))}
                    </RadioGroup.Root>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white rounded-full py-2 hover:bg-gray-800 transition-colors"
                  >
                    Submit Feedback
                  </button>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export { FeedbackModal };