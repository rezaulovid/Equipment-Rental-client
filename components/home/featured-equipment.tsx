import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, MapPin, Star, Tag } from "lucide-react"

import { featuredEquipment } from "@/lib/data/homepage"
import { FavoriteButton } from "@/components/home/favorite-button"
import { SectionHeading } from "@/components/home/section-heading"
import { cn } from "@/lib/utils"

const priceFormatter = new Intl.NumberFormat("en-US")

export function FeaturedEquipment() {
  return (
    <section
      aria-labelledby="featured-equipment-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-equipment-heading"
            title="Featured Equipment"
            subtitle="Top-rated and most rented equipment, ready for your next project."
          />

          <Link
            href="/equipment"
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#071D49] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 outline-none hover:bg-[#0C2B63] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 sm:self-auto"
          >
            View All
            <ArrowRight
              aria-hidden="true"
              strokeWidth={2.4}
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {featuredEquipment.map((equipment) => {
            const isAvailable = equipment.availability === "available"

            return (
              <li key={equipment.id} className="min-w-0">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4EAF3] bg-white shadow-[0_16px_36px_-30px_rgba(7,29,73,0.55)] transition duration-300 hover:-translate-y-1 hover:border-[#D8E2F0] hover:shadow-[0_26px_46px_-28px_rgba(7,29,73,0.5)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EEF3FA]">
                    <Image
                      src={equipment.image}
                      alt={equipment.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 384px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 92vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    <FavoriteButton equipmentName={equipment.name} />

                    <span
                      className={cn(
                        "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm",
                        isAvailable ? "bg-[#16A34A]" : "bg-[#64748B]"
                      )}
                    >
                      {isAvailable ? (
                        <Check
                          aria-hidden="true"
                          className="size-3"
                          strokeWidth={3}
                        />
                      ) : null}
                      {isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg leading-6 font-semibold text-[#071D49] transition-colors group-hover:text-[#FF6B00]">
                      {equipment.name}
                    </h3>

                    <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-md bg-[#FFF4EA] px-2 py-1 text-[11px] font-medium text-[#D95F00]">
                      <Tag
                        aria-hidden="true"
                        className="size-3"
                        strokeWidth={2.2}
                      />
                      {equipment.category}
                    </span>

                    <div className="mt-3 flex items-center gap-1.5 text-xs">
                      <Star
                        aria-hidden="true"
                        className="size-3.5 fill-[#F59E0B] text-[#F59E0B]"
                      />
                      <span className="font-semibold text-[#071D49]">
                        {equipment.rating.toFixed(1)}
                      </span>
                      <span className="text-slate-500">
                        ({equipment.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-[#FF6B00]"
                        strokeWidth={2.2}
                      />
                      {equipment.location}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#EEF2F8] pt-4">
                      <p className="flex items-baseline gap-1">
                        <span className="font-display text-xl leading-none font-bold text-[#071D49]">
                          ৳{priceFormatter.format(equipment.price)}
                        </span>
                        <span className="text-xs text-slate-500">
                          /{equipment.rentalPeriod}
                        </span>
                      </p>

                      <Link
                        href={`/equipment/${equipment.slug}`}
                        aria-label={`View details for ${equipment.name}`}
                        className="group/button inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#071D49] px-4 text-xs font-semibold text-white transition-colors duration-200 outline-none hover:bg-[#FF6B00] focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2"
                      >
                        View Details
                        <ArrowRight
                          aria-hidden="true"
                          strokeWidth={2.4}
                          className="size-3.5 transition-transform duration-200 group-hover/button:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
