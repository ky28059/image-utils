'use client'

import { useMemo, useState } from 'react';

// Components
import PhotosAlbumsView from '@/app/PhotosAlbumsView';
import PhotosListView from '@/app/PhotosListView';
import DisplayTypeSelector from '@/app/DisplayTypeSelector';


type PhotosWrapperProps = {
    dirs: { [key: string]: string[] },
}

export default function PhotosWrapper(props: PhotosWrapperProps) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<'album' | 'list'>('album');

    const filtered = useMemo(() => {
        return Object.entries(props.dirs)
            .filter(([dir,]) => dir.toLowerCase().includes(query.toLowerCase()))
    }, [query]);

    return (
        <div>
            <div className="flex items-center mb-6">
                <input
                    className="flex-none w-48 px-3 py-1.5 text-sm rounded border border-tertiary mr-auto"
                    placeholder="Search albums"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {/* <hr className="border-t border-dashed border-tertiary w-full mx-2" /> */}
                <DisplayTypeSelector
                    type={type}
                    setType={setType}
                />
            </div>

            {type === 'album' ? (
                <PhotosAlbumsView dirs={filtered} />
            ) : (
                <PhotosListView dirs={filtered} />
            )}
        </div>
    )
}
