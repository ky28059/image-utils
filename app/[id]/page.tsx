import type { Metadata } from 'next';
import Link from 'next/link';

// Components
import PhotoGrid from '@/app/[id]/PhotoGrid';


export const metadata: Metadata = {
    title: 'Photos',
    description: '...'
}

export default async function PhotosPage({ params }: { params: Promise<{ id: string }> }) {
    const dir = (await params).id;
    const files: string[] = await (await fetch(`http://localhost:8000/info/${dir}`)).json();

    // Parse folder name structure
    const [, date, name] = decodeURIComponent(dir).match(/(.+?) (.+)/)!;

    return (
        <main className="container pt-20 pb-24">
            <Link href="/" className="text-secondary text-sm mb-10 -ml-5 block w-max hover:underline">
                ← Back to home
            </Link>

            <h1 className="text-4xl font-bold mb-3">
                {name}
            </h1>
            <p className="text-secondary">
                {date}
            </p>
            <p className="text-secondary">
                {files.length} photos
            </p>

            <PhotoGrid files={files} dir={dir} />
        </main>
    )
}
