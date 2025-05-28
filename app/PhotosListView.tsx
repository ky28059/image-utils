import PhotoListItem from '@/app/PhotoListItem';
import { thumbnails } from '@/thumbnails';


type PhotosListViewProps = {
    dirs: { [key: string]: string[] },
}

export default function PhotosListView(props: PhotosListViewProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {Object.entries(props.dirs).sort(([a,], [b,]) => dirCompare(a, b)).map(([d, photos]) => (
                <PhotoListItem
                    name={d}
                    size={photos.length}
                    thumbnail={thumbnails[d]}
                    key={d}
                />
            ))}
        </div>
    )
}

/**
 * Custom directory comparator, such that:
 * - All dated events (e.g. `2024-03-12 [...]`) are displayed before non-dated events.
 * - Dated events are sorted in descending order by date.
 * - Non-dated events are sorted in ascending order as usual.
 */
function dirCompare(a: string, b: string) {
    const aDate = /^\d/.test(a);
    const bDate = /^\d/.test(b);

    if (aDate && !bDate) return -1;
    if (bDate && !aDate) return 1;
    if (aDate && bDate) return b.localeCompare(a);
    return a.localeCompare(b);
}
