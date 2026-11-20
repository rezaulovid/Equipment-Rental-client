import type { Metadata } from "next"

import { AboutContent } from "@/components/about/AboutContent"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "About Us | RentPro",
  description:
    "Learn how RentPro makes equipment rental simple, accessible, and reliable for individuals, contractors, and businesses.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        <AboutContent />
      </main>
    </div>
  )
}
