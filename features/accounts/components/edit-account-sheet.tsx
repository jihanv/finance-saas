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
import { useDeleteAccount } from '../api/use-delete-account'
import useConfirm from '@/hooks/use-confirm'


import { Loader2 } from 'lucide-react'

export default function EditAccountSheet() {

    const { isOpen, onClose, id } = useOpenAccount()

    const accountQuery = useGetAccount(id)
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this account.")
    const isPending = editMutation.isPending || deleteMutation.isPending


    const isLoading = accountQuery.isLoading

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

    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : { name: "" }
    return (
        <>
            <ConfirmationDialog />
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
                        </div>) : (<AccountForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}>

                        </AccountForm>)
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
