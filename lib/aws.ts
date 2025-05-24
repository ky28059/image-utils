import { _Object, DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';

// Utils
import { optimize } from './optimize';
import { filename } from './util';

// Config
import { BASE_PATH, PHOTOS_BUCKET, PREVIEW_BUCKET } from '@/config';


const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
});

/**
 * Iteratively fetches all contents of the given bucket.
 * @param bucket The bucket to list.
 * @returns A concatenated list of all contents in the bucket.
 */
export async function getAllContentsInBucket(bucket: string) {
    const res: _Object[] = [];

    while (true) {
        const { Contents } = await s3.send(new ListObjectsCommand({
            Bucket: bucket,
            Marker: res.at(-1)?.Key
        }));
        if (!Contents) return res;
        res.push(...Contents);
    }
}

/**
 * Deletes the given keys in the given bucket.
 * @param bucket The bucket to delete from.
 * @param keys The keys to delete.
 */
export async function deleteKeysInBucket(bucket: string, keys: string[]) {
    await s3.send(
        new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: keys.map((k) => ({ Key: k })) }
        })
    )
}

/**
 * Fetches all photos from S3, grouped by directory name.
 * @returns An object of type `{ [dir: string]: string[] }` mapping subdirectories to photos.
 */
export async function getAllHostedPhotos() {
    const res: { [dir: string]: string[] } = {};
    const contents = await getAllContentsInBucket(PHOTOS_BUCKET);

    for (const { Key } of contents) {
        if (!Key) continue;

        const [dir, name] = Key.split('/');
        if (!res[dir]) res[dir] = [];

        res[dir].push(name);
    }

    return res;
}

export async function optimizeAndUploadFile(dir: string, file: string) {
    const absPath = `${BASE_PATH}/${dir}/${file}`;

    const rawBody = await readFile(absPath);
    const optimizedBody = await optimize(absPath);

    await Promise.all([
        s3.send(
            new PutObjectCommand({
                Bucket: PHOTOS_BUCKET,
                Body: rawBody,
                Key: `${dir}/${file}`
            })
        ),
        s3.send(
            new PutObjectCommand({
                Bucket: PREVIEW_BUCKET,
                Body: optimizedBody,
                Key: `${dir}/${filename(file)}-preview.webp`
            })
        )
    ]);
}

export async function deleteUploadedFile(dir: string, file: string) {
    await Promise.all([
        s3.send(
            new DeleteObjectsCommand({
                Bucket: PHOTOS_BUCKET,
                Delete: { Objects: [{ Key: `${dir}/${file}` }] }
            })
        ),
        s3.send(
            new DeleteObjectsCommand({
                Bucket: PREVIEW_BUCKET,
                Delete: { Objects: [{ Key: `${dir}/${filename(file)}-preview.webp` }] }
            })
        )
    ]);
}
