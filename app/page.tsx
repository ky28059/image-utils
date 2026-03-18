import type { Metadata } from 'next';
import PhotosWrapper from '@/app/PhotosWrapper';
import { getAllHostedPhotos } from '@/lib/aws';


export const metadata: Metadata = {
    title: 'Photos',
    description: '...'
}

export default async function Photos() {
    const dirs = await getAllHostedPhotos();

    return (
        <div className="container pt-20 pb-24">
            <h1 className="text-5xl font-bold mb-2">
                Photos
            </h1>
            <p className="text-secondary text-sm mb-3">
                {Object.keys(dirs).length} albums,{' '}
                {Object.values(dirs).reduce((s, e) => s + e.length, 0)} photos
            </p>

            <PhotosWrapper dirs={dirs} />
        </div>
    )
}
