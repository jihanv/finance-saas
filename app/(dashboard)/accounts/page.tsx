import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function accounts() {
    return (
        <div>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>Accounts Page</CardTitle>
                    <Button>Add new</Button>
                </CardHeader>
            </Card>
        </div>
    )
}
