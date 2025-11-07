"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewCategory } from '@/stores/useNewCategoryStore'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { columns } from './columns'
import { DataTable } from '@/components/data-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories'

export default function Categories() {



    const newCategories = useNewCategory()
    const categoriesQuery = useGetCategories() // fetches the list of existing categories from the backend.
    const categories = categoriesQuery.data || [] // ensures your table always receives a valid array to render, even before the data is loaded.
    const deleteCategories = useBulkDeleteCategories()

    const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending
    // Render loading 
    if (categoriesQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin'></Loader2>
                        </div>
                    </CardContent>
                </Card>
            </div>

        )
    }
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Categories Page</CardTitle>
                    <Button onClick={newCategories.onOpen} size="sm" className="w-full lg:w-auto">
                        <Plus className='size-4 mr-2' ></Plus>
                        Add new</Button>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={categories}
                        filterKey="name"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteCategories.mutate({ ids })
                        }}
                        disabled={isDisabled} />
                </CardContent>
            </Card>
        </div>
    )
}
