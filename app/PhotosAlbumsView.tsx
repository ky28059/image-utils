import PhotoAlbumRow from '@/app/PhotoAlbumRow';

// Utils
import { parseFolderName } from '@/lib/util';


type PhotosAlbumsViewProps = {
    dirs: { [key: string]: string[] },
}

export default function PhotosAlbumsView(props: PhotosAlbumsViewProps) {
    const months = Object.groupBy(
        Object.entries(props.dirs).filter(([dir,]) => parseFolderName(dir).date),
        ([dir,]) => dir.slice(0, 7) // Keep only `yyyy-mm`
    );

    const remaining = Object.entries(props.dirs).filter(([dir,]) => !parseFolderName(dir).date);

    return (
        <div className="flex flex-col gap-8">
            {Object.entries(months).sort(([a,], [b,]) => b.localeCompare(a)).map(([month, dirs]) => {
                if (!dirs) return null;

                return (
                    <PhotoAlbumRow
                        dirs={dirs}
                        label={month}
                        key={month}
                    />
                )
            })}

            <PhotoAlbumRow
                dirs={remaining}
                label="Misc"
            />
        </div>
    )
}
