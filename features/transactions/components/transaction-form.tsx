import React from 'react'
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransactionSchema } from "@/db/schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,

} from "@/components/ui/form";
import { Select } from '@/components/select';

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().optional().nullable(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().optional().nullable()
});

const apiSchema = insertTransactionSchema.omit({
    id: true
})
export type FormValues = z.input<typeof formSchema>
export type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label: string; value: string }[]
    categoryOptions: { label: string; value: string }[]
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;

}
export default function TransactionForm({
    id,
    defaultValues,
    onSubmit,
    onDelete, disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) {



    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        // onSubmit(values)
        console.log(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }
    return (
        <>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-4 pt-4'
                >
                    <FormField
                        name="accountId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>
                                    Account
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select Account'
                                        options={accountOptions}
                                        onCreate={onCreateAccount}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField
                        name="categoryId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>
                                    Account
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder='Select Category'
                                        options={categoryOptions}
                                        onCreate={onCreateCategory}
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}>
                    </FormField>
                    <Button
                        className='w-full'
                        disabled={disabled}>
                        {id ? "Save Changes" : "Create Transaction"}
                    </Button>
                    {!!id && <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className='w-full'
                        variant="outline">
                        <Trash className='size-4 mr-2'></Trash>
                        Delete Transaction
                    </Button>}

                </form>
            </Form>
        </>
    )
}
