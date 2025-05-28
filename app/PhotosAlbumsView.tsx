import PhotoAlbum from '@/app/PhotoAlbum';
import PhotoAlbumListItem from '@/app/PhotoAlbumListItem';

// Utils
import { thumbnails } from '@/thumbnails';
import { parseFolderName } from '@/lib/util';


type PhotosAlbumsViewProps = {
    dirs: { [key: string]: string[] },
}

export default function PhotosAlbumsView(props: PhotosAlbumsViewProps) {
    const months = Object.groupBy(
        Object.entries(props.dirs).filter(([dir,]) => parseFolderName(dir).date),
        ([dir,]) => dir.slice(0, 7) // Keep only `yyyy-mm`
    );

    return (
        <div className="flex flex-col gap-8">
            {Object.entries(months).sort(([a,], [b,]) => b.localeCompare(a)).map(([month, dirs]) => {
                if (!dirs) return null;

                const albums = dirs.filter(([d,]) => thumbnails[d]);
                const other = dirs.filter(([d,]) => !thumbnails[d]);

                return (
                    <div
                        className="relative flex flex-wrap gap-6"
                        key={month}
                    >
                        <p className="absolute -left-[4.5rem] text-secondary text-sm">{month}</p>

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
            })}
        </div>
    )
}
