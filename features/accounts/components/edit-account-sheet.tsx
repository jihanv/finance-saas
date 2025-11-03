import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'
import AccountForm, { FormValues } from './account-form'
import { useCreateAccount } from '../api/use-create-account'
import { useOpenAccount } from '@/stores/useOpenAccount'
import { useGetAccount } from '../api/use-get-account'

export default function EditAccountSheet() {

    const { isOpen, onClose, id } = useOpenAccount()

    const accountQuery = useGetAccount(id)

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    }

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : { name: "" }
    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="p-6 space-y-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            New Account
                        </SheetTitle>
                        <SheetDescription>
                            Create a new account to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={defaultValues}></AccountForm>
                </SheetContent>
            </Sheet>
        </>
    )
}
