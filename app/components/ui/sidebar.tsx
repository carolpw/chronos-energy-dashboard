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
        "relative flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
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
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border-t border-sidebar-border", className)} {...props}>
      {children}
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

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      ),
      ...props
    })
  }

  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-left",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
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
      className={cn("p-1", className)}
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