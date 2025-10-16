import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewAccount } from '@/stores/useNewAccountStore'
import React from 'react'
import AccountForm from './account-form'

export default function NewAccountSheet() {

    const { isOpen, onClose } = useNewAccount()
    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            New Account
                        </SheetTitle>
                        <SheetDescription>
                            Create a new account to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    <AccountForm onSubmit={() => { }} disabled={false}></AccountForm>
                </SheetContent>
            </Sheet>
        </>
    )
}
