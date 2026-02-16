'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/config';


// TODO: state argument?
export async function login(_: any, data: FormData) {
    const token = data.get('token');
    if (token !== process.env.AUTH_TOKEN)
        return { error: 'Invalid token provided.' };

    const c = await cookies();
    c.set(AUTH_COOKIE_NAME, token, { maxAge: 16070400 }); // ~6 months
    redirect('/');
}
