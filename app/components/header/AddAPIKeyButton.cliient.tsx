import { classNames } from '~/utils/classNames';
import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { cubicEasingFn } from '~/utils/easings';

export function AddApiKeyButton() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ApiDialog open={open} setOpen={setOpen} />
      <Button onClick={() => setOpen(true)}>Add Api Keys</Button>
    </div>
  );
}

interface ButtonProps {
  children?: any;
  onClick?: VoidFunction;
}

function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2 bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary',
      )}
    >
      {children}
    </button>
  );
}

type DialogContent = { type: 'add' } | null;

const menuVariants = {
  closed: {
    opacity: 0,
    visibility: 'hidden',
    left: '-150px',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    opacity: 1,
    visibility: 'initial',
    left: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
} satisfies Variants;

function ApiDialog({ open, setOpen }: { open: boolean; setOpen: any }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);

  const closeDialog = () => {
    setDialogContent(null);
  };

  useEffect(() => {
    if (open) {
      setDialogContent({ type: 'add' });
    }
  }, [open]);

  useEffect(() => {
    function onMouseClick(event: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener('click', onMouseClick);

    return () => {
      window.removeEventListener('click', onMouseClick);
    };
  }, [open]);

  return (
    <motion.div
      ref={menuRef}
      initial="closed"
      animate={open ? 'open' : 'closed'}
      variants={menuVariants}
      className="flex flex-col side-menu fixed top-0 w-[350px] h-full bg-bolt-elements-background-depth-2 border-r rounded-r-3xl border-bolt-elements-borderColor z-sidebar shadow-xl shadow-bolt-elements-sidebar-dropdownShadow text-sm"
    >
      <div className="flex items-center h-[var(--header-height)]">{/* Placeholder */}</div>
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="flex-1 overflow-scroll pl-4 pr-5 pb-5">
          <DialogRoot open={dialogContent !== null}>
            <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
              {dialogContent?.type === 'add' && (
                <>
                  <DialogTitle>Add Api Keys</DialogTitle>
                  <DialogDescription asChild className="grid gap-3">
                    <div>
                      <div>
                        <label>open ai key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>groq key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>anthropic key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>google generative ai key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>ollama api base key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>openai like base key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>openai like key</label>
                        <input type="text" />
                      </div>
                      <div>
                        <label>mistral key</label>
                        <input type="text" />
                      </div>
                    </div>
                  </DialogDescription>
                  <div className="px-5 pb-4 bg-bolt-elements-background-depth-2 flex gap-2 justify-end">
                    <DialogButton type="secondary" onClick={closeDialog}>
                      Cancel
                    </DialogButton>
                    <DialogButton
                      type="primary"
                      onClick={() => {
                        console.log('saved api keys');
                        closeDialog();
                      }}
                    >
                      Add
                    </DialogButton>
                  </div>
                </>
              )}
            </Dialog>
          </DialogRoot>
        </div>
      </div>
    </motion.div>
  );
}
