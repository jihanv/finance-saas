import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'
import TransactionForm, { FormValues } from './transaction-form'
import { useOpenTransaction } from '@/stores/useOpenTransaction'
import { useGetTransaction } from '../api/use-get-transaction'
import { useEditTransaction } from '../api/use-edit-transaction'
import { useDeleteTransaction } from '../api/use-delete-transaction'
import useConfirm from '@/hooks/use-confirm'


import { Loader2 } from 'lucide-react'

export default function EditTransactionSheet() {

    const { isOpen, onClose, id } = useOpenTransaction()

    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction.")
    const isPending = editMutation.isPending || deleteMutation.isPending


    const isLoading = transactionQuery.isLoading

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    const onDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const defaultValues = transactionQuery.data ? {
        name: transactionQuery.data.name
    } : { name: "" }
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="p-6 space-y-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ?
                        (<div className='absolute inset-0 items-center justify-center'>
                            <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                        </div>) : (<TransactionForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}>

                        </TransactionForm>)
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
