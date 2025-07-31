import * as React from "react"
import { cn } from "~/lib/utils"

// ✅ Type aliases for ChartContainer
type ChartContainerRef = HTMLDivElement
type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: Record<string, any>
}

const ChartContainer = React.forwardRef<ChartContainerRef, ChartContainerProps>(
  ({ className, config, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
      />
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ content: Content, ...props }: any) => {
  return <Content {...props} />
}

// ✅ Type aliases for ChartTooltipContent
type ChartTooltipContentRef = HTMLDivElement
type ChartTooltipContentProps = React.HTMLAttributes<HTMLDivElement>

const ChartTooltipContent = React.forwardRef<
  ChartTooltipContentRef,
  ChartTooltipContentProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background p-2 shadow-md",
        className
      )}
      {...props}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
