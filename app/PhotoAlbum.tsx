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
            className="flex flex-col relative min-h-48 w-80 border border-white/30 hover:border-white/75 transition duration-150 rounded overflow-clip text-left"
            href={`/d/${props.name}`}
        >
            <img
                src={fileToS3Url(props.name, props.thumbnail)}
                className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
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
