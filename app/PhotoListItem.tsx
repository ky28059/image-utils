import Link from 'next/link';
import { fileToS3Url } from '@/lib/util';


type PhotoListItemProps = {
    name: string,
    size: number,
    thumbnail?: string
}

export default function PhotoListItem(props: PhotoListItemProps) {
    return (
        <Link
            className="flex items-center border border-white/30 hover:border-white/75 transition duration-150 rounded text-left"
            href={`/${props.name}`}
        >
            {props.thumbnail ? (
                <img
                    src={fileToS3Url(props.name, props.thumbnail)}
                    className="h-[4.5rem] w-32 object-cover object-center rounded-l"
                    alt={props.name}
                />
            ) : (
                <div className="h-[4.5rem] w-32 bg-black/20" />
            )}
            <div className="pl-6 pr-2 px-4">
                <h3 className="font-medium">{props.name}</h3>
                <p className="text-sm text-secondary">
                    {props.size} photos
                </p>
            </div>
        </Link>
    )
}
