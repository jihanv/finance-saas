import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewAccount } from '@/stores/useNewAccountStore'
import React from 'react'

export default function NewAccountSheet() {

    const { isOpen, onOpen, onClose } = useNewAccount()
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
                </SheetContent>
            </Sheet>
        </>
    )
}
