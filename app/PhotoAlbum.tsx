import Link from 'next/link';
import { fileToS3Url } from '@/lib/util';


type PhotoAlbumProps = {
    name: string,
    size: number,
    thumbnail: string
}

export default function PhotoAlbum(props: PhotoAlbumProps) {
    return (
        <Link
            className="flex flex-col relative w-80 border border-white/30 hover:border-white/75 transition duration-150 rounded overflow-clip text-left"
            href={`/${props.name}`}
        >
            <img
                src={fileToS3Url(props.name, props.thumbnail)}
                className="h-48 w-full object-cover object-center"
                alt={props.name}
            />
            <div className="absolute bottom-0 inset-x-0 bg-black/65 px-4 py-2">
                <h3 className="font-medium text-sm">{props.name}</h3>
                <p className="text-sm text-secondary">
                    {props.size} photos
                </p>
            </div>
        </Link>
    )
}
