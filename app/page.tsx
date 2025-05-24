import type { Metadata } from 'next';
import PhotoDirectory from '@/app/PhotoDirectory';
import { getAllHostedPhotos } from '@/lib/aws';


export type PhotoDirectoryInfo = {
    name: string,
    size: number,
}

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
                    <PhotoDirectory name={d} size={photos.length} key={d} />
                ))}
            </div>
        </div>
    )
}
