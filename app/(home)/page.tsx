import type { Metadata } from 'next';
import PhotosWrapper from '@/app/(home)/PhotosWrapper';
import { getAllHostedPhotos } from '@/lib/aws';


export const metadata: Metadata = {
    title: 'Photos',
    description: '...'
}

export default async function Photos() {
    const dirs = await getAllHostedPhotos();

    return (
        <div className="container pt-20 pb-24">
            <h1 className="text-5xl font-bold mb-3">
                Photos
            </h1>
            <PhotosWrapper dirs={dirs} />
        </div>
    )
}
