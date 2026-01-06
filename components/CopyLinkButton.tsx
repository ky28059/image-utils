'use client'

import type { ComponentProps } from 'react';
import { GoShareAndroid } from 'react-icons/go';


export default function CopyLinkButton(props: ComponentProps<'button'>) {
    return (
        <button
            {...props}
            className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
            <GoShareAndroid />
        </button>
    )
}
