import { readdir } from 'node:fs/promises';
import { BASE_DIR } from '../config';


function getResolvedFileName(file: string, dir: string[]) {
    // IMG_1234 -> IMG_E1234
    // p1070837 -> P107E0837
    const [, before, after] = file.match(/(.+?)(\d{0,4}\..+)/)!;
    const editedFilename = dir.find(f => f.toUpperCase() === `${before}E${after}`.toUpperCase());

    return editedFilename ?? file;
}

async function getPhotosForDir(dir: string) {
    const files = (await readdir(dir, { withFileTypes: true }))
        .filter((f) => !f.isDirectory())
        .map((f) => f.name);

    return [...new Set(files.map((f) => getResolvedFileName(f, files)))];
}

export async function getAllPhotos() {
    const dirs = (await readdir(BASE_DIR, { withFileTypes: true }))
        .filter((f) => f.isDirectory() && !f.name.startsWith('['))
        .map((f) => f.name);

    return Promise.all(dirs.map(async (d) => ({
        name: d,
        files: await getPhotosForDir(`${BASE_DIR}/${d}`)
    })))
}
