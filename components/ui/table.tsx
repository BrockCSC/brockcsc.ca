import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

/* ---------- TYPES ---------- */

type TableColumn = {
  key: string
  label: string
}

type TableData = {
  columns: TableColumn[]
  rows: Record<string, any>[]
}

type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  containerClassName?: string
  containerStyle?: React.CSSProperties

  // NEW (optional JSON mode)
  data?: TableData

  // responsive mode
  mobileVariant?: "scroll" | "stack"
}

/* ---------- DEFAULT STYLES ---------- */

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

/* ---------- MAIN TABLE ---------- */

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      containerClassName,
      containerStyle,
      data,
      mobileVariant = "scroll",
      children,
      ...props
    },
    ref
  ) => {
    const isStack = mobileVariant === "stack" && data


const renderCell = (value: any) => {
  // Badge support
  if (value && typeof value === "object" && value.type === "badge") {
    return (
      <Badge variant={value.variant || "default"}>
        {value.label}
      </Badge>
    )
  }

  // fallback (string, number, etc.)
  return value
}


    return (
      <div
        className={cn(
          "relative w-full rounded-[var(--table-radius)] border-2 border-[color:var(--table-border)] bg-[color:var(--table-bg)] shadow-[var(--table-shadow)] overflow-hidden",
          // horizontal scroll for mobile
          mobileVariant === "scroll" && "overflow-x-auto",
          containerClassName
        )}
        style={{ ...tableDefaults, ...containerStyle }}
      >
        {/* ---------- STACK MODE (MOBILE CARDS) ---------- */}
        {isStack ? (
          <div className="md:hidden flex flex-col gap-4 p-4">
            {data.rows.map((row, i) => (
              <div
                key={i}
                className="border-2 border-[color:var(--table-border)] rounded-xl p-4 shadow-[2px_2px_0_#000]"
              >
                {data.columns.map((col) => (
                  <div key={col.key} className="flex justify-between py-1">
                    <span className="font-semibold">{col.label}</span>
                    <span>{renderCell(row[col.key])}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {/* ---------- NORMAL TABLE ---------- */}
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-base text-[color:var(--table-text)]",
            isStack ? "hidden md:table" : "",
            className
          )}
          {...props}
        >
          {/* JSON MODE */}
          {data ? (
            <>
              <thead className="bg-[color:var(--table-head-bg)]">
                <tr className="border-b-2 border-[color:var(--table-border)]">
                  {data.columns.map((col) => (
                    <th key={col.key} className="h-12 px-6 text-left font-semibold">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[color:var(--table-divider)] hover:bg-[color:var(--table-hover)]"
                  >
                    {data.columns.map((col) => (
                      <td key={col.key} className="p-4">
                          {renderCell(row[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            // MANUAL MODE (your current usage)
            children
          )}
        </table>
      </div>
    )
  }
)

Table.displayName = "Table"

export { Table }
