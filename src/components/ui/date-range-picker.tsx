"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: [Date | null, Date | null]
    onChange?: (date: [Date | null, Date | null]) => void
}

export function DateRangePicker({
    className,
    value,
    onChange,
}: DateRangePickerProps) {
    // Convert array back to DateRange object for the calendar
    const date: DateRange | undefined = React.useMemo(() => {
        if (!value) return undefined
        return {
            from: value[0] || undefined,
            to: value[1] || undefined
        }
    }, [value])

    const onSelect = (range: DateRange | undefined) => {
        if (onChange) {
            onChange([range?.from || null, range?.to || null])
        }
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onSelect}
                        numberOfMonths={2}
                        className="text-white"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
