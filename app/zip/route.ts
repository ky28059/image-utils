import { NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import archiver from 'archiver';

// Utils
import { getHostedDirectory, getS3ObjectStream } from '@/lib/aws';
import { PHOTOS_BUCKET } from '@/config';


export async function GET(req: NextRequest) {
    const dir = req.nextUrl.searchParams.get('dir');
    if (!dir)
        return Response.json({ error: 'Missing directory for zip download' }, { status: 400 });

    const files = await getHostedDirectory(dir);
    const zip = archiver('zip', {
        zlib: { level: 9 }
    });

    zip.on('error', (err) => {
        throw err;
    });

    // Add all S3 streams to the archive and finalize
    await Promise.all(files.map(async (f) => {
        const stream = await getS3ObjectStream(PHOTOS_BUCKET, `${dir}/${f}`);
        zip.append(stream, { name: f });
    }));
    void zip.finalize();

    // @ts-ignore
    return new Response(Readable.toWeb(zip), {
        headers: { 'Content-Disposition': `attachment; filename="${dir}.zip"` },
    });
}
