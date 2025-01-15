import { mkdir, rm } from 'node:fs/promises';

// Utils
import { optimize } from '../lib/optimize'
import { getAllPhotos, getExistingOptimizedPhotoNames, filename } from '../lib/files';

// Config
import { BASE_PATH, OUT_PATH } from '../config';


;(async () => {
    const dirs = await getAllPhotos();
    const force = process.argv[2] === '--force'; // TODO: use argparse?

    for (const { name, files } of dirs) {
        console.log(`Processing ${name}`);

        const existing = await getExistingOptimizedPhotoNames(name);
        const remaining = force
            ? files
            : files.filter((f) => !existing.has(filename(f)));

        console.log(remaining.length === 0 ? 'No changes found.' : `Optimizing ${remaining.length} photos:`);

        // Ensure that the output directory exists
        await mkdir(`${OUT_PATH}/${name}`, { recursive: true });

        // Optimize all files that don't already exist in `/out`
        for (const file of remaining) {
            console.log(`↳ ${file}`);
            await optimize(`${BASE_PATH}/${name}/${file}`, `${OUT_PATH}/${name}/${filename(file)}-preview.webp`);
        }

        // Delete any previously optimized photos that no longer exist in source
        for (const file of files) {
            existing.delete(filename(file))
        }

        if (existing.size > 0) {
            console.log();
            console.log(`Deleting ${existing.size} outdated photos:`);

            for (const file of existing) {
                console.log(`↳ ${file}`);
                await rm(`${OUT_PATH}/${name}/${file}-preview.webp`);
            }
        }

        console.log();
    }
})()
