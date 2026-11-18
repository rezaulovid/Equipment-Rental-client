import Link from "next/link"
import { ArrowRight, Rocket } from "lucide-react"

export function ReadyToRent() {
  return (
    <section
      aria-labelledby="ready-to-rent-heading"
      className="bg-[#F8FAFC] py-10 sm:py-14 lg:py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#071D49] px-6 py-8 shadow-[0_24px_50px_-30px_rgba(7,29,73,0.8)] sm:px-9 sm:py-9 lg:px-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,#0C2B63_0%,#071D49_55%,#051433_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full border-[24px] border-white/[0.04]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-32 -bottom-28 size-56 rounded-full bg-[#FF6B00]/[0.08] blur-3xl"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 sm:items-center">
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#FF6B00] text-white shadow-[0_12px_28px_-12px_rgba(255,107,0,0.9)]">
                <Rocket
                  aria-hidden="true"
                  className="size-7"
                  strokeWidth={2.1}
                />
              </span>

              <div>
                <h2
                  id="ready-to-rent-heading"
                  className="font-display text-xl leading-tight font-bold tracking-[-0.01em] text-balance text-white sm:text-2xl lg:text-[28px]"
                >
                  Ready to Rent? Let’s Get Started!
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70 sm:text-[15px]">
                  Find the perfect equipment for your next project and book it
                  in minutes.
                </p>
              </div>
            </div>

            <Link
              href="/equipment"
              className="group inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.85)] transition-colors duration-200 outline-none hover:bg-[#E85F00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49] sm:w-auto"
            >
              Browse Equipment
              <ArrowRight
                aria-hidden="true"
                strokeWidth={2.4}
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
