import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewAccount } from '@/stores/useNewAccountStore'
import React from 'react'
import AccountForm, { FormValues } from './account-form'
import { useCreateAccount } from '../api/use-create-account'

export default function NewAccountSheet() {

    const { isOpen, onClose } = useNewAccount()

    const mutation = useCreateAccount();

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
                            New Account
                        </SheetTitle>
                        <SheetDescription>
                            Create a new account to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    <AccountForm onSubmit={onSubmit} disabled={mutation.isPending}></AccountForm>
                </SheetContent>
            </Sheet>
        </>
    )
}
