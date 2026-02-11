import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/config';


export function proxy(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token === process.env.AUTH_TOKEN) return;

    return NextResponse.redirect(new URL('/auth', request.url));
}

// Only force auth on the albums page, as individual album pages should be
// "unlisted" (public if you have a link)
export const config = {
    matcher: ['/'], // TODO?
}
