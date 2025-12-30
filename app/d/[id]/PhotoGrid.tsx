'use client'

import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

// Components
import ClickablePhoto from '@/app/d/[id]/ClickablePhoto';
import CenteredModal from '@/components/CenteredModal';

// Utils
import { fileToS3OriginalUrl, fileToS3Url } from '@/lib/util';

// Icons
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { GoShareAndroid } from 'react-icons/go';
import { MdDownloadForOffline } from 'react-icons/md';


type PhotoGridProps = {
    files: string[],
    dir: string,
    initialSelected?: number,
}
export default function PhotoGrid(props: PhotoGridProps) {
    const [open, setOpen] = useState(props.initialSelected !== undefined);
    const [selected, setSelected] = useState(props.initialSelected ?? 0);

    function updateSelected(id: number) {
        setSelected(id);
        window.history.replaceState(
            null,
            '',
            `${window.location.origin}${window.location.pathname}?img=${props.files[id]}`
        );
    }

    function openModalToFile(id: number) {
        updateSelected(id);
        setOpen(true);
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
        updateSelected(Math.max(selected - 1, 0));
    }

    function incSelected() {
        updateSelected(Math.min(selected + 1, props.files.length - 1));
    }

    // Decrement and increment image hotkeys
    useHotkeys('left', decSelected, [selected]);
    useHotkeys('right', incSelected, [selected]);

    return (
        <div className="group grid grid-cols-4 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-0.5 sm:gap-1.5 mt-8 -mx-7.5 sm:mx-0">
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
                    className="flex items-center cursor-pointer fixed left-0 pl-6 inset-y-0 w-[30vw] text-transparent hover:text-white transition duration-200 focus:outline-none"
                    onClick={decSelected}
                >
                    <FaChevronLeft />
                </button>

                <button
                    className="flex items-center justify-end cursor-pointer fixed right-0 pr-6 inset-y-0 w-[30vw] text-transparent hover:text-white transition duration-200 focus:outline-none"
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

                <div className="absolute top-0 left-full pl-2 flex flex-col text-xl">
                    <button
                        className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                    >
                        <GoShareAndroid />
                    </button>
                    <a
                        download
                        className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
                        href={fileToS3OriginalUrl(props.dir, props.files[selected])}
                    >
                        <MdDownloadForOffline />
                    </a>
                </div>
            </CenteredModal>
        </div>
    )
}
