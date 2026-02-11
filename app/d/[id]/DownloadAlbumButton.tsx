'use client'

import { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';

// Components
import AnimatedTooltip from '@/components/AnimatedTooltip';

// Utils
import { AUTH_COOKIE_NAME } from '@/config';


export default function DownloadAlbumButton(props: { dir: string }) {
    const [disabled, setDisabled] = useState(true);

    // Enable the download album button for authenticated users
    useEffect(() => {
        const authed = RegExp(`${AUTH_COOKIE_NAME}=(.+?)(?:;|$)`).test(document.cookie);
        if (authed) setDisabled(false);
    }, []);

    return (
        <AnimatedTooltip tooltip="Download album as ZIP">
            <a
                style={{
                    pointerEvents: disabled ? 'none' : undefined,
                    opacity: disabled ? 0.4 : undefined,
                }}
                download
                className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
                href={`/zip?dir=${encodeURIComponent(props.dir)}`}
            >
                <MdDownloadForOffline />
            </a>
        </AnimatedTooltip>
    )
}
