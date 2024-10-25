import { classNames } from '~/utils/classNames';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from '~/components/ui/Dialog';
import { cubicEasingFn } from '~/utils/easings';
import { ClientOnly } from 'remix-utils/client-only';

export function AddApiKeyButton() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <ClientOnly>{() => <ApiDialog open={open} setOpen={setOpen} />}</ClientOnly>
      <Button onClick={() => setOpen(true)}>Add Api Keys</Button>
    </div>
  );
}

interface ButtonProps {
  children?: ReactNode;
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

  function handleSubmit(e: any) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const apiKeys = {
      openAi: formData.get('openAi') as string,
      groq: formData.get('groq') as string,
      anthropic: formData.get('anthropic') as string,
      openRouter: formData.get('openRouter') as string,
      googleGenAi: formData.get('googleGenAi') as string,
      ollamaBase: formData.get('ollamaBase') as string,
      openAiLikeBase: formData.get('openAiLikeBase') as string,
      openAiLike: formData.get('openAiLike') as string,
      mistral: formData.get('mistral') as string,
    };

    sessionStorage.setItem('apiKeys', JSON.stringify(apiKeys));

    closeDialog();
  }

  return (
    <motion.div
      ref={menuRef}
      initial="closed"
      animate={open ? 'open' : 'closed'}
      variants={menuVariants}
      className="flex flex-col side-menu fixed top-0 w-[350px] h-full bg-bolt-elements-background-depth-2 border-r rounded-r-3xl border-bolt-elements-borderColor z-sidebar shadow-xl shadow-bolt-elements-sidebar-dropdownShadow text-sm"
    >
      <DialogRoot open={dialogContent !== null}>
        <Dialog className="min-w-[36rem] min-h-[35rem]" onBackdrop={closeDialog} onClose={closeDialog}>
          {dialogContent?.type === 'add' && (
            <form onSubmit={(e) => handleSubmit(e)}>
              <DialogTitle>Add Api Keys</DialogTitle>
              <DialogDescription asChild className="grid gap-3">
                <div>
                  <div className="flex justify-between">
                    <Label>OPEN AI</Label>
                    <Input name="openAi" />
                  </div>
                  <div className="flex justify-between">
                    <Label>GROQ</Label>
                    <Input name="groq" />
                  </div>
                  <div className="flex justify-between">
                    <Label>ANTHROPIC</Label>
                    <Input name="anthropic" />
                  </div>
                  <div className="flex justify-between">
                    <Label>OPEN ROUTER</Label>
                    <Input name="openRouter" />
                  </div>
                  <div className="flex justify-between">
                    <Label>GOOGLE GEN AI</Label>
                    <Input name="googleGenAi" />
                  </div>
                  <div className="flex justify-between">
                    <Label>OLLAMA API BASE</Label>
                    <Input name="ollamaBase" />
                  </div>
                  <div className="flex justify-between">
                    <Label>OPENAI LIKE BASE</Label>
                    <Input name="openAiLikeBase" />
                  </div>
                  <div className="flex justify-between">
                    <Label>OPENAI LIKE</Label>
                    <Input name="openAiLike" />
                  </div>
                  <div className="flex justify-between">
                    <Label>MISTRAL</Label>
                    <Input name="mistral" />
                  </div>
                </div>
              </DialogDescription>
              <div className="px-5 pb-4 bg-bolt-elements-background-depth-2 flex gap-2 justify-end">
                <DialogButton buttonType="secondary" onClick={closeDialog}>
                  Cancel
                </DialogButton>
                <DialogButton type="submit" buttonType="primary">
                  Add
                </DialogButton>
              </div>
            </form>
          )}
        </Dialog>
      </DialogRoot>
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="text-md rounded-l-md min-w-40 h-9 px-1 py-4 border flex justify-center items-center font-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  );
}

function Input({
  placeholder,
  value,
  onChange,
  name,
}: {
  placeholder?: string;
  value?: string;
  onChange?: any;
  name?: string;
}) {
  return (
    <input
      defaultValue=""
      className="h-9 rounded-r-md border w-full bg-transparent p-4 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
