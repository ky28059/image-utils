import { _Object, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';

// Utils
import { optimizeSmallToBuffer, optimizeToBuffer } from './optimize';
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
 * @param prefix The prefix to list; defaults to the entire bucket.
 * @returns A concatenated list of all contents in the bucket.
 */
export async function getBucketContents(bucket: string, prefix?: string) {
    const ret: _Object[] = [];
    let token = undefined;

    while (true) {
        // TODO?
        // @ts-ignore
        const { Contents, IsTruncated, NextContinuationToken } = await s3.send(new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: token
        }));
        if (!Contents) return ret;
        ret.push(...Contents);

        if (!IsTruncated) return ret;
        token = NextContinuationToken;
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
    const ret: { [dir: string]: string[] } = {};
    const contents = await getBucketContents(PHOTOS_BUCKET);

    for (const { Key } of contents) {
        if (!Key) continue;

        const [dir, name] = Key.split('/');
        if (!ret[dir]) ret[dir] = [];

        ret[dir].push(name);
    }

    return ret;
}

/**
 * Fetches the S3 photos in a given directory. More efficient version of `(await getAllHostedPhotos())[dir]`.
 *
 * @param dir The directory to fetch.
 * @returns A `string[]` of photos.
 */
export async function getHostedDirectory(dir: string) {
    const contents = await getBucketContents(PHOTOS_BUCKET, dir);

    return contents
        .filter(f => f.Key)
        .map(f => f.Key!.split('/')[1]);
}

export async function uploadRaw(dir: string, file: string) {
    const absPath = `${BASE_PATH}/${dir}/${file}`;

    const rawBody = await readFile(absPath);
    await s3.send(
        new PutObjectCommand({
            Bucket: PHOTOS_BUCKET,
            Body: rawBody,
            Key: `${dir}/${file}`
        })
    );
}

export async function uploadOptimized(dir: string, file: string) {
    const absPath = `${BASE_PATH}/${dir}/${file}`;

    const optimizedBody = await optimizeToBuffer(absPath);
    await s3.send(
        new PutObjectCommand({
            Bucket: PREVIEW_BUCKET,
            Body: optimizedBody,
            Key: `${dir}/${filename(file)}-preview.webp`
        })
    );
}

export async function uploadOptimizedSmall(dir: string, file: string) {
    const absPath = `${BASE_PATH}/${dir}/${file}`;

    const optimizedBody = await optimizeSmallToBuffer(absPath);
    await s3.send(
        new PutObjectCommand({
            Bucket: PREVIEW_BUCKET,
            Body: optimizedBody,
            Key: `${dir}/${filename(file)}-preview-small.webp`
        })
    );
}

export async function deleteUploadedFiles(dir: string, files: string[]) {
    await Promise.all([
        deleteKeysInBucket(PHOTOS_BUCKET, files.map((f) => `${dir}/${f}`)),
        deleteKeysInBucket(PREVIEW_BUCKET, files.map((f) => `${dir}/${filename(f)}-preview.webp`))
    ]);
}
