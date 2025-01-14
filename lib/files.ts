import { readdir } from 'node:fs/promises';
import { BASE_PATH, OUT_PATH } from '../config';


/**
 * Gets the resolved file name for a given image file. Specifically, if an edited version of an image
 * exists (e.g. the given file is `IMG_1234` and `IMG_E1234` exists in the directory) return the edited version
 * instead. Otherwise, return the given file.
 *
 * @param file The file to parse (e.g. "IMG_1234.HEIC").
 * @param dir The list of files in the parsed directory.
 * @returns The resolved file name.
 */
function getResolvedFileName(file: string, dir: string[]) {
    // IMG_1234 -> IMG_E1234
    // p1070837 -> P107E0837
    const [, before, after] = file.match(/(.+?)(\d{0,4}\..+)/)!;
    const editedFilename = dir.find(f => f.toUpperCase() === `${before}E${after}`.toUpperCase());

    return editedFilename ?? file;
}

async function getPhotosForDir(dir: string) {
    const files = (await readdir(dir, { withFileTypes: true }))
        .filter((f) => !f.isDirectory() && !f.name.toLowerCase().endsWith('.aae') && !f.name.toLowerCase().endsWith('.mov'))
        .map((f) => f.name);

    return [...new Set(files.map((f) => getResolvedFileName(f, files)))];
}

export async function getAllPhotos() {
    const dirs = (await readdir(BASE_PATH, { withFileTypes: true }))
        .filter((f) => f.isDirectory() && !f.name.startsWith('['))
        .map((f) => f.name);

    return Promise.all(dirs.map(async (d) => ({
        name: d,
        files: await getPhotosForDir(`${BASE_PATH}/${d}`)
    })))
}

export function filename(file: string) {
    return file.replace(/\.[^/.]+$/, '');
}

export async function getExistingOptimizedPhotoNames(name: string) {
    try {
        const files = await readdir(`${OUT_PATH}/${name}`);
        return new Set(files.map(s => filename(s).slice(0, -8))); // Trim `-preview` suffix
    } catch {
        return new Set<string>();
    }
}
