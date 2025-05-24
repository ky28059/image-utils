import { getAllPhotos } from '@/lib/files';


;(async () => {
    const data = await getAllPhotos();
    console.log(data);
})()
