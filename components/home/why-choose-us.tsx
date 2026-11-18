import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  CalendarClock,
  LockKeyhole,
} from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"

interface Benefit {
  title: string
  description: string
  icon: LucideIcon
}

const benefits: Benefit[] = [
  {
    title: "Affordable Prices",
    description: "Fair daily and weekly rates with no hidden fees.",
    icon: BadgeDollarSign,
  },
  {
    title: "Verified Owners",
    description: "Every owner and listing is checked before going live.",
    icon: BadgeCheck,
  },
  {
    title: "Flexible Rental Period",
    description: "Book by the day, week, or month to match your project.",
    icon: CalendarClock,
  },
  {
    title: "Secure Payments",
    description: "Protected checkout and transparent refund policies.",
    icon: LockKeyhole,
  },
]

export function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-us-heading"
      className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-[28px] border border-[#DCE7F5] bg-[linear-gradient(115deg,#EAF2FC_0%,#F5F9FE_52%,#E7F0FB_100%)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-[#FF6B00]/[0.06] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-20 size-72 rounded-full bg-[#1B4A96]/[0.07] blur-3xl"
          />

          <div className="relative grid gap-8 lg:grid-cols-[0.95fr_2.05fr] lg:items-center lg:gap-10">
            <div>
              <SectionHeading
                id="why-choose-us-heading"
                title="Why Choose Us?"
                subtitle="We provide reliable, affordable, and hassle-free rentals for every project."
              />

              <Link
                href="/about"
                className="group mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#071D49] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 outline-none hover:bg-[#0C2B63] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
              >
                Learn More
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={2.4}
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {benefits.map(({ title, description, icon: Icon }) => (
                <li key={title} className="min-w-0">
                  <div className="flex h-full flex-col rounded-2xl border border-white bg-white/95 p-5 shadow-[0_14px_32px_-28px_rgba(7,29,73,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/30 hover:shadow-[0_22px_38px_-26px_rgba(7,29,73,0.5)]">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#FF6B00]">
                      <Icon
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={2.1}
                      />
                    </span>

                    <h3 className="mt-4 font-display text-sm leading-5 font-semibold text-[#071D49]">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
