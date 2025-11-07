import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { useNewCategory } from '@/stores/useNewCategoryStore'
import React from 'react'
import CategoryForm, { FormValues } from './category-form'
import { useCreateCategory } from '../api/use-create-category'

export default function NewCategorySheet() {

    const { isOpen, onClose } = useNewCategory()

    const mutation = useCreateCategory();

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
                            New Category
                        </SheetTitle>
                        <SheetDescription>
                            Create a new category to track your transactions.
                        </SheetDescription>
                    </SheetHeader>
                    <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending}></CategoryForm>
                </SheetContent>
            </Sheet>
        </>
    )
}
