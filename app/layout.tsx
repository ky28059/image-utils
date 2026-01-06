import type { Metadata } from 'next'
import type { ReactNode } from 'react';
import { Tooltip } from 'radix-ui';

import { Inter } from 'next/font/google'

import './globals.css'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'photos.kevin.fish',
    description: 'Online host for my photo catalog.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark bg-midnight text-white">
            <body className={inter.className}>
                <Tooltip.Provider>
                    {children}
                </Tooltip.Provider>
            </body>
        </html>
    )
}
