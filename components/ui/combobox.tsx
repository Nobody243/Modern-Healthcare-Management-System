'use client';
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            !value && "text-slate-400 dark:text-slate-500",
            className
          )}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-70 text-slate-500 dark:text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-lg" align="start">
        <Command className="bg-white dark:bg-slate-900" shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="h-10 text-slate-900 dark:text-slate-100 font-medium"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
            <CommandGroup>
              {options
                .filter((option) => {
                  if (!search) return true
                  const searchLower = search.toLowerCase()
                  return (
                    option.label.toLowerCase().includes(searchLower) ||
                    option.value.toLowerCase().includes(searchLower)
                  )
                })
                .map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange?.(option.value)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-slate-900 dark:text-slate-100 font-medium outline-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                      value === option.value && "bg-slate-100 dark:bg-slate-800 text-primary font-semibold"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}
            </CommandGroup>
            {options.filter((option) => {
              if (!search) return true
              const searchLower = search.toLowerCase()
              return (
                option.label.toLowerCase().includes(searchLower) ||
                option.value.toLowerCase().includes(searchLower)
              )
            }).length === 0 && (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
