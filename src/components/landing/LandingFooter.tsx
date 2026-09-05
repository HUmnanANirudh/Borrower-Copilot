import Link from "next/link";
import { ArrowRight01Icon } from "@/components/icons";

export function LandingFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#5769e7] text-white">
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-12">
        <div className="min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex flex-col items-center text-center pt-24 sm:pt-28 lg:pt-32">
          <h2
            className="
              font-display
              text-[46px]
              sm:text-[64px]
              lg:text-[76px]
              font-normal
              leading-[0.9]
              tracking-[-0.045em]
              text-white
              max-w-[900px]
              uppercase
            "
          >
            KNOW BEFORE YOU BORROW
          </h2>

          {/* CTA */}
          <Link
            href="/assess"
            className="
              group
              mt-10
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#242424]
              px-6
              py-3
              text-[15px]
              font-medium
              text-white
              shadow-[0_5px_18px_rgba(0,0,0,0.18)]
              transition-all
              duration-200
              hover:bg-[#111111]
              hover:-translate-y-0.5
              active:translate-y-0
            "
          >
            <span>Start my assessment</span>

            <ArrowRight01Icon
              className="
                h-4 w-4
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>

      {/* Giant background brand */}
      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-[240px]
          sm:h-[300px]
          lg:h-[350px]
          overflow-hidden
          flex
          items-end
          justify-center
          pointer-events-none
          select-none
        "
      >
        <span
          className="
            absolute
            bottom-[-12px]
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            font-display
            text-[125px]
            sm:text-[210px]
            lg:text-[280px]
            font-bold
            leading-[0.7]
            tracking-[-0.065em]
            uppercase
            text-white/[0.13]
          "
        >
          BORROWIQ
        </span>
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[55%]
            bg-gradient-to-b
            from-transparent
            via-[#5769e7]/60
            to-[#5769e7]
          "
        />
      </div>
    </footer>
  );
}
