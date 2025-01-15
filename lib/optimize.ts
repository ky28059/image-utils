import { spawn } from 'node:child_process';
import sharp, { Sharp } from 'sharp';


export async function optimize(path: string, outPath?: string) {
    const [, file, ext] = path.match(/(.+?)(\.\w+)/)!;
    let img: Sharp;

    // Convert HEICs to JPGs before sharp. Uses `ImageMagick` instead of native `heic-decode` due to
    // reasons outlined in readme.
    if (path.endsWith('.HEIC')) {
        const buffer = await streamJPGFromImgMagick(path);
        img = sharp(buffer);
    } else {
        img = sharp(path);
    }

    await img
        //.jpeg({ mozjpeg: true, quality: 75 })
        .rotate() // https://stackoverflow.com/questions/48716266/sharp-image-library-rotates-image-when-resizing
        .webp({ effort: 4, quality: 75 })
        .toFile(outPath ?? `${file}.webp`)
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
