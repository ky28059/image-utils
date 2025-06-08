import { getAllPhotos } from '@/lib/files';
import { deleteUploadedFiles, getAllHostedPhotos, uploadOptimized, uploadOptimizedSmall, uploadRaw } from '@/lib/aws';


;(async () => {
    const dirs = await getAllPhotos();
    const hosted = await getAllHostedPhotos();

    const force = process.argv[2] === '--force'; // TODO: use argparse?

    for (const { name, files } of dirs) {
        console.log(`Processing ${name}`);

        const existing = hosted[name]
            ? new Set(hosted[name])
            : new Set<string>();
        const remaining = force
            ? files
            : files.filter((f) => !existing.has(f));

        console.log(remaining.length === 0 ? 'No changes found.' : `Optimizing ${remaining.length} photos:`);

        // Optimize and upload all files that don't already exist on S3
        for (const file of remaining) {
            console.log(`↳ ${file}`);
            await Promise.all([
                uploadRaw(name, file),
                uploadOptimized(name, file),
                uploadOptimizedSmall(name, file)
            ])
        }

        // Delete any previously optimized photos that no longer exist in source
        for (const file of files) {
            existing.delete(file)
        }

        if (existing.size > 0) {
            console.log();
            console.log(`Deleting ${existing.size} outdated photos.`);

            await deleteUploadedFiles(name, [...existing]);
        }

        console.log();
    }
})()
