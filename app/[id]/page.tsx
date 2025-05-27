import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import PhotoGrid from '@/app/[id]/PhotoGrid';

// Utils
import { thumbnails } from '@/thumbnails';
import { getAllHostedPhotos } from '@/lib/aws';
import { fileToS3Url } from '@/lib/util';


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
            images: fileToS3Url(dir, thumbnails[dir])
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

function parseFolderName(dir: string) {
    const matches = dir.match(/(\d{4}-\d{2}-\d{2}(?:@.+)?) (.+)/);
    if (!matches) return {
        name: dir,
        date: null
    }

    return {
        name: matches[2],
        date: matches[1]
    }
}
