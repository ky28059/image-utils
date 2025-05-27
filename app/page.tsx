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
                {Object.entries(dirs).map(([d, photos]) => (
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
