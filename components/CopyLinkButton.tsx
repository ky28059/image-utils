'use client'

import { GoShareAndroid } from 'react-icons/go';


export default function CopyLinkButton() {
    return (
        <button
            className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
            <GoShareAndroid />
        </button>
    )
}
