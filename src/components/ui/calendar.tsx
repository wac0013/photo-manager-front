import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center h-10 mb-4 z-20",
        caption_label: "text-sm font-bold hidden", 
        nav: "flex items-center justify-between absolute w-full top-1 left-0 px-1 z-10",
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg z-30"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg z-30"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-9 font-bold text-[0.7rem] uppercase flex-1 text-center mb-2",
        week: "flex w-full mt-1",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal rounded-xl flex-1 text-center transition-all hover:bg-primary/20"
        ),
        day_button: "h-full w-full",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30 font-bold",
        today: "bg-accent text-accent-foreground font-black ring-2 ring-primary/20",
        outside: "text-muted-foreground opacity-30",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        dropdowns: "flex gap-1 items-center justify-center relative z-20",
        dropdown: "rdp-dropdown",
        dropdown_container: "relative flex items-center",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') return <ChevronLeft className="h-4 w-4" />
          if (orientation === 'right') return <ChevronRight className="h-4 w-4" />
          return null
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
