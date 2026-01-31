import * as React from "react"

import { cn } from "@/lib/utils"

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  containerClassName?: string
  containerStyle?: React.CSSProperties
}

const tableDefaults = {
  "--table-border": "#000000",
  "--table-head-bg": "#f2f2f2",
  "--table-divider": "#000000",
  "--table-hover": "#f2f2f2",
  "--table-shadow": "4px 4px 0 #000",
  "--table-radius": "20px",
  "--table-text": "#111111",
  "--table-head-text": "#111111",
  "--table-caption": "#111111",
  "--table-bg": "#ffffff",
} as React.CSSProperties

// Customize the table by passing CSS variables via containerStyle or a wrapper class.
// Example: <Table containerStyle={{ "--table-border": "#111", "--table-head-bg": "#f7f7f7" }} />

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, containerStyle, ...props }, ref) => (
    <div
      className={cn(
        "relative w-full overflow-auto rounded-[var(--table-radius)] border-2 border-[color:var(--table-border)] bg-[color:var(--table-bg)] shadow-[var(--table-shadow)]",
        containerClassName
      )}
      style={{ ...tableDefaults, ...containerStyle }}
    >
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-base text-[color:var(--table-text)]",
          className
        )}
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-[color:var(--table-head-bg)] [&_tr]:border-b-2 [&_tr]:border-[color:var(--table-border)]",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t-2 border-[color:var(--table-border)] bg-[color:var(--table-head-bg)] font-semibold [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[color:var(--table-divider)] transition-colors hover:bg-[color:var(--table-hover)]",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-6 text-left align-middle font-semibold text-[color:var(--table-head-text)] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-[color:var(--table-text)] [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-[color:var(--table-caption)] opacity-70",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
