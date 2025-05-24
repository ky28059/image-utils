import type { Metadata } from 'next';
import PhotoDirectory from '@/app/PhotoDirectory';


export type PhotoDirectoryInfo = {
    name: string,
    size: number,
}

export const metadata: Metadata = {
    title: 'Photos',
    description: '...'
}

export default async function Photos() {
    const dirs: PhotoDirectoryInfo[] = await (await fetch('http://localhost:8000/info', { cache: 'no-store' })).json();

    return (
        <div className="container pt-20 pb-24">
            <h1 className="text-5xl font-bold mb-4">
                Photos
            </h1>

            <div className="flex flex-col gap-1.5">
                {dirs.map((d) => (
                    <PhotoDirectory {...d} key={d.name} />
                ))}
            </div>
        </div>
    )
}
