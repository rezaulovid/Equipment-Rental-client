import type { EquipmentCategory } from "@/lib/types/equipment"

export const popularCategories: EquipmentCategory[] = [
  {
    id: "agriculture",
    slug: "agriculture",
    name: "Agriculture Equipment",
    description: "Farm tools, tractors, and more.",
    itemCount: 1,
    image: "/images/categories/agriculture.jpg",
    imageAlt: "Golden wheat field ready for harvest",
  },
  {
    id: "cleaning",
    slug: "cleaning",
    name: "Cleaning Equipment",
    description: "Industrial cleaning machines and tools.",
    itemCount: 2,
    image: "/images/equipment/cleaning-equipment.jpg",
    imageAlt: "Worker cleaning a bright window",
  },
  {
    id: "construction",
    slug: "construction",
    name: "Construction Equipment",
    description: "Heavy machines, tools, and more.",
    itemCount: 3,
    image: "/images/equipment/excavator-machine.jpg",
    imageAlt: "Excavators working on a construction site",
  },
  {
    id: "electronics",
    slug: "electronics",
    name: "Electronics",
    description: "Audio, monitoring, and tech tools.",
    itemCount: 1,
    image: "/images/categories/electronics.jpg",
    imageAlt: "Laptop, headphones, and smart devices on a desk",
  },
  {
    id: "event",
    slug: "event",
    name: "Event Equipment",
    description: "Stage, sound, and lighting gear.",
    itemCount: 2,
    image: "/images/categories/event.jpg",
    imageAlt: "Live event stage with colourful lighting",
  },
]
