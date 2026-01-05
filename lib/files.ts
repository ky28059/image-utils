import { readdir } from 'node:fs/promises';
import { extname } from 'node:path';
import { BASE_PATH } from '@/config';


// TODO: handle videos (.mov and .mp4)?
const ALLOWED_EXT = new Set(['.heic', '.jpg', 'jpeg', '.png'])

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

/**
 * Gets a list of all resolved photo names for the given directory, e.g. skipping non-allowed file extensions and
 * resolving edited photos.
 *
 * @param dir The directory to parse.
 * @returns An array of resolved photo names.
 */
async function getPhotosForDir(dir: string) {
    const files = (await readdir(dir, { withFileTypes: true }))
        .filter((f) => !f.isDirectory() && ALLOWED_EXT.has(extname(f.name).toLowerCase()))
        .map((f) => f.name);

    return [...new Set(files.map((f) => getResolvedFileName(f, files)))];
}

/**
 * Gets all photos in the base directory, ignoring excluded folders.
 * @returns An array of { name, photos } for each subdirectory of the base directory.
 */
export async function getAllPhotos() {
    const dirs = (await readdir(BASE_PATH, { withFileTypes: true }))
        .filter((f) => f.isDirectory() && !f.name.startsWith('['))
        .map((f) => f.name);

    return Promise.all(dirs.map(async (d) => ({
        name: d,
        files: await getPhotosForDir(`${BASE_PATH}/${d}`)
    })))
}
