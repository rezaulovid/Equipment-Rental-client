import { Banner } from "@/components/banner"
import { FeaturedEquipment } from "@/components/home/featured-equipment"
import { HowItWorks } from "@/components/home/how-it-works"
import { PopularCategories } from "@/components/home/popular-categories"
import { ReadyToRent } from "@/components/home/ready-to-rent"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <Banner />
        <PopularCategories />
        <FeaturedEquipment />
        <WhyChooseUs />
        <HowItWorks />
        <ReadyToRent />
      </main>
    </div>
  )
}
