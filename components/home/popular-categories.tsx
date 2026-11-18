import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { popularCategories } from "@/lib/data/homepage"
import { SectionHeading } from "@/components/home/section-heading"

export function PopularCategories() {
  return (
    <section
      aria-labelledby="popular-categories-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="popular-categories-heading"
          align="center"
          title="Popular Categories"
          subtitle="Explore verified equipment categories from our live rental catalog."
        />

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {popularCategories.map((category) => (
            <li key={category.id} className="min-w-0">
              <Link
                href={`/equipment?category=${category.slug}`}
                className="group relative flex h-full min-h-[208px] flex-col items-center rounded-2xl border border-[#E4EAF3] bg-white px-4 pt-12 pb-5 text-center shadow-[0_14px_30px_-26px_rgba(7,29,73,0.45)] transition duration-300 outline-none hover:-translate-y-1 hover:border-[#FF6B00]/40 hover:shadow-[0_24px_38px_-26px_rgba(7,29,73,0.55)] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8FAFC]"
              >
                <span className="absolute top-0 left-1/2 size-[72px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full bg-[#EEF3FA] shadow-[0_8px_20px_-10px_rgba(7,29,73,0.55)] ring-4 ring-white">
                  <Image
                    src={category.image}
                    alt={category.imageAlt}
                    width={144}
                    height={144}
                    sizes="72px"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>

                <span
                  aria-hidden="true"
                  className="absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-[#F1F5FB] text-[#071D49] opacity-0 transition duration-300 group-hover:bg-[#FFF1E5] group-hover:text-[#FF6B00] group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                </span>

                <h3 className="font-display text-[15px] leading-5 font-semibold text-[#071D49] transition-colors group-hover:text-[#FF6B00]">
                  {category.name}
                </h3>

                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                  {category.description}
                </p>

                <span className="mt-auto inline-flex items-center rounded-full bg-[#FFF1E5] px-3 py-1 text-[11px] font-semibold text-[#D95F00]">
                  {category.itemCount}{" "}
                  {category.itemCount === 1 ? "item" : "items"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
