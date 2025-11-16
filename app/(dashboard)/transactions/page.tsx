"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewTransaction } from '@/stores/useNewTransactionStore'
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions'
import { Loader2, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions'
import { UploadButton } from './upload-button'
import ImportCard from './import-card'
import { transactions as transactionSchema } from "@/db/schema"
import useSelectAccount from '@/features/accounts/hooks/use-select-account'
import { toast } from 'sonner'
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions'


enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

export const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {

    }
}

export default function TransactionsPage() {

    const [AccountDialog, confirm] = useSelectAccount()

    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)

    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results)
        setVariant(VARIANTS.IMPORT)
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS)
        setVariant(VARIANTS.LIST)
    }

    const newTransaction = useNewTransaction()
    const createTransactions = useBulkCreateTransactions()
    const transactionsQuery = useGetTransactions()
    const transactions = transactionsQuery.data || []
    const deleteTransactions = useBulkDeleteTransactions()

    const isDisabled = transactionsQuery.isLoading || deleteTransactions.isPending

    const onSubmitImport = async (values: typeof transactionSchema.$inferInsert[]) => {
        const accountId = await confirm()

        if (!accountId) {
            return toast.error("Please select an account to continue");
        }

        const data = values.map((value) => ({
            ...value,
            accountId: accountId as string
        }))

        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport()
            }
        })
    }
    // Render loading 
    if (transactionsQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin'></Loader2>
                        </div>
                    </CardContent>
                </Card>
            </div>

        )
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard data={importResults.data} onCancel={onCancelImport} onSubmit={onSubmitImport} />
            </>
        )
    }
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Transactions History</CardTitle>
                    <div className='w-full flex flex-col lg:flex-row gap-y-2 items-center gap-x-2 lg:w-auto'>
                        <Button onClick={newTransaction.onOpen} size="sm" className="w-full lg:w-auto">
                            <Plus className='size-4 mr-2' ></Plus>
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        filterKey="payee"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteTransactions.mutate({ ids })
                        }}
                        disabled={isDisabled} />
                </CardContent>
            </Card>
        </div>
    )
}
