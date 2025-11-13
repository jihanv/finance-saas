import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'
import TransactionForm from './transaction-form'
import { useOpenTransaction } from '@/stores/useOpenTransactionStore'
import { useGetTransaction } from '../api/use-get-transaction'
import { useEditTransaction } from '../api/use-edit-transaction'
import { useDeleteTransaction } from '../api/use-delete-transaction'
import useConfirm from '@/hooks/use-confirm'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'

import { Loader2 } from 'lucide-react'
import { insertTransactionSchema } from '@/db/schema'
import z from 'zod'
import { convertAmountFromMilliunits } from '@/lib/utils'

const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>

export default function EditTransactionSheet() {

    const { isOpen, onClose, id } = useOpenTransaction()

    const transactionQuery = useGetTransaction(id)
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this transaction.")

    ///
    const categoryMutation = useCreateCategory();
    const categoryQuery = useGetCategories();

    const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
        label: category.name,
        value: category.id
    }));


    const accountMutation = useCreateAccount();

    const accountQuery = useGetAccounts();

    const onCreateAccount = (name: string) => accountMutation.mutate({ name });

    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }));
    const isPending =
        editMutation.isPending ||
        deleteMutation.isPending ||
        transactionQuery.isPending ||
        categoryMutation.isPending ||
        accountMutation.isPending

    const isLoading =
        transactionQuery.isLoading ||
        categoryQuery.isLoading ||
        accountQuery.isLoading

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
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: convertAmountFromMilliunits(transactionQuery.data.amount).toString(),
        date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
    } :
        {
            accountId: "",
            categoryId: "",
            amount: "",
            date: new Date(),
            payee: "",
            notes: "",
        }
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
                            onDelete={onDelete}
                            onCreateAccount={onCreateAccount}
                            onCreateCategory={onCreateCategory}
                            accountOptions={accountOptions}
                            categoryOptions={categoryOptions}
                        >


                        </TransactionForm>)
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
