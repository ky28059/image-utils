import { DeleteObjectsCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';

// Utils
import { optimize } from './optimize';
import { filename } from './files';

// Config
import { BASE_PATH, PHOTOS_BUCKET } from '../config';


const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
});

export async function getAllHostedPhotos() {
    const { Contents } = await s3.send(new ListObjectsCommand({ Bucket: PHOTOS_BUCKET }));

    const res: { [dir: string]: string[] } = {};
    if (!Contents) return res;

    for (const { Key } of Contents) {
        if (!Key) continue;
        if (filename(Key).endsWith('-preview')) continue; // Skip optimized images

        const [dir, name] = Key.split('/');
        if (!res[dir]) res[dir] = [];

        res[dir].push(name);
    }

    return res;
}

export async function optimizeAndUploadFile(dir: string, file: string) {
    const absPath = `${BASE_PATH}/${dir}/${file}`;

    const rawBody = await readFile(absPath);
    await s3.send(
        new PutObjectCommand({
            Bucket: PHOTOS_BUCKET,
            Body: rawBody,
            Key: `${dir}/${file}`
        })
    );

    // Optimize and upload preview file
    const optimizedBody = await optimize(absPath);
    await s3.send(
        new PutObjectCommand({
            Bucket: PHOTOS_BUCKET,
            Body: optimizedBody,
            Key: `${dir}/${filename(file)}-preview.webp`
        })
    );
}

export async function deleteUploadedFile(dir: string, file: string) {
    await s3.send(
        new DeleteObjectsCommand({
            Bucket: PHOTOS_BUCKET,
            Delete: {
                Objects: [{
                    Key: `${dir}/${file}`
                }, {
                    Key: `${dir}/${filename(file)}-preview.webp`
                }]
            }
        })
    );
}
