import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewTransaction } from '@/stores/useNewTransactionStore'
import React from 'react'
import TransactionForm from './transaction-form'
import { useCreateTransaction } from '../api/use-create-transaction'
import { useCreateCategory } from '@/features/categories/api/use-create-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useCreateAccount } from '@/features/accounts/api/use-create-account'
import { Loader2 } from 'lucide-react'
import { insertTransactionSchema } from '@/db/schema'
import z from 'zod'

export default function NewTransactionSheet() {


    const formSchema = insertTransactionSchema.omit({
        id: true
    })
    type FormValues = z.input<typeof formSchema>

    const { isOpen, onClose } = useNewTransaction()

    const mutation = useCreateTransaction();

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

    const isPending = mutation.isPending || categoryMutation.isPending || accountMutation.isPending

    const isLoading = categoryQuery.isLoading || accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }
    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="p-6 space-y-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            New Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Create a new transaction.
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ? (
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <Loader2 className='size-4 text-muted-foreground animate-spin' />
                        </div>
                    ) : (
                        <TransactionForm
                            onSubmit={onSubmit}
                            disabled={isPending}
                            categoryOptions={categoryOptions}
                            accountOptions={accountOptions}
                            onCreateCategory={onCreateCategory}
                            onCreateAccount={onCreateAccount}>

                        </TransactionForm>
                    )}

                </SheetContent>
            </Sheet>
        </>
    )
}
