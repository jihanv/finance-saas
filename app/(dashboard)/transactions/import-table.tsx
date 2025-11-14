import React from 'react'

import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { index } from 'drizzle-orm/gel-core';
import TableHeadSelect from './table-head-select';

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>
    onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
}

export default function ImportTable({ headers, body, selectedColumns, onTableHeadSelectChange }: Props) {
    return (
        <>
            <div className='rounded-md border overflow-hidden'>
                <Table>
                    <TableHeader className='bg-muted'>
                        <TableRow>
                            {headers.map((_, index) => (
                                <TableHead key={index}>
                                    <TableHeadSelect columnIndex={index} selectedColumns={selectedColumns} onChange={onTableHeadSelectChange} />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {body.map((row: string[], index) => (
                            <TableRow key={index}>
                                {row.map((cell, index) => (
                                    <TableCell key={index}>
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

