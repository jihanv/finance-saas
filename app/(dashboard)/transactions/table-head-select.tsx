import React from 'react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from '@/lib/utils'
type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onChange: (
        columnIndex: number,
        value: string | null
    ) => void
}

const options =
    [
        "amount",
        "payee",
        // "notes",
        "date"
    ]

export default function TableHeadSelect({ columnIndex, selectedColumns, onChange }: Props) {

    const currentSelection = selectedColumns[`column_${columnIndex}`]
    return (
        <>
            <div>
                <Select
                    value={currentSelection || ""}
                    onValueChange={(value) => onChange(columnIndex, value)}
                >
                    {/* the part of the Select component that you actually see BEFORE opening the menu. */}
                    <SelectTrigger className={
                        cn("focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize", currentSelection && "text-blue-500")
                    } >
                        {/* Displays the current selection inside the trigger */}
                        <SelectValue placeholder="Skip"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {/* Skip is always included in the dropdown, it never gets disabled */}
                        <SelectItem value="skip">Skip</SelectItem>
                        {options.map((option, index) => {
                            const disabled = Object.values(selectedColumns).includes(option) && selectedColumns[`column_${columnIndex}`] !== option
                            return (
                                <SelectItem
                                    key={index}
                                    value={option}
                                    disabled={disabled}
                                    className='capitalize'
                                >{option}</SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}
