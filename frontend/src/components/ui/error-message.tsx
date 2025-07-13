"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function ErrorMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <small
      className={cn(
        "text-xs leading-none text-red-600 dark:text-red-500",
        className
      )}
      {...props}
    >
      {children}
    </small>
  )
}

export { ErrorMessage }
