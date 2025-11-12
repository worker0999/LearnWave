'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { addDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

interface DateRangePickerProps {
  value?: [Date | null, Date | null]
  onChange?: (value: [Date | null, Date | null]) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value && value[0] && value[1]
      ? { from: value[0], to: value[1] }
      : { from: new Date(), to: addDays(new Date(), 7) }
  )

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    onChange?.([range?.from ?? null, range?.to ?? null])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Select date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
