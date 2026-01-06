import { DateTime, Interval } from 'luxon';
import { PHOTOS_BUCKET, PREVIEW_BUCKET } from '@/config';


export function filename(file: string) {
    return file.replace(/\.[^/.]+$/, '');
}

export function fileToS3Url(dir: string, file: string) {
    // AWS uses regular URI encoding with `+` instead of space
    const encoded = encodeURI(dir.replaceAll(' ', '+'));
    return `https://${PREVIEW_BUCKET}.s3.us-east-1.amazonaws.com/${encoded}/${filename(file)}-preview.webp`
}

export function fileToS3SmallUrl(dir: string, file: string) {
    // AWS uses regular URI encoding with `+` instead of space
    const encoded = encodeURI(dir.replaceAll(' ', '+'));
    return `https://${PREVIEW_BUCKET}.s3.us-east-1.amazonaws.com/${encoded}/${filename(file)}-preview-small.webp`
}

export function fileToS3OriginalUrl(dir: string, file: string) {
    // AWS uses regular URI encoding with `+` instead of space
    const encoded = encodeURI(dir.replaceAll(' ', '+'));
    return `https://${PHOTOS_BUCKET}.s3.us-east-1.amazonaws.com/${encoded}/${file}`
}

// TODO: abstraction?
export function variants(file: string) {
    // IMG_1234 -> IMG_E1234
    // P1070837 -> P107E0837
    const [, before, edited, after] = file.match(/(.+?)(E?)(\d{0,4}\..+)/)!;

    return {
        unedited: `${before}${after}`,
        edited: `${before}E${after}`
    }
}

export function parseFolderName(dir: string) {
    const matches = dir.match(/(\d{4})-(\d{2})-(\d{2})(?:@([^ ]+))? (.+)/);
    if (!matches) return { name: dir, date: null }

    const [, year, month, day, toRaw, name] = matches;
    const from = DateTime.local(Number(year), Number(month), Number(day));

    if (!toRaw) return { name, date: from }

    const parts = toRaw.split('-');
    const to = DateTime.local(
        Number(parts.at(-3) ?? year),
        Number(parts.at(-2) ?? month),
        Number(parts.at(-1))
    );

    return { name, date: Interval.fromDateTimes(from, to) }
}
