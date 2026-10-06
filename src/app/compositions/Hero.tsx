"use client"

import {useLocation} from "../hooks/useLocation"

function locationLabel(state: ReturnType<typeof useLocation>): string {
  if (state.status === "ready") return state.location.label
  if (state.status === "locating") return "…"
  return "sua cidade"
}

/** Draft home hero — copy and layout still subject to change. */
const Hero = () => {
  const locationState = useLocation()
  const location = locationLabel(locationState)

  return (
    <section className="relative h-screen max-h-hero w-full bg-primary-gradient">
      <div className="absolute inset-0 z-0 flex h-full w-full items-center justify-center px-6">
        <p
          className="max-w-2xl text-center text-2xl leading-snug text-white md:text-3xl"
          aria-live="polite"
        >
          seu próximo momento inesquecível em{" "}
          <span className="font-bold">{location}</span> começa aqui
        </p>
      </div>
    </section>
  )
}

export default Hero
