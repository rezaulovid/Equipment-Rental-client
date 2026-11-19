"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  Cloud,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  UserPlus,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
function BrandLogo({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="RentPro home"
      className={cn("flex shrink-0 items-center", className)}
    >
      <Image
        src="/images/rentpro-logo.png"
        alt="RentPro — Rent Smart. Work Better."
        width={534}
        height={140}
        priority
        className="h-10 w-auto sm:h-[52px]"
      />
    </Link>
  )
}

function DashboardButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="lg"
      render={<Link href="/dashboard" />}
      nativeButton={false}
      className={cn(
        "h-[42px] rounded-full border-[#071D49]/15 bg-[#F1F5FB] px-4.5 text-[15px] font-semibold text-[#071D49] shadow-xs hover:border-[#071D49]/25 hover:bg-[#E7EEF8] hover:text-[#071D49]",
        className
      )}
    >
      <LayoutDashboard
        className="size-4"
        strokeWidth={2.3}
        aria-hidden="true"
      />
      Dashboard
    </Button>
  )
}

function SaasButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      type="button"
      aria-label="SaaS"
      title="SaaS"
      className={cn(
        "size-10 rounded-full text-[#071D49] hover:bg-[#F1F5FB]",
        className
      )}
    >
      <Cloud className="size-[22px]" strokeWidth={2.3} aria-hidden="true" />
    </Button>
  )
}

function LogoutButton({
  className,
  onClick,
  disabled,
}: {
  className?: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      type="button"
      aria-label="Log out"
      title="Log out"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-10 rounded-full text-[#071D49] hover:bg-[#F1F5FB] hover:text-[#D95F00] disabled:opacity-60",
        className
      )}
    >
      <LogOut className="size-[22px]" strokeWidth={2.3} aria-hidden="true" />
    </Button>
  )
}

function LoginButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="lg"
      render={<Link href="/sign-in" />}
      nativeButton={false}
      className={cn(
        "h-[42px] rounded-full px-4.5 text-[15px] font-semibold text-[#071D49] hover:bg-[#F1F5FB] hover:text-[#071D49]",
        className
      )}
    >
      <LogIn className="size-4" strokeWidth={2.3} aria-hidden="true" />
      Login
    </Button>
  )
}

function RegisterButton({ className }: { className?: string }) {
  return (
    <Button
      size="lg"
      render={<Link href="/sign-up" />}
      nativeButton={false}
      className={cn(
        "h-[42px] rounded-full bg-[#FF6B00] px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-[#E85F00]",
        className
      )}
    >
      <UserPlus className="size-4" strokeWidth={2.3} aria-hidden="true" />
      Register
    </Button>
  )
}

function SearchButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label="Search"
      className={cn(
        "size-10 rounded-full text-[#071D49] hover:bg-[#F1F5FB]",
        className
      )}
    >
      <Search className="size-[22px]" strokeWidth={2.3} aria-hidden="true" />
    </Button>
  )
}

function MenuButton({
  onClick,
  expanded,
}: {
  onClick: () => void
  expanded: boolean
}) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Open menu"
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={onClick}
      className="size-10 rounded-xl border-[#E4E9F2] bg-white text-[#071D49] shadow-xs hover:bg-[#F1F5FB]"
    >
      <Menu className="size-5" strokeWidth={2.3} aria-hidden="true" />
    </Button>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data: session, refetch } = authClient.useSession()
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Equipment", href: "/equipment" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Dashboard", href: `/dashboard/${session?.user.role || "customer"}` },
  ]

  const isLoggedIn = Boolean(session?.user)

  async function handleLogout() {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        console.error("Logout error:", error)
        return
      }

      await refetch()
      setMobileOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E4E9F2] bg-white/95 font-display backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center gap-4 px-4 sm:px-6 lg:h-[96px] lg:px-10">
        <BrandLogo />
        {session?.user ? <span>Welcome, {session.user.name}!</span> : null}

        <NavigationMenu className="hidden max-w-none flex-1 justify-center xl:flex">
          <NavigationMenuList className="gap-0">
            {navLinks.map((link) => {
              const active = isActive(link.href)

              return (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    active={active}
                    closeOnClick
                    render={<Link href={link.href} />}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-[16px] font-medium whitespace-nowrap text-[#071D49] transition-colors outline-none hover:bg-transparent hover:text-[#FF6B00] focus:bg-transparent focus:text-[#FF6B00] focus-visible:ring-2 focus-visible:ring-[#FF6B00]/30 min-[1660px]:px-5.5 min-[1660px]:text-[18px]",
                      active && "text-[#FF6B00] hover:text-[#FF6B00]"
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-1.5 h-[2px] rounded-full bg-[#FF6B00] transition-opacity min-[1660px]:inset-x-5.5",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto hidden items-center gap-2.5 min-[1660px]:flex">
          <DashboardButton />
          <SaasButton />
          {isLoggedIn ? (
            <LogoutButton onClick={handleLogout} disabled={isSigningOut} />
          ) : null}
          <SearchButton />
          {!isLoggedIn ? (
            <>
              <LoginButton className="ml-1" />
              <RegisterButton />
            </>
          ) : null}
        </div>

        <div className="ml-auto hidden items-center gap-2 max-[1659px]:xl:flex">
          <SearchButton />
          {!isLoggedIn ? (
            <>
              <LoginButton />
              <RegisterButton />
            </>
          ) : null}
          <MenuButton
            onClick={() => setMobileOpen(true)}
            expanded={mobileOpen}
          />
        </div>

        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <SearchButton />
          <MenuButton
            onClick={() => setMobileOpen(true)}
            expanded={mobileOpen}
          />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="right"
            className="w-[88vw] max-w-sm gap-0 border-[#E4E9F2] bg-white p-0 font-display"
          >
            <SheetHeader className="border-b border-[#E4E9F2] px-5 py-5">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <SheetDescription className="sr-only">
                Browse RentPro pages and account actions.
              </SheetDescription>
              <BrandLogo onClick={() => setMobileOpen(false)} />
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 py-4">
              {navLinks.map((link) => {
                const active = isActive(link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-medium text-[#071D49] transition-colors hover:bg-[#F1F5FB] hover:text-[#FF6B00]",
                      active && "text-[#FF6B00] hover:text-[#FF6B00]"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <SheetFooter className="gap-3 border-t border-[#E4E9F2] px-5 py-5">
              <div className="flex items-center gap-2.5">
                <DashboardButton className="h-11 flex-1" />
                <SaasButton className="size-11" />
                {isLoggedIn ? (
                  <LogoutButton
                    className="size-11"
                    onClick={handleLogout}
                    disabled={isSigningOut}
                  />
                ) : null}
              </div>

              {!isLoggedIn ? (
                <div className="flex flex-col gap-2.5 border-t border-[#E4E9F2] pt-4">
                  <LoginButton className="h-11 w-full bg-[#F1F5FB]" />
                  <RegisterButton className="h-11 w-full" />
                </div>
              ) : null}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
