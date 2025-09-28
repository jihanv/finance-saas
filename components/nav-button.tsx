import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';

export type NavButtonProps = {
    href: string;
    label: string;
    isActive: boolean;
}

export default function NavButton({ href, label, isActive }: NavButtonProps) {
    return (
        <Button>
            <Link href={href}>{label}</Link>
        </Button>
    )
}