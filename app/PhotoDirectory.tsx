'use client'

import Link from 'next/link';
import type { PhotoDirectoryInfo } from './page';


export default function PhotoDirectory(props: PhotoDirectoryInfo) {
    return (
        <Link
            className="flex items-center border border-tertiary rounded text-left"
            href={`/${props.name}`}
        >
            <img
                src={`http://localhost:8000/${props.name}/${'hhh'}-preview.webp`}
                className="h-16 w-28 object-cover object-center rounded-l"
                alt={props.name}
            />
            <div className="py-2 px-4">
                <h3 className="font-semibold">{props.name}</h3>
                <p className="text-sm text-secondary">
                    {props.size} photos
                </p>
            </div>
        </Link>
    )
}
