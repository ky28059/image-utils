import { readFile, writeFile } from 'node:fs/promises';
import heicDecode from 'heic-decode';
import sharp, { Sharp } from 'sharp';


export async function optimize(path: string, outPath?: string) {
    const [, file, ext] = path.match(/(.+?)(\.\w+)/)!;
    let img: Sharp;

    // Convert HEICs to JPGs before sharp
    if (path.endsWith('.HEIC')) {
        const buffer = await readFile(path)
        const { width, height, data } = await heicDecode({ buffer });

        img = sharp(new Uint8Array(data), {
            raw: { width, height, channels: 4, premultiplied: true }
        });
    } else {
        img = sharp(path);
    }

    await img
        //.jpeg({ mozjpeg: true, quality: 75 })
        .webp({ effort: 4, quality: 75 })
        .toFile(outPath ?? `${file}.webp`)
}
