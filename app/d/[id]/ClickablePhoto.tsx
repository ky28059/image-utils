import { fileToS3SmallUrl } from '@/lib/util';


type ClickablePhotoProps = {
    dir: string,
    file: string,
    openModal: () => void,
}
export default function ClickablePhoto(props: ClickablePhotoProps) {
    return (
        <img
            src={fileToS3SmallUrl(props.dir, props.file)}
            className="w-full aspect-3/4 object-cover object-center cursor-pointer"
            loading="lazy"
            alt={props.file}
            onClick={() => props.openModal()}
        />
    )
}
