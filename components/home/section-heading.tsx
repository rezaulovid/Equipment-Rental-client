import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  id?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  id,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center"

  return (
    <div
      className={cn(
        "flex flex-col",
        centered && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-[3px] w-8 shrink-0 rounded-full bg-[#FF6B00]"
        />
        <h2
          id={id}
          className="font-display text-[26px] leading-tight font-bold tracking-[-0.02em] text-[#071D49] sm:text-3xl lg:text-4xl"
        >
          {title}
        </h2>
        {centered ? (
          <span
            aria-hidden="true"
            className="h-[3px] w-8 shrink-0 rounded-full bg-[#FF6B00]"
          />
        ) : null}
      </div>

      {subtitle ? (
        <p
          className={cn(
            "mt-3 text-sm leading-6 text-slate-500 sm:text-base",
            centered ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
