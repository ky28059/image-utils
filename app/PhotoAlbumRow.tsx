import PhotoAlbum from '@/app/PhotoAlbum';
import PhotoAlbumListItem from '@/app/PhotoAlbumListItem';
import { thumbnails } from '@/thumbnails';


type PhotoAlbumRowProps = {
    dirs: [string, string[]][],
    label: string,
}

export default function PhotoAlbumRow(props: PhotoAlbumRowProps) {
    const albums = props.dirs.filter(([d,]) => thumbnails[d]);
    const other = props.dirs.filter(([d,]) => !thumbnails[d]);

    return (
        <div className="relative flex flex-wrap gap-6">
            <p className="absolute -left-[4.5rem] text-secondary text-sm">
                {props.label}
            </p>

            {albums.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {albums.map(([d, photos]) => (
                        <PhotoAlbum
                            name={d}
                            size={photos.length}
                            thumbnail={thumbnails[d]}
                            key={d}
                        />
                    ))}
                </div>
            )}

            {other.length > 0 && (
                <div className="flex flex-col gap-2">
                    {other.map(([d, photos]) => (
                        <PhotoAlbumListItem
                            name={d}
                            size={photos.length}
                            key={d}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
