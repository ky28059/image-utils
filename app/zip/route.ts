import { NextRequest } from 'next/server';
import AdmZip from 'adm-zip';

// Utils
import { getHostedDirectory, getS3Object } from '@/lib/aws';
import { PHOTOS_BUCKET } from '@/config';


export async function GET(req: NextRequest) {
    const dir = req.nextUrl.searchParams.get('dir');
    if (!dir)
        return Response.json({ error: 'Missing directory for zip download' }, { status: 400 });

    const files = await getHostedDirectory(dir);
    const zip = new AdmZip();

    await Promise.all(files.map(async (f) => {
        const raw = await getS3Object(PHOTOS_BUCKET, `${dir}/${f}`);
        zip.addFile(f, raw);
    }));

    return new Response(zip.toBuffer());
}
