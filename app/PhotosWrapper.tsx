'use client'

import { useMemo, useState } from 'react';
import PhotosAlbumsView from '@/app/PhotosAlbumsView';


type PhotosWrapperProps = {
    dirs: { [key: string]: string[] },
}

export default function PhotosWrapper(props: PhotosWrapperProps) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        return Object.entries(props.dirs)
            .filter(([dir,]) => dir.toLowerCase().includes(query.toLowerCase()))
    }, [query]);

    return (
        <div>
            <div className="mb-6">
                <input
                    className="w-48 px-3 py-1.5 text-sm rounded border border-tertiary"
                    placeholder="Search albums"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <PhotosAlbumsView dirs={filtered} />
        </div>
    )
}
