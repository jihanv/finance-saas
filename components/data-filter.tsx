"use client"
import { useState } from 'react'

import { format, subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { ChevronDown } from "lucide-react"
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import qs from "query-string";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn, formatDateRange } from '@/lib/utils'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover"

export default function DateFilter() {

    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const accountID = params.get("accoundId")
    const to = params.get("to") || ""
    const from = params.get("from") || ""

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30)

    const paramState = {
        from: from ? new Date(from) : defaultFrom,
        to: to ? new Date(to) : defaultTo,
    }

    const [date, setDate] = useState<DateRange | undefined>(paramState)

    const pushToUrl = (dateRange: DateRange | undefined) => {
        const query = {
            from: format(dateRange?.from || defaultFrom, "yyyy-MM-dd"),
            to: format(dateRange?.to || defaultTo, "yyyy-MM-dd"),
            accountID
        }

        const url = qs.stringifyUrl({
            url: pathname,
            query
        }, { skipEmptyString: true, skipNull: true })

        router.push(url)
    }

    const onReset = () => {
        setDate(undefined);
        pushToUrl(undefined);
    }
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        disabled={false}
                        size="sm"
                        variant="outline"
                    >
                        <span>{formatDateRange(paramState)}</span>
                        <ChevronDown className='ml-2 size-4 opacity-50' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='lg:auto w-full p-0' align="start">
                    <Calendar
                        disabled={false}
                        autoFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    <div className='p-4 w-full flex flex-col items-center gap-x-2'>
                        <PopoverClose asChild>
                            <Button
                                onClick={onReset}
                                disabled={!date?.from || !date?.to}
                                className='w-full'
                                variant="outline"
                            >
                                Reset
                            </Button>
                        </PopoverClose>
                        <PopoverClose asChild>
                            <Button
                                onClick={() => pushToUrl(date)}
                                disabled={!date?.from || !date?.to}
                                className='w-full'
                            >
                                Apply
                            </Button>
                        </PopoverClose>
                    </div>
                </PopoverContent>
            </Popover >
        </>
    )
}
