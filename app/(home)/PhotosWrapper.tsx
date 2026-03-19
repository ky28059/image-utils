'use client'

import { useMemo, useState } from 'react';

// Components
import PhotosAlbumsView from '@/app/(home)/PhotosAlbumsView';
import PhotosListView from '@/app/(home)/PhotosListView';
import DisplayTypeSelector from '@/app/(home)/DisplayTypeSelector';


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
            <div className="flex items-center mb-2">
                <input
                    className="flex-none w-72 px-3 py-1.5 text-sm rounded border border-tertiary mr-auto"
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
            <p className="text-secondary text-sm mb-6">
                {filtered.length !== Object.keys(props.dirs).length && (
                    <>
                        {filtered.length} albums,{' '}
                        {filtered.reduce((s, [,e]) => s + e.length, 0)} photos shown •{' '}
                    </>
                )}
                {Object.keys(props.dirs).length} albums,{' '}
                {Object.values(props.dirs).reduce((s, e) => s + e.length, 0)} photos total
            </p>

            {type === 'album' ? (
                <PhotosAlbumsView dirs={filtered} />
            ) : (
                <PhotosListView dirs={filtered} />
            )}
        </div>
    )
}
