"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-sm font-medium text-[#4A3F33]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-[#E8DFD3]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        month_grid: "w-full border-collapse",
        weekdays: "flex w-full",
        weekday: "text-[#9B8B7E] w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2 justify-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#F5F0EA] hover:text-[#6B5844] rounded-lg transition-colors flex items-center justify-center"
        ),
        day_selected:
          "bg-[#6B5844] text-white hover:bg-[#6B5844] hover:text-white focus:bg-[#6B5844] focus:text-white",
        day_today: "bg-[#F5F0EA] text-[#6B5844] font-bold",
        day_outside: "text-[#E8DFD3] opacity-50",
        day_disabled: "text-[#E8DFD3] opacity-50 cursor-not-allowed",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />;
          }
          return <ChevronRight className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
