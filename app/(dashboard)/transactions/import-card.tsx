import { useState } from "react"
const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"]
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ImportTable from "./import-table";
import { convertAmountToMilliunits } from "@/lib/utils";
import { format, parse } from "date-fns";

// This object can have any number of properties, and each property name must be a string. It needs to be dynamic because you don’t know how many CSV columns there are.
interface SelectedColumnsState {
    [key: string]: string | null
}

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

export default function ImportCard({ data, onCancel, onSubmit }: Props) {

    // selectedColumns is an object that keeps track of which CSV column the user mapped to which field. The value inside this state will match the SelectedColumnsState interface.
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({})

    // data is the parsed CSV file.
    const headers = data[0]
    const body = data.slice(1)

    const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = { ...prev }

            // Defensive check. If any other column already has this value, clear it.
            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] = null
                }
            }
            if (value === "skip") {
                value = null
            }

            // Assign the new value to the chosen column
            newSelectedColumns[`column_${columnIndex}`] = value
            return newSelectedColumns
        })
    }
    // returns: The number of columns the user has successfully mapped.
    // Object.values(selectedColumns) ->This takes all the values of the object and puts them in an array. It does NOT keep the keys — only the values.
    // .filter(Boolean) -> .filter(Boolean) removes any “falsy” values (null, undefined,etc). This gives only the columns that have been assigned a value.
    //.length -> Now we count how many selected columns there are.
    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1]
        }
        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`)
                return selectedColumns[`column_${columnIndex}`] || null
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index) => {
                    const columnIndex = getColumnIndex(`column_${index}`);
                    return selectedColumns[`column_${columnIndex}`] ? cell : null
                });

                return transformedRow.every((item) => item === null)
                    ? []
                    : transformedRow;
            }).filter((row) => row.length > 0)
        }

        const arrayofData = mappedData.body.map((row) => {
            return row.reduce((acc: any, cell, index) => {
                const header = mappedData.headers[index];
                if (header !== null) {
                    if (acc !== null) {
                        acc[header] = cell
                    }
                }
                return acc;
            }, {})
        })

        const formattedData = arrayofData.map((item) => ({
            ...item,
            amount: convertAmountToMilliunits(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormat)
        }))

        onSubmit(formattedData)
    }

    return (
        <>
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader className='gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                        <CardTitle className='text-xl line-clamp-1'>Import Transaction</CardTitle>
                        <div className='w-full flex flex-col lg:flex-row gap-y-2 items-center gap-x-2 lg:w-auto'>
                            <Button
                                onClick={onCancel}
                                size="sm"
                                className="w-full lg:w-auto">
                                Cancel
                            </Button>
                            <Button
                                disabled={progress < requiredOptions.length}
                                onClick={handleContinue}
                                size="sm"
                                className="w-full lg:w-auto"
                            >
                                Continue ({progress} / {requiredOptions.length})
                            </Button>

                        </div>
                    </CardHeader>
                    <CardContent>
                        <ImportTable headers={headers} body={body} selectedColumns={selectedColumns} onTableHeadSelectChange={onTableHeadSelectChange} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
