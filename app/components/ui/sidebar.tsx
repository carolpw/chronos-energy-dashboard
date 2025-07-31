import * as React from "react"
import { cn } from "~/lib/utils"

interface SidebarContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen">
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  children,
  className,
  collapsible,
  ...props
}: {
  children: React.ReactNode
  className?: string
  collapsible?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("Sidebar must be used within SidebarProvider")
  
  const { open } = context

  return (
    <div
      className={cn(
        "relative flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 border-r border-slate-800",
        open ? "w-64" : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SidebarContext)
  const { open } = context || { open: true }

  return (
    <div className={cn("p-4", className)} {...props}>
      <div className={cn("transition-all duration-300", !open && "opacity-0 scale-95")}>
        {children}
      </div>
    </div>
  )
}

export function SidebarContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(SidebarContext)
  const { open } = context || { open: true }

  return (
    <div className={cn("p-4 border-t border-slate-700", className)} {...props}>
      <div className={cn("transition-all duration-300", !open && "opacity-0 scale-95")}>
        {children}
      </div>
    </div>
  )
}

export function SidebarGroup({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-2", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({ children, className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  )
}

export function SidebarMenuButton({
  children,
  className,
  isActive,
  asChild,
  ...props
}: {
  children: React.ReactNode
  className?: string
  isActive?: boolean
  asChild?: boolean
} & React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("SidebarMenuButton must be used within SidebarProvider")
  
  const { open } = context

  const baseClasses = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-slate-800 w-full text-left",
    isActive && "bg-teal-900/50 text-teal-100 hover:bg-teal-900/60",
    !isActive && "text-slate-300 hover:text-slate-100",
    !open && "justify-center px-2",
    className
  )

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: baseClasses,
      ...props
    })
  }

  return (
    <button className={baseClasses} {...props}>
      <span className="flex-shrink-0">
        {React.Children.toArray(children)[0]}
      </span>
      {open && (
        <span className="truncate transition-all duration-300">
          {React.Children.toArray(children).slice(1)}
        </span>
      )}
    </button>
  )
}

export function SidebarTrigger({ className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("SidebarTrigger must be used within SidebarProvider")
  
  const { open, setOpen } = context

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn("p-2 hover:bg-slate-800 rounded-md transition-colors", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" x2="21" y1="6" y2="6" />
        <line x1="3" x2="21" y1="12" y2="12" />
        <line x1="3" x2="21" y1="18" y2="18" />
      </svg>
    </button>
  )
}