import { PREVIEW_BUCKET } from '@/config';


export function filename(file: string) {
    return file.replace(/\.[^/.]+$/, '');
}

export function fileToS3Url(dir: string, file: string) {
    // AWS uses regular URI encoding with `+` instead of space
    const encoded = encodeURI(dir.replaceAll(' ', '+'));
    return `https://${PREVIEW_BUCKET}.s3.us-east-1.amazonaws.com/${encoded}/${filename(file)}-preview.webp`
}
