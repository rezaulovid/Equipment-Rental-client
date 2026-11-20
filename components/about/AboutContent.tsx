import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  Building2,
  CalendarCheck2,
  HardHat,
  HeartHandshake,
  Home,
  Rocket,
  Target,
  Telescope,
} from "lucide-react"

import { RevealSection } from "@/components/home/reveal-section"
import { SectionHeading } from "@/components/home/section-heading"

interface Highlight {
  title: string
  description: string
  icon: LucideIcon
}

const audiences: { label: string; icon: LucideIcon }[] = [
  { label: "Individuals", icon: Home },
  { label: "Contractors", icon: HardHat },
  { label: "Businesses", icon: Building2 },
]

const highlights: Highlight[] = [
  {
    title: "Easy Equipment Booking",
    description:
      "Search, compare, and book the equipment you need in a few simple steps.",
    icon: CalendarCheck2,
  },
  {
    title: "Transparent Rental Pricing",
    description:
      "Clear daily, weekly, and monthly rates with no hidden surprises.",
    icon: BadgeDollarSign,
  },
  {
    title: "Reliable Equipment Options",
    description:
      "Browse quality listings from verified owners, ready for your project.",
    icon: BadgeCheck,
  },
  {
    title: "Customer-Focused Service",
    description:
      "Friendly support before, during, and after every rental.",
    icon: HeartHandshake,
  },
]

const values: {
  title: string
  description: string
  icon: LucideIcon
  label: string
}[] = [
  {
    title: "Our Mission",
    label: "Why we exist",
    description:
      "To make equipment rental simple, accessible, and affordable by connecting customers with the equipment they need through a convenient and reliable platform.",
    icon: Target,
  },
  {
    title: "Our Vision",
    label: "Where we are going",
    description:
      "To become a trusted equipment rental platform by providing a seamless rental experience, quality service, transparency, and customer satisfaction.",
    icon: Telescope,
  },
]

