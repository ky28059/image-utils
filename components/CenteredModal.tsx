import type { ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { cn } from '@/lib/cn';


type CenteredModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    className: string,
    children: ReactNode
}

export default function CenteredModal(props: CenteredModalProps) { // TODO: naming?
    return (
        <Dialog.Root
            open={props.open}
            onOpenChange={props.setOpen}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/85 animate-dialog-overlay data-[state=closed]:animate-dialog-overlay-out" />

                <Dialog.Content className={cn('animate-dialog-content data-[state=closed]:animate-dialog-content-out focus:outline-none', props.className)}>
                    {props.children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
