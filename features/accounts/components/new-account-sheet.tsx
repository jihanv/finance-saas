import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'

export default function NewAccountSheet() {
    return (
        <>
            <Sheet open>
                <SheetContent className='space-y-4'>
                    <SheetHeader>
                        <SheetTitle>
                            New Title
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
