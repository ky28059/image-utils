import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { getBucketContents, s3 } from '@/lib/aws';
import { PREVIEW_BUCKET } from '@/lib/config';


;(async () => {
    const keys = (await getBucketContents(PREVIEW_BUCKET))
        .flatMap(({ Key }) => Key?.endsWith('.webp') ? [Key] : []);

    const concurrency = 10;
    for (let i = 0; i < keys.length; i += concurrency) {
        const batch = keys.slice(i, i + concurrency);

        await Promise.all(batch.map((key) => s3.send(
            new CopyObjectCommand({
                Bucket: PREVIEW_BUCKET,
                Key: key,
                CopySource: encodeURIComponent(`${PREVIEW_BUCKET}/${key}`), // TODO?
                MetadataDirective: 'REPLACE',
                ContentType: 'image/webp',
                CacheControl: 'public, max-age=86400'
            })
        )));

        console.log(`Updated ${Math.min(i + concurrency, keys.length)}/${keys.length} previews`);
    }
})()
