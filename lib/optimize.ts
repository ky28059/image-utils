import { spawn } from 'node:child_process';
import sharp, { Sharp } from 'sharp';
import { filename } from '@/lib/util';


async function optimize(path: string) {
    let img: Sharp;

    // Convert HEICs to JPGs before sharp. Uses `ImageMagick` instead of native `heic-decode` due to
    // reasons outlined in readme.
    if (path.endsWith('.HEIC')) {
        const buffer = await streamJPGFromImgMagick(path);
        img = sharp(buffer);
    } else {
        img = sharp(path);
    }

    return img
        //.jpeg({ mozjpeg: true, quality: 75 })
        .rotate() // https://stackoverflow.com/questions/48716266/sharp-image-library-rotates-image-when-resizing
        .webp({ effort: 4, quality: 75 })
}

/**
 * Optimizes the image at the given path, returning a buffer of new image data.
 * @param path The image to optimize.
 * @returns The optimized image data.
 */
export async function optimizeToBuffer(path: string) {
    const sharp = await optimize(path);
    return sharp.toBuffer();
}

/**
 * Optimizes and reduces the size of the image at the given path, returning a buffer of new image data.
 * @param path The image to optimize.
 * @returns The optimized (and compressed) image data.
 */
export async function optimizeSmallToBuffer(path: string) {
    const sharp = await optimize(path);
    return sharp
        .resize({ width: 215 * 2, height: 288 * 2, fit: 'cover' })
        .toBuffer();
}

export async function optimizeToFile(path: string, outPath?: string) {
    const sharp = await optimize(path);
    return sharp.toFile(outPath ?? `${filename(path)}.webp`);
}

function streamJPGFromImgMagick(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const proc = spawn('magick', [path, 'JPG:-']);
        let ret = Buffer.from([]);

        proc.stdout.on('data', (chunk) => {
            ret = Buffer.concat([ret, chunk]);
        });
        proc.on('close', () => {
            resolve(ret);
        })
    })
}
