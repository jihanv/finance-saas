"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/stores/useNewAccountStore'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { Plus } from 'lucide-react'
import React from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'

export default function Accounts() {



    const newAccounts = useNewAccount()
    const accountsQuery = useGetAccounts()
    const accounts = accountsQuery.data || []
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
                        data={accounts}
                        filterKey="name"
                        onDelete={() => { }}
                        disabled={false} />
                </CardContent>
            </Card>
        </div>
    )
}
