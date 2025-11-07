import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import React from 'react'
import CategoryForm, { FormValues } from './category-form'
import { useOpenCategory } from '@/stores/useOpenCategory'
import { useGetCategory } from '../api/use-get-category'
import { useEditCategory } from '../api/use-edit-category'
import { useDeleteCategory } from '../api/use-delete-category'
import useConfirm from '@/hooks/use-confirm'


import { Loader2 } from 'lucide-react'

export default function EditCategorySheet() {

    const { isOpen, onClose, id } = useOpenCategory()

    const categoryQuery = useGetCategory(id)
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)
    const [ConfirmationDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this category.")
    const isPending = editMutation.isPending || deleteMutation.isPending


    const isLoading = categoryQuery.isLoading

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

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : { name: "" }
    return (
        <>
            <ConfirmationDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="p-6 space-y-4">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            Edit Category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category
                        </SheetDescription>
                    </SheetHeader>
                    {isLoading ?
                        (<div className='absolute inset-0 items-center justify-center'>
                            <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                        </div>) : (<CategoryForm
                            id={id}
                            onSubmit={onSubmit}
                            disabled={isPending}
                            defaultValues={defaultValues}
                            onDelete={onDelete}>

                        </CategoryForm>)
                    }

                </SheetContent>
            </Sheet>
        </>
    )
}
