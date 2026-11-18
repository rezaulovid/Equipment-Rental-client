import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071D49] text-white">
      {/* Background texture and brand shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 35% 35%, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 35% 35%, black, transparent 78%)",
          }}
        />
        <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-[#123B7A]/50 blur-3xl" />
        <div className="absolute -right-64 -bottom-[560px] size-[900px] rounded-full bg-[#0C2B63]" />
        <div className="absolute -right-48 -bottom-[500px] size-[760px] rounded-full bg-[#FF6B00]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] items-center gap-12 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pt-20 lg:pb-24">
        {/* Copy */}
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#FF6B00]" />
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#FF6B00] sm:text-xs">
              RENT &middot; USE &middot; RETURN
            </p>
          </div>

          <h1 className="text-[40px] leading-[1.06] font-bold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px] xl:text-[64px]">
            Rent the Right Equipment,{" "}
            <span className="text-[#FF6B00]">Anytime!</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            Find and rent high-quality equipment for your projects, events, and
            business needs.
          </p>

          <div className="mt-8">
            <Link
              href="/equipment"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_-14px_rgba(255,107,0,0.9)] transition-colors hover:bg-[#E85F00] sm:h-[52px] sm:px-7 sm:text-base"
            >
              Browse All Equipment
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 sm:size-5" />
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-2" aria-hidden="true">
            <span className="h-2 w-8 rounded-full bg-[#FF6B00]" />
            <span className="size-2 rounded-full bg-white/30" />
            <span className="size-2 rounded-full bg-white/30" />
          </div>
        </div>

        {/* Equipment visual */}
        <div className="relative mx-auto w-full max-w-[560px] lg:mr-0 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[36px] bg-gradient-to-tr from-[#FF6B00]/25 via-transparent to-transparent blur-2xl"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] shadow-[0_32px_90px_-24px_rgba(0,0,0,0.75)] ring-1 ring-white/15 sm:rounded-[26px]">
            <Image
              src="/images/hero-equipment.jpg"
              alt="Yellow excavator available for rent"
              fill
              priority
              sizes="(min-width: 1440px) 640px, (min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071D49]/45 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg sm:-bottom-5 sm:left-6">
            <span className="size-2 rounded-full bg-[#22C55E]" />
            <p className="text-xs font-semibold text-[#071D49] sm:text-sm">
              500+ verified rentals
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
