import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
]

const serviceLinks = [
  { label: "Equipment Rental", href: "/equipment" },
  { label: "Project Support", href: "/how-it-works" },
  { label: "24/7 Support", href: "/contact" },
  { label: "Best Price", href: "/equipment" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
]

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    viewBox: "0 0 320 512",
    path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    viewBox: "0 0 448 512",
    path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    viewBox: "0 0 576 512",
    path: "M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z",
  },
  {
    label: "Twitter / X",
    href: "https://x.com/",
    viewBox: "0 0 512 512",
    path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
  },
]

const socialButtonClass =
  "inline-flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.04] text-white/90 transition-all duration-200 outline-none hover:-translate-y-0.5 hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white hover:shadow-[0_8px_20px_-6px_rgba(255,107,0,0.55)] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071D49]"

const footerHeadingClass =
  "text-[18px] font-semibold tracking-[0.01em] text-white"

function FooterHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <h2 className={footerHeadingClass}>{children}</h2>
      <span
        aria-hidden="true"
        className="mt-2.5 h-[3px] w-9 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A4D]"
      />
    </div>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="group -my-1 inline-flex items-center gap-2.5 py-1 text-[15px] leading-6 text-white/70 transition-colors duration-200 outline-none hover:text-[#FF9A4D] focus-visible:rounded-sm focus-visible:text-[#FF9A4D] focus-visible:ring-2 focus-visible:ring-[#FF6B00]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
    >
      <ArrowRight
        aria-hidden="true"
        strokeWidth={2.6}
        className="size-4 shrink-0 text-[#FF6B00] transition-transform duration-200 group-hover:translate-x-1"
      />
      <span>{children}</span>
    </Link>
  )
}

export function SiteFooter() {
  return (
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden bg-[#071D49] font-display text-white"
    >
      <div className="relative overflow-hidden bg-[radial-gradient(130%_140%_at_0%_0%,#0C2B61_0%,#071D49_46%,#051433_100%)]">
        {/* Decorative accents */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#FF6B00] via-[#FF6B00]/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#1B4A96]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/3 right-1/4 size-64 rounded-full bg-[#FF6B00]/[0.07] blur-3xl"
        />

        {/* Orange wave, bottom right */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <svg
            className="absolute right-0 bottom-0 h-[92px] w-[300px] text-[#2C5AA8]/[0.22] sm:h-[120px] sm:w-[440px]"
            viewBox="0 0 470 140"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M470 10C383 18 305 52 246 90C201 119 137 138 74 140H470V10Z"
              fill="currentColor"
            />
          </svg>
          <svg
            className="absolute right-0 bottom-0 h-[72px] w-[240px] text-[#FF6B00] sm:h-[96px] sm:w-[360px] lg:h-[108px] lg:w-[420px]"
            viewBox="0 0 470 140"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M470 16C389 22 315 56 262 94C221 122 155 140 90 140H470V16Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-14 pb-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-[72px] lg:pb-16">
          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6 xl:gap-x-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-5 lg:pr-6">
              <Link
                href="/"
                aria-label="RentPro home"
                className="inline-flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
              >
                <Image
                  src="/images/rentpro-logo-light.png"
                  alt="RentPro — Rent Smart. Work Better."
                  width={534}
                  height={140}
                  className="h-auto w-[196px] sm:w-[216px]"
                />
              </Link>

              <p className="mt-5 max-w-[350px] font-sans text-[15px] leading-[1.7] text-white/70">
                Your trusted partner for equipment rental. Work smarter, not
                harder with RentPro.
              </p>

              <ul
                aria-label="RentPro on social media"
                className="mt-6 flex items-center gap-2.5"
              >
                {socialLinks.map(({ label, href, viewBox, path }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`RentPro on ${label}`}
                      title={label}
                      className={socialButtonClass}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox={viewBox}
                        fill="currentColor"
                        className="size-[18px]"
                      >
                        <path d={path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <nav aria-label="Quick links" className="lg:col-span-2">
              <FooterHeading>Quick Links</FooterHeading>
              <ul className="mt-5 space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Services */}
            <nav aria-label="Our services" className="lg:col-span-2">
              <FooterHeading>Our Services</FooterHeading>
              <ul className="mt-5 space-y-3">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Follow */}
            <div className="sm:col-span-2 lg:col-span-3">
              <FooterHeading>Follow Us</FooterHeading>
              <p className="mt-5 max-w-[260px] font-sans text-[15px] leading-[1.7] text-white/70">
                Stay in the loop with new gear, rental tips and exclusive
                offers.
              </p>
              <ul
                aria-label="Follow RentPro"
                className="mt-5 flex items-center gap-2.5"
              >
                {socialLinks.map(({ label, href, viewBox, path }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow RentPro on ${label}`}
                      title={label}
                      className={socialButtonClass}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox={viewBox}
                        fill="currentColor"
                        className="size-[18px]"
                      >
                        <path d={path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#051433]/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <p className="font-sans text-[13.5px] leading-6 text-white/60">
            © 2026 RentPro. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2">
            {legalLinks.map((link, index) => (
              <li key={link.label} className="flex items-center gap-3.5">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-px bg-[#FF6B00]/50"
                  />
                ) : null}
                <Link
                  href={link.href}
                  className="font-sans text-[13.5px] leading-6 text-white/65 transition-colors duration-200 outline-none hover:text-[#FF9A4D] focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-[#FF6B00]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#051433]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
