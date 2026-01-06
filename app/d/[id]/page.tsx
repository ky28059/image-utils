import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Components
import PhotoGrid from '@/app/d/[id]/PhotoGrid';
import CopyLinkButton from '@/components/CopyLinkButton';

// Utils
import { thumbnails } from '@/thumbnails';
import { getHostedDirectory } from '@/lib/aws';
import { fileToS3Url, parseFolderName, variants } from '@/lib/util';

// Icons
import { MdDownloadForOffline } from 'react-icons/md';


type AlbumPageParams = {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ img?: string }>,
}

export async function generateMetadata({ params, searchParams }: AlbumPageParams): Promise<Metadata> {
    const dir = decodeURIComponent((await params).id);
    const image = (await searchParams).img;

    const { date, name } = parseFolderName(dir);

    const files = await getHostedDirectory(dir);
    if (!files.length) return notFound();

    // If a valid image is referenced by the `img` search param
    if (image && files.includes(image)) {
        return {
            title: `${image} • ${name}`,
            description: `${files.length} photos${date ? ` • ${date}` : ''}`,
            openGraph: {
                images: fileToS3Url(dir, image)
            }
        }
    }

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

export default async function PhotosPage({ params, searchParams }: AlbumPageParams) {
    const dir = decodeURIComponent((await params).id);
    const image = (await searchParams).img;

    const files = (await getHostedDirectory(dir))
        .sort((a, b) => variants(a).edited.localeCompare(variants(b).edited));

    if (!files.length) return null;

    const { date, name } = parseFolderName(dir);

    // If the `img` search param resolves to a real photo within this album, start with that
    // photo selected.
    const imgIndex = files.findIndex((s) => s === image);

    return (
        <main className="container pt-8 sm:pt-20 pb-1 sm:pb-24">
            <Link href="/" className="text-secondary text-sm mb-10 -ml-5 block w-max hover:underline">
                ← Back to home
            </Link>

            <h1 className="text-4xl font-bold mb-3">
                {name}
            </h1>
            <p className="text-secondary">
                {date && `${date} • `}
                {files.length} photos
            </p>

            <div className="flex mt-1 -ml-2 text-xl">
                <a
                    download
                    className="cursor-pointer text-primary hover:text-white p-2 rounded-full hover:bg-white/10 transition duration-100"
                    href={`/zip?dir=${encodeURIComponent(dir)}`}
                >
                    <MdDownloadForOffline />
                </a>
                <CopyLinkButton />
            </div>

            <PhotoGrid
                files={files}
                dir={dir}
                initialSelected={imgIndex !== -1 ? imgIndex : undefined}
            />
        </main>
    )
}
