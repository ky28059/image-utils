import type { Metadata } from 'next';

// Components
import PhotoDirectory from '@/app/PhotoDirectory';

// Utils
import { getAllHostedPhotos } from '@/lib/aws';
import { thumbnails } from '@/thumbnails';


export const metadata: Metadata = {
    title: 'Photos',
    description: '...'
}

export default async function Photos() {
    const dirs = await getAllHostedPhotos();

    return (
        <div className="container pt-20 pb-24">
            <h1 className="text-5xl font-bold mb-4">
                Photos
            </h1>

            <div className="flex flex-col gap-1.5">
                {Object.entries(dirs).sort(([a,], [b,]) => dirCompare(a, b)).map(([d, photos]) => (
                    <PhotoDirectory
                        name={d}
                        size={photos.length}
                        thumbnail={thumbnails[d]}
                        key={d}
                    />
                ))}
            </div>
        </div>
    )
}

/**
 * Custom directory comparator, such that:
 * - All dated events (e.g. `2024-03-12 [...]`) are displayed before non-dated events.
 * - Dated events are sorted in descending order by date.
 * - Non-dated events are sorted in ascending order as usual.
 */
function dirCompare(a: string, b: string) {
    const aDate = /^\d/.test(a);
    const bDate = /^\d/.test(b);

    if (aDate && !bDate) return -1;
    if (bDate && !aDate) return 1;
    if (aDate && bDate) return b.localeCompare(a);
    return a.localeCompare(b);
}
