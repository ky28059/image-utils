import { uploadOptimized, uploadOptimizedSmall, uploadRaw } from '@/lib/aws';


;(async () => {
    const dir = process.argv[2];
    const file = process.argv[3];

    await Promise.all([
        uploadRaw(dir, file),
        uploadOptimized(dir, file),
        uploadOptimizedSmall(dir, file)
    ])
    console.log(`Uploaded ${dir}/${file}`)
})()
