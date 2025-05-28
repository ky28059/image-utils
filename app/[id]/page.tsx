import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import PhotoGrid from '@/app/[id]/PhotoGrid';

// Utils
import { thumbnails } from '@/thumbnails';
import { getAllHostedPhotos } from '@/lib/aws';
import { fileToS3Url, parseFolderName } from '@/lib/util';


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const dir = decodeURIComponent((await params).id);

    // TODO:
    const dirs = await getAllHostedPhotos();
    const files = dirs[dir];

    const { date, name } = parseFolderName(dir);

    return {
        title: name,
        description: `${files.length} photos${date ? ` • ${date}` : ''}`,
        openGraph: {
            images: thumbnails[dir]
                ? fileToS3Url(dir, thumbnails[dir])
                : undefined
        }
    }
}

export default async function PhotosPage({ params }: { params: Promise<{ id: string }> }) {
    const dir = decodeURIComponent((await params).id);

    // TODO:
    const dirs = await getAllHostedPhotos();
    const files = dirs[dir];

    const { date, name } = parseFolderName(dir);

    return (
        <main className="container pt-20 pb-24">
            <Link href="/" className="text-secondary text-sm mb-10 -ml-5 block w-max hover:underline">
                ← Back to home
            </Link>

            <h1 className="text-4xl font-bold mb-3">
                {name}
            </h1>
            {date && (
                <p className="text-secondary">
                    {date}
                </p>
            )}
            <p className="text-secondary">
                {files.length} photos
            </p>

            <PhotoGrid files={files} dir={dir} />
        </main>
    )
}
