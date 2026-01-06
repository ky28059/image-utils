import type { ReactNode } from 'react';
import { Dialog } from 'radix-ui';


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
                <Dialog.Overlay className="fixed inset-0 bg-black/85 animate-dialog-overlay" />

                <Dialog.Content className={props.className + ' animate-dialog-content focus:outline-none'}>
                    {props.children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
