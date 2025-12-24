'use client'

import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// Components
import ClickablePhoto from '@/app/d/[id]/ClickablePhoto';
import CenteredModal from '@/components/CenteredModal';

// Utils
import { fileToS3Url } from '@/lib/util';

// Icons
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';


type PhotoGridProps = {
    files: string[],
    dir: string,
    initialSelected?: number,
}
export default function PhotoGrid(props: PhotoGridProps) {
    const [open, setOpen] = useState(props.initialSelected !== undefined);
    const [selected, setSelected] = useState(props.initialSelected ?? 0);

    function updateURLQuery(id: number) {
        window.history.replaceState(
            null,
            '',
            `${window.location.origin}${window.location.pathname}?img=${props.files[id]}`
        );
    }

    function openModalToFile(id: number) {
        setSelected(id);
        setOpen(true);
        updateURLQuery(id);
    }

    function closeModal() {
        setOpen(false);
        window.history.replaceState(
            null,
            '',
            `${window.location.origin}${window.location.pathname}`
        );
    }

    function decSelected() {
        const d = Math.max(selected - 1, 0);
        setSelected(d);
        updateURLQuery(d);
    }

    function incSelected() {
        const i = Math.min(selected + 1, props.files.length - 1);
        setSelected(i);
        updateURLQuery(i);
    }

    // Decrement and increment image hotkeys
    useHotkeys('left', decSelected, [selected]);
    useHotkeys('right', incSelected, [selected]);

    return (
        <div className="grid grid-cols-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-0.5 sm:gap-1.5 mt-8 -mx-7.5 sm:mx-0">
            {props.files.map((f, i) => (
                <ClickablePhoto
                    dir={props.dir}
                    file={f}
                    key={f}
                    openModal={openModalToFile.bind(null, i)}
                />
            ))}

            <CenteredModal
                className="relative flex flex-col max-w-[80%]"
                open={open}
                onClose={closeModal}
            >
                <button
                    className="cursor-pointer fixed left-4 top-4 z-10 p-2 rounded-full hover:bg-white/10 transition duration-100"
                    onClick={closeModal}
                >
                    <FaArrowLeft />
                </button>

                <button
                    className="flex items-center cursor-pointer fixed left-0 pl-6 inset-y-0 w-[30vw] text-secondary hover:text-white transition duration-200 focus:outline-none"
                    onClick={decSelected}
                >
                    <FaChevronLeft />
                </button>

                <button
                    className="flex items-center justify-end cursor-pointer fixed right-0 pr-6 inset-y-0 w-[30vw] text-secondary hover:text-white transition duration-200 focus:outline-none"
                    onClick={incSelected}
                >
                    <FaChevronRight />
                </button>

                <img
                    src={fileToS3Url(props.dir, props.files[selected])}
                    className="max-h-[90vh]"
                    alt={props.files[selected]}
                />
                <p className="text-sm mt-1.5">{props.files[selected]}</p>
            </CenteredModal>
        </div>
    )
}
