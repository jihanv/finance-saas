import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'
import AccountForm, { FormValues } from './account-form'
import { useOpenAccount } from '@/stores/useOpenAccount'
import { useGetAccount } from '../api/use-get-account'
import { useEditAccount } from '../api/use-edit-account'

import { Loader2 } from 'lucide-react'

export default function EditAccountSheet() {

    const { isOpen, onClose, id } = useOpenAccount()

    const accountQuery = useGetAccount(id)

    const editMutation = useEditAccount(id)

    const isPending = editMutation.isPending


    const isLoading = accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
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
                            Edit Account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ?
                        (<div className='absolute inset-0 items-center justify-center'>
                            <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                        </div>) : (<AccountForm id={id} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues}></AccountForm>)
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
