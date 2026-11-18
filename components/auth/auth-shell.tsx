import Image from "next/image"
import Link from "next/link"

type AuthShellProps = {
  heading: React.ReactNode
  description: string
  children: React.ReactNode
}

export function AuthShell({ heading, description, children }: AuthShellProps) {
  return (
    <main className="relative isolate flex w-full flex-1 items-center justify-center overflow-hidden bg-[#EDF2F9] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Page background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c4d0e1 1px, transparent 0)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black, transparent 78%)",
          }}
        />
        <div className="absolute -top-32 -left-24 size-[420px] rounded-full bg-[#FF6B00]/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-32 size-[460px] rounded-full bg-[#071D49]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[1180px] overflow-hidden rounded-[24px] bg-[#071D49] shadow-[0_44px_110px_-46px_rgba(7,29,73,0.75)] ring-1 ring-[#071D49]/10 sm:rounded-[30px] lg:rounded-[34px]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          {/* Brand panel */}
          <section className="relative isolate overflow-hidden px-6 py-7 text-white sm:px-8 lg:flex lg:min-h-[664px] lg:flex-col lg:px-11 lg:py-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-[#FF6B00]/20 blur-2xl lg:hidden"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_0%_0%,#10346F_0%,#071D49_55%,#051433_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[58%] overflow-hidden">
                <Image
                  src="/images/hero-equipment.jpg"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 560px, 0px"
                  className="object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071D49] via-[#071D49]/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#071D49]/85 via-[#071D49]/20 to-transparent" />
              </div>
              <div className="absolute -right-20 -bottom-24 size-64 rounded-full border-[24px] border-white/[0.05]" />
              <div className="absolute top-1/3 -left-16 size-40 rounded-full bg-[#FF6B00]/10 blur-3xl" />
            </div>

            <Link
              href="/"
              aria-label="RentPro home"
              className="relative z-10 inline-flex w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071D49]"
            >
              <Image
                src="/images/rentpro-logo-light.png"
                alt="RentPro — Rent Smart. Work Better."
                width={534}
                height={140}
                priority
                className="h-auto w-[172px] sm:w-[190px]"
              />
            </Link>

            <div className="relative z-10 mt-6 sm:mt-8 lg:my-auto lg:mt-auto">
              <span
                aria-hidden="true"
                className="block h-[3px] w-14 rounded-full bg-[#FF6B00]"
              />
              <p className="mt-5 max-w-[360px] font-display text-[30px] leading-[1.12] font-bold tracking-[-0.02em] text-balance sm:text-[34px] lg:text-[40px]">
                {heading}
              </p>
              <p className="mt-4 max-w-[330px] text-sm leading-6 text-white/70 sm:text-[15px]">
                {description}
              </p>
            </div>
          </section>

          {/* Form panel */}
          <div className="relative p-2 sm:p-3">
            <div className="relative overflow-hidden rounded-[20px] bg-white px-5 py-8 sm:rounded-[24px] sm:px-8 sm:py-10 lg:min-h-[640px] lg:rounded-[26px] lg:px-10 lg:py-11">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 size-52 rounded-full bg-[#FF6B00]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-28 -left-24 size-52 rounded-full bg-[#FF6B00]/15"
              />
              <div className="relative">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
