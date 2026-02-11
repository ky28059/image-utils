'use client'

import { useActionState } from 'react';
import { login } from '@/actions/auth';


export default function AuthForm() {
    const [state, formAction, pending] = useActionState(login, { error: '' });

    return (
        <form
            className="mt-4"
            action={formAction}
        >
            <input
                className="px-3 py-1 rounded-sm border border-tertiary bg-black/10"
                placeholder="Auth token"
                name="token"
                id="token"
            />
            {state.error && (
                <p className="text-red-500 text-sm mt-2">{state.error}</p>
            )}
        </form>
    )
}
