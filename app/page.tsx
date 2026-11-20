import { Banner } from "@/components/banner"
import { CustomerReviews } from "@/components/home/customer-reviews"
import { FeaturedEquipment } from "@/components/home/featured-equipment"
import { HowItWorks } from "@/components/home/how-it-works"
import { PopularCategories } from "@/components/home/popular-categories"
import { RevealSection } from "@/components/home/reveal-section"
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
        <RevealSection>
          <FeaturedEquipment />
        </RevealSection>
        <RevealSection>
          <WhyChooseUs />
        </RevealSection>
        <RevealSection>
          <HowItWorks />
        </RevealSection>
        <RevealSection>
          <CustomerReviews />
        </RevealSection>
        <RevealSection>
          <ReadyToRent />
        </RevealSection>
      </main>
    </div>
  )
}
