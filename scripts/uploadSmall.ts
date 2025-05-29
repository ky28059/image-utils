import { getAllPhotos } from '@/lib/files';
import { uploadOptimizedSmall } from '@/lib/aws';


;(async () => {
    const dirs = await getAllPhotos();

    for (const { name, files } of dirs) {
        console.log(`Processing ${name} : ${files.length} photos`);

        for (const file of files) {
            console.log(`↳ ${file}`);
            await uploadOptimizedSmall(name, file)
        }

        console.log();
    }
})()
