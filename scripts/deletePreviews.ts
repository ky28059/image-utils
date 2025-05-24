import { deleteKeysInBucket, getAllContentsInBucket } from '@/lib/aws';
import { filename } from '@/lib/files';
import { PHOTOS_BUCKET } from '@/config';


;(async () => {
    const content = await getAllContentsInBucket(PHOTOS_BUCKET);

    const keys = content
        .map((o) => o.Key)
        .filter((k): k is string => !!k && filename(k).endsWith('-preview'))

    console.log(`Deleting ${keys.length} keys`);
    await deleteKeysInBucket(PHOTOS_BUCKET, keys);
})()
