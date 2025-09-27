"use client"
import React from 'react'

const routes = [
    {
        href: "/",
        label: "Overview"
    },
    {
        href: "/transactions",
        label: "Transactions"
    },
    {
        href: "/accounts",
        label: "Accounts"
    },
    {
        href: "/categories",
        label: "Categories"
    },
    {
        href: "/settings",
        label: "Settings"
    },

]

export default function Navigation() {
    return (
        <nav className='hidden lg:flex items-center gap-x-2 overflow-x-auto'>
            {routes.map(route => {
                return (<p key={route.label}>{route.label}</p>)
            })}
        </nav>
    )
}
