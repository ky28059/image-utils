import { mkdir, rm } from 'node:fs/promises';

import { optimize } from '../lib/optimize'
import { getAllPhotos, getExistingOptimizedPhotoNames } from '../lib/files';
import { BASE_PATH, OUT_PATH } from '../config';


;(async () => {
    const dirs = await getAllPhotos();

    for (const { name, files } of dirs) {
        console.log(`Processing ${name}`);

        const existing = await getExistingOptimizedPhotoNames(name);
        const remaining = files.filter((f) => !existing.has(f.split('.')[0]));

        console.log(remaining.length === 0 ? 'No changes found.' : `Optimizing ${remaining.length} photos:`);

        // Ensure that the output directory exists
        await mkdir(`${OUT_PATH}/${name}`, { recursive: true });

        // Optimize all files that don't already exist in `/out`
        for (const file of remaining) {
            console.log(`↳ ${file}`);
            await optimize(`${BASE_PATH}/${name}/${file}`, `${OUT_PATH}/${name}/${file.split('.')[0]}.webp`);
        }

        // Delete any previously optimized photos that no longer exist in source
        for (const file of files) {
            existing.delete(file.split('.')[0])
        }

        if (existing.size > 0) {
            console.log();
            console.log(`Deleting ${existing.size} outdated photos:`);

            for (const file of existing) {
                console.log(`↳ ${file}`);
                await rm(`${OUT_PATH}/${name}/${file}.webp`);
            }
        }

        console.log();
    }
})()
