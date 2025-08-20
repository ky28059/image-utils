'use client'

import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// Components
import ClickablePhoto from '@/app/[id]/ClickablePhoto';
import CenteredModal from '@/components/CenteredModal';

// Utils
import { fileToS3Url } from '@/lib/util';


type PhotoGridProps = {
    files: string[],
    dir: string,
    initialSelected?: number,
}
export default function PhotoGrid(props: PhotoGridProps) {
    const [open, setOpen] = useState(props.initialSelected !== undefined);
    const [selected, setSelected] = useState(props.initialSelected ?? 0);

    function openModalToFile(id: number) {
        setSelected(id);
        setOpen(true);
    }

    function decSelected() {
        setSelected((s) => Math.max(s - 1, 0))
    }

    function incSelected() {
        setSelected((s) => Math.min(s + 1, props.files.length - 1))
    }

    // Decrement and increment image hotkeys
    useHotkeys('left', decSelected, []);
    useHotkeys('right', incSelected, []);

    return (
        <div className="grid grid-cols-4 sm:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-0.5 sm:gap-1.5 mt-8 -mx-[1.875rem] sm:mx-0">
            {props.files.map((f, i) => (
                <ClickablePhoto
                    dir={props.dir}
                    file={f}
                    key={f}
                    openModal={openModalToFile.bind(null, i)}
                />
            ))}

            <CenteredModal
                className="relative flex flex-col max-w-[70%]"
                isOpen={open}
                setIsOpen={setOpen}
            >
                <button
                    className="fixed left-4 inset-y-0 text-secondary hover:text-white transition duration-200"
                    onClick={decSelected}
                >
                    {'<'}
                </button>

                <button
                    className="fixed right-4 inset-y-0 text-secondary hover:text-white transition duration-200"
                    onClick={incSelected}
                >
                    {'>'}
                </button>

                <img
                    src={fileToS3Url(props.dir, props.files[selected])}
                    className="max-h-[80vh]"
                    alt={props.files[selected]}
                />
                <p className="text-sm mt-1.5">{props.files[selected]}</p>
            </CenteredModal>
        </div>
    )
}
