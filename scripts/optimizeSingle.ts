import { optimize } from '@/lib/optimize'


;(async () => {
    const file = process.argv[2];
    await optimize(file);
})()
