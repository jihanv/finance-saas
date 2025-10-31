"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/stores/useNewAccountStore'
import { Plus } from 'lucide-react'
import React from 'react'
import { columns, Payment } from './columns'
import { DataTable } from '@/components/data-table'

export default function Accounts() {

    const data: Payment[] = [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "828ed53f",
            amount: 100,
            status: "success",
            email: "as@example.com",
        },
        {
            id: "a1b2c3d4",
            amount: 250,
            status: "success",
            email: "alice@example.com",
        },
        {
            id: "e5f6g7h8",
            amount: 90,
            status: "pending",
            email: "bob@example.com",
        },
        {
            id: "i9j0k1l2",
            amount: 150,
            status: "failed",
            email: "carol@example.com",
        },
        {
            id: "m3n4o5p6",
            amount: 400,
            status: "success",
            email: "dave@example.com",
        },
        {
            id: "q7r8s9t0",
            amount: 70,
            status: "success",
            email: "eve@example.com",
        },
        {
            id: "u1v2w3x4",
            amount: 310,
            status: "pending",
            email: "frank@example.com",
        },
        {
            id: "y5z6a7b8",
            amount: 85,
            status: "failed",
            email: "grace@example.com",
        },
        {
            id: "c9d0e1f2",
            amount: 600,
            status: "success",
            email: "heidi@example.com",
        },
        {
            id: "g3h4i5j6",
            amount: 220,
            status: "pending",
            email: "ivan@example.com",
        },
        {
            id: "k7l8m9n0",
            amount: 130,
            status: "success",
            email: "judy@example.com",
        },
    ]

    const newAccounts = useNewAccount()
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Accounts Page</CardTitle>
                    <Button onClick={newAccounts.onOpen} size="sm" className="w-full lg:w-auto">
                        <Plus className='size-4 mr-2' ></Plus>
                        Add new</Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data}
                        filterKey="email"
                        onDelete={() => { }}
                        disabled={false} />
                </CardContent>
            </Card>
        </div>
    )
}
