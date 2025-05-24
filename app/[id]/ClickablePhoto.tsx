import { filename } from '@/util/files';


type ClickablePhotoProps = {
    dir: string,
    file: string,
    openModal: () => void,
}
export default function ClickablePhoto(props: ClickablePhotoProps) {
    return (
        <img
            src={`http://localhost:8000/${props.dir}/${filename(props.file)}-preview.webp`}
            className="h-72 object-cover object-center cursor-pointer"
            loading="lazy"
            alt={props.file}
            onClick={() => props.openModal()}
        />
    )
}
