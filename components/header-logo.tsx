import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HeaderLogo() {
    return (
        <Link href="/"><Image src="/logo.svg" height={100} width={100} alt="Logo" /></Link>
    )
}