export function AboutContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#071D49] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse at 30% 30%, black, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 30% 30%, black, transparent 78%)",
            }}
          />
          <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-[#123B7A]/50 blur-3xl" />
          <div className="absolute -right-40 -bottom-48 size-[560px] rounded-full bg-[#FF6B00]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-10 lg:pt-20 lg:pb-20">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FF6B00]" />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#FF6B00] sm:text-xs">
                ABOUT RENTPRO
              </p>
            </div>

            <h1 className="font-display text-[38px] leading-[1.08] font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px]">
              Equipment rental made{" "}
              <span className="text-[#FF6B00]">simple.</span>
            </h1>

            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
              RentPro helps individuals, contractors, and businesses find and
              rent the equipment they need — conveniently, efficiently, and
              reliably.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/equipment"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_-14px_rgba(255,107,0,0.9)] transition-colors duration-200 outline-none hover:bg-[#E85F00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
              >
                Browse Equipment
                <ArrowRight
                  aria-hidden="true"
                  strokeWidth={2.4}
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors duration-200 outline-none hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mr-0 lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[36px] bg-gradient-to-tr from-[#FF6B00]/25 via-transparent to-transparent blur-2xl"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-white/15 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.75)]">
              <Image
                src="/images/hero-equipment.jpg"
                alt="Excavator and heavy equipment ready for a rental project"
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051433]/90 via-[#051433]/25 to-[#051433]/10" />

              <div className="absolute top-4 left-4 rounded-xl bg-[#051433]/70 px-3 py-2 shadow-sm backdrop-blur">
                <Image
                  src="/images/rentpro-logo-light.png"
                  alt="RentPro"
                  width={534}
                  height={140}
                  className="h-6 w-auto sm:h-7"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span
                  aria-hidden="true"
                  className="block h-[3px] w-9 rounded-full bg-[#FF6B00]"
                />
                <p className="mt-3 font-display text-lg leading-snug font-semibold text-white sm:text-xl">
                  Built for the way you work.
                </p>
                <p className="mt-1 font-sans text-sm leading-6 text-white/70">
                  From weekend projects to full-scale job sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company introduction */}
      <RevealSection>
        <section
          aria-labelledby="about-intro-heading"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:px-10">
            <div className="relative isolate overflow-hidden rounded-[28px] border border-[#E4E9F2] bg-[#F1F5FB] shadow-[0_24px_60px_-38px_rgba(7,29,73,0.55)]">
              <Image
                src="/images/how-it-works-construction.jpg"
                alt="Construction professionals working together with rented equipment"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 480px, 92vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#051433]/80 to-transparent"
              />
              <p className="absolute bottom-5 left-5 font-display text-sm font-semibold text-white sm:bottom-6 sm:left-6">
                Rent Smart. Work Better.
              </p>
            </div>

            <div>
              <SectionHeading
                id="about-intro-heading"
                title="Who We Are"
                subtitle="A simpler way to access the equipment your work depends on."
              />

              <div className="mt-5 space-y-4 font-sans text-[15px] leading-7 text-slate-600">
                <p>
                  RentPro is an equipment rental platform built to make getting
                  the right gear easier. Whether you are a homeowner tackling a
                  weekend project, a contractor planning a large build, or a
                  business that needs equipment without the cost of ownership,
                  RentPro connects you with reliable equipment and
                  straightforward rental terms.
                </p>
                <p>
                  From construction tools and vehicles to event and photography
                  gear, our platform brings listings, availability, and booking
                  together in one convenient place — so you can spend less time
                  searching and more time working.
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2.5">
                {audiences.map(({ label, icon: Icon }) => (
                  <li key={label}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E9F2] bg-[#F8FAFC] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#071D49]">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={2.2}
                        className="size-3.5 text-[#FF6B00]"
                      />
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Mission & vision */}
      <RevealSection>
        <section
          aria-labelledby="about-values-heading"
          className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              id="about-values-heading"
              align="center"
              title="What Drives Us"
              subtitle="Clear principles guide every rental, every conversation, and every improvement we make."
            />

            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:mt-10 lg:gap-6">
              {values.map(({ title, label, description, icon: Icon }) => (
                <article
                  key={title}
                  className="group relative isolate overflow-hidden rounded-[24px] border border-[#E4EAF3] bg-white p-6 shadow-[0_18px_44px_-34px_rgba(7,29,73,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/35 hover:shadow-[0_26px_48px_-30px_rgba(7,29,73,0.45)] sm:p-8"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-12 size-44 rounded-full bg-[#FFF1E5]/70 blur-2xl"
                  />

                  <div className="relative">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#FFF1E5] text-[#FF6B00] transition-colors duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon
                        aria-hidden="true"
                        className="size-6"
                        strokeWidth={2.1}
                      />
                    </span>

                    <p className="mt-5 text-[10px] font-semibold tracking-[0.2em] text-[#FF6B00] uppercase">
                      {label}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl leading-7 font-bold tracking-[-0.01em] text-[#071D49] sm:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-3 font-sans text-[15px] leading-7 text-slate-600">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Why choose RentPro */}
      <RevealSection>
        <section
          aria-labelledby="about-why-heading"
          className="bg-white py-12 sm:py-16 lg:py-20"
        >
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              id="about-why-heading"
              align="center"
              title="Why Choose RentPro?"
              subtitle="A rental experience designed around your time, your budget, and your project."
            />

            <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:mt-10 xl:grid-cols-4">
              {highlights.map(({ title, description, icon: Icon }) => (
                <li key={title} className="min-w-0">
                  <div className="group flex h-full flex-col rounded-2xl border border-[#E4EAF3] bg-white p-5 shadow-[0_14px_32px_-30px_rgba(7,29,73,0.5)] transition duration-300 hover:-translate-y-1 hover:border-[#FF6B00]/35 hover:shadow-[0_22px_38px_-26px_rgba(7,29,73,0.45)] sm:p-6">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#FFF1E5] text-[#FF6B00] transition-colors duration-300 group-hover:bg-[#FF6B00] group-hover:text-white">
                      <Icon
                        aria-hidden="true"
                        className="size-[22px]"
                        strokeWidth={2.1}
                      />
                    </span>

                    <h3 className="mt-4 font-display text-base leading-6 font-semibold text-[#071D49]">
                      {title}
                    </h3>
                    <p className="mt-2 font-sans text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* Closing CTA */}
      <RevealSection>
        <section className="bg-[#F8FAFC] pb-12 sm:pb-16 lg:pb-20">
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
                    <h2 className="font-display text-xl leading-tight font-bold tracking-[-0.01em] text-balance text-white sm:text-2xl lg:text-[28px]">
                      Ready to rent with confidence?
                    </h2>
                    <p className="mt-2 max-w-xl font-sans text-sm leading-6 text-white/70 sm:text-[15px]">
                      Browse the catalog or talk to our team about the right
                      equipment for your next project.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                  <Link
                    href="/equipment"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_-14px_rgba(255,107,0,0.85)] transition-colors duration-200 outline-none hover:bg-[#E85F00] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
                  >
                    Browse Equipment
                    <ArrowRight
                      aria-hidden="true"
                      strokeWidth={2.4}
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white transition-colors duration-200 outline-none hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  )
}
