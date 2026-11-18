import Image from "next/image"
import type { LucideIcon } from "lucide-react"
import { CalendarCheck, PackageCheck, Search, Wrench } from "lucide-react"

import { SectionHeading } from "@/components/home/section-heading"

interface Step {
  title: string
  description: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    title: "Search & Choose",
    description: "Find the right equipment by category, location, and price.",
    icon: Search,
  },
  {
    title: "Book Online",
    description: "Choose your dates and confirm the booking in minutes.",
    icon: CalendarCheck,
  },
  {
    title: "Pick Up",
    description: "Collect your gear or arrange delivery with the owner.",
    icon: PackageCheck,
  },
  {
    title: "Start Working",
    description: "Get the job done and return everything when you are ready.",
    icon: Wrench,
  },
]

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="how-it-works-heading"
          align="center"
          title="How It Works"
          subtitle="Get started in just a few simple steps."
        />

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <ol className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <li key={title} className="min-w-0">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-[#E4EAF3] bg-white p-5 shadow-[0_14px_32px_-30px_rgba(7,29,73,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/35 hover:shadow-[0_22px_38px_-28px_rgba(7,29,73,0.45)] sm:p-6">
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-5 font-display text-3xl font-bold text-[#EEF3FA] transition-colors duration-300 group-hover:text-[#FFF1E5]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FFF1E5] text-[#FF6B00] transition-colors duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                    <Icon
                      aria-hidden="true"
                      className="size-[22px]"
                      strokeWidth={2.1}
                    />
                  </span>

                  <p className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-[#FF6B00] uppercase">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg leading-6 font-semibold text-[#071D49]">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="relative isolate min-h-[300px] overflow-hidden rounded-2xl bg-[#071D49] lg:min-h-full">
            <Image
              src="/images/how-it-works-construction.jpg"
              alt="Construction crew working together on a building site"
              fill
              sizes="(min-width: 1024px) 420px, 92vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#051433] via-[#051433]/45 to-[#051433]/10"
            />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <span
                aria-hidden="true"
                className="mb-3 block h-[3px] w-9 rounded-full bg-[#FF6B00]"
              />
              <p className="font-display text-xl leading-snug font-semibold text-balance text-white sm:text-2xl">
                Make Your Work Easier with{" "}
                <span className="text-[#FF9A4D]">RentPro</span>
              </p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">
                Professional-grade equipment, ready when your project is.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
