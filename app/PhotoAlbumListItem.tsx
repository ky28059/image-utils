import Link from 'next/link';


type PhotoListItemProps = {
    name: string,
    size: number,
}

export default function PhotoAlbumListItem(props: PhotoListItemProps) {
    return (
        <Link
            className="px-5 py-3 min-w-80 border border-white/30 hover:border-white/75 transition duration-150 rounded text-left"
            href={`/${props.name}`}
        >
            <h3 className="font-medium text-sm">{props.name}</h3>
            <p className="text-sm text-secondary">
                {props.size} photos
            </p>
        </Link>
    )
}
