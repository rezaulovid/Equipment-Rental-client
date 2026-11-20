import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react"

import { ContactForm } from "@/components/contact/ContactForm"
import { RevealSection } from "@/components/home/reveal-section"
import { SectionHeading } from "@/components/home/section-heading"
import { CONTACT_INFO } from "@/lib/contact-info"

type SupportCard = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  href?: string
  external?: boolean
}

const supportCards: SupportCard[] = [
  {
    title: "Email support",
    value: CONTACT_INFO.email,
    description: "Send us the details and we'll reply within one business day.",
    icon: Mail,
    href: `mailto:${CONTACT_INFO.email}`,
  },
  {
    title: "Phone support",
    value: CONTACT_INFO.phone,
    description: "Call us during business hours for quick questions.",
    icon: Phone,
    href: CONTACT_INFO.phoneHref,
  },
  {
    title: "Office location",
    value: CONTACT_INFO.address,
    description: "Uttara, Dhaka — open a map for directions.",
    icon: MapPin,
    href: CONTACT_INFO.mapHref,
    external: true,
  },
  {
    title: "Business hours",
    value: CONTACT_INFO.hours,
    description: "Closed on Fridays and public holidays.",
    icon: Clock,
  },
]

export function ContactContent() {
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
                "radial-gradient(ellipse at 25% 30%, black, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 25% 30%, black, transparent 78%)",
            }}
          />
          <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-[#123B7A]/50 blur-3xl" />
          <div className="absolute -right-44 -bottom-52 size-[580px] rounded-full bg-[#FF6B00]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20 lg:pb-20">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#FF6B00]" />
              <p className="text-[11px] font-semibold tracking-[0.3em] text-[#FF6B00] sm:text-xs">
                CONTACT RENTPRO
              </p>
            </div>

            <h1 className="font-display text-[38px] leading-[1.08] font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px]">
              Let&apos;s talk about your next{" "}
              <span className="text-[#FF6B00]">rental.</span>
            </h1>

            <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
              Questions about equipment, availability, bookings, or payments?
              Send us a message and our team will get back to you with clear,
              helpful answers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white transition-colors duration-200 outline-none hover:border-white/40 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 text-[#FF9A4D]"
                  strokeWidth={2.3}
                />
                {CONTACT_INFO.email}
              </a>

              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.06] px-5 text-sm font-semibold text-white transition-colors duration-200 outline-none hover:border-white/40 hover:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
              >
                <Phone
                  aria-hidden="true"
                  className="size-4 text-[#FF9A4D]"
                  strokeWidth={2.3}
                />
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact details + form */}
      <section
        aria-labelledby="contact-info-heading"
        className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-10 lg:px-10">
          <RevealSection>
            <div>
              <SectionHeading
                id="contact-info-heading"
                title="Contact Information"
                subtitle="Reach the right team through the channel that suits you best."
              />

              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {supportCards.map(
                  ({ title, value, description, icon: Icon, href, external }) => (
                    <li key={title} className="min-w-0">
                      <div className="flex h-full gap-4 rounded-2xl border border-[#E4EAF3] bg-white p-5 shadow-[0_14px_32px_-30px_rgba(7,29,73,0.5)] transition duration-300 hover:-translate-y-0.5 hover:border-[#FF6B00]/30 hover:shadow-[0_20px_36px_-28px_rgba(7,29,73,0.45)]">
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1E5] text-[#FF6B00]">
                          <Icon
                            aria-hidden="true"
                            className="size-5"
                            strokeWidth={2.1}
                          />
                        </span>

                        <div className="min-w-0">
                          <h3 className="font-display text-sm leading-5 font-semibold text-[#071D49]">
                            {title}
                          </h3>

                          {href ? (
                            <a
                              href={href}
                              target={external ? "_blank" : undefined}
                              rel={
                                external ? "noopener noreferrer" : undefined
                              }
                              className="mt-1 block rounded-sm text-sm leading-6 font-medium break-words text-[#071D49] underline-offset-2 transition-colors outline-none hover:text-[#FF6B00] hover:underline focus-visible:ring-2 focus-visible:ring-[#FF6B00]/40"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm leading-6 font-medium text-[#071D49]">
                              {value}
                            </p>
                          )}

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {description}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                )}
              </ul>

              <div className="relative isolate mt-4 overflow-hidden rounded-2xl bg-[#071D49] p-5 text-white shadow-[0_18px_40px_-30px_rgba(7,29,73,0.8)]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-[#FF6B00]/15 blur-2xl"
                />

                <div className="relative flex items-start gap-3.5">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6B00] text-white">
                    <Sparkles
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={2.1}
                    />
                  </span>

                  <div>
                    <p className="font-display text-sm font-semibold text-white">
                      Not sure which equipment fits your project?
                    </p>
                    <p className="mt-1.5 font-sans text-xs leading-5 text-white/70">
                      Browse the catalog to compare options, or ask us in the
                      form — we are happy to point you in the right direction.
                    </p>
                    <Link
                      href="/equipment"
                      className="group mt-3 inline-flex items-center gap-1.5 rounded-sm text-xs font-semibold text-[#FF9A4D] transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      Explore the catalog
                      <ArrowRight
                        aria-hidden="true"
                        strokeWidth={2.5}
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          <RevealSection>
            <div
              id="contact-form"
              className="rounded-[28px] border border-[#E4E9F2] bg-white p-5 shadow-[0_28px_64px_-42px_rgba(7,29,73,0.55)] sm:p-7 lg:p-8"
            >
              <header>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-[#FF6B00] uppercase">
                  Send a message
                </p>
                <h2 className="mt-1.5 font-display text-2xl leading-tight font-bold tracking-[-0.01em] text-[#071D49] sm:text-3xl">
                  How can we help?
                </h2>
                <p className="mt-2 font-sans text-sm leading-6 text-slate-500">
                  Fill in the form below and our team will get back to you as
                  soon as possible.
                </p>
              </header>

              <ContactForm />
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  )
}
