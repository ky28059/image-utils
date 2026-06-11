import { NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import { ZipArchive } from 'archiver';

// Utils
import { getHostedDirectory, getS3ObjectStream } from '@/lib/aws';
import { AUTH_COOKIE_NAME, PHOTOS_BUCKET } from '@/config';


export async function GET(req: NextRequest) {
    if (req.cookies.get(AUTH_COOKIE_NAME)?.value !== process.env.AUTH_TOKEN)
        return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const dir = req.nextUrl.searchParams.get('dir');
    if (!dir)
        return Response.json({ error: 'Missing directory for zip download' }, { status: 400 });

    const files = await getHostedDirectory(dir);
    const zip = new ZipArchive({ zlib: { level: 9 } });

    // zip.on('error', (err) => {
    //     throw err;
    // });

    // Add all S3 streams to the archive and finalize
    queueMicrotask(async () => {
        try {
            for (const f of files) {
                const stream = await getS3ObjectStream(PHOTOS_BUCKET, `${dir}/${f}`);
                zip.append(stream, { name: f });
            }

            await zip.finalize();
        } catch (err) {
            zip.destroy(err as Error);
        }
    });

    // @ts-ignore
    return new Response(Readable.toWeb(zip), {
        headers: { 'Content-Disposition': `attachment; filename="${dir}.zip"` },
    });
}
