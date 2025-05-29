import { optimizeToFile } from '@/lib/optimize'


;(async () => {
    const file = process.argv[2];
    await optimizeToFile(file);
})()
