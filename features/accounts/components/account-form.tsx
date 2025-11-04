import React from 'react'
import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    // FormMessage,
} from "@/components/ui/form";


// Create a new schema that includes only the name field from the original schema.
const formSchema = insertAccountSchema.pick({
    name: true
})

// Take the Zod schema called formSchema
// Extract the TypeScript input type from it
// Store that as a reusable type called FormValues
export type FormValues = z.input<typeof formSchema>


type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}
export default function AccountForm({ id, defaultValues, onSubmit, onDelete, disabled }: Props) {

    //Creates a form using react-hook-form that follows the FormValues type (so this form knows what fields it has)
    //Uses your Zod schema to validate the form
    //Pre-fills the form (for example, when editing an existing account)
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? { name: "" }
    })

    React.useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues, form]);

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    }

    const handleDelete = () => {
        onDelete?.()
    }
    return (
        <>
            {/*{...form} Pass everything from the form object into the <Form> component */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-4 pt-4'
                >
                    <FormField
                        name="name"
                        control={form.control}
                        // `render` tells how to display this field.
                        // It gives us `field`, which contains props like value and onChange.
                        // We spread `{...field}` into our <Input> so it's connected to react-hook-form.
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={disabled}
                                        placeholder="e.g. Cash, Bank, Credit Card"
                                        {...field}>
                                    </Input>
                                </FormControl>
                            </FormItem>
                        )}>
                    </FormField>
                    <Button
                        className='w-full'
                        disabled={disabled}>
                        {id ? "Save Changes" : "Create Account"}
                    </Button>
                    {!!id && <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className='w-full'
                        variant="outline">
                        <Trash className='size-4 mr-2'></Trash>
                        Delete Account
                    </Button>}

                </form>
            </Form>
        </>
    )
}
