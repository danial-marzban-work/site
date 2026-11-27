import { Heart, ShoppingBasket, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scene } from "@/three/Scene";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <Scene />

      {/* Navbar */}
      <header className="relative z-10 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 pt-5 sm:px-[2.7vw] sm:pt-[1.8vw]">
        <a href="/" className="font-serif text-2xl italic tracking-tight text-espresso sm:text-[clamp(1.5rem,2.2vw,2.2rem)]">
          Drinko
        </a>
        <nav className="flex justify-center gap-5 text-[11px] uppercase tracking-[0.28em] text-espresso/70 sm:gap-[3.4vw] sm:text-[clamp(0.68rem,0.85vw,0.82rem)]">
          <a href="#" className="transition-opacity hover:opacity-60">
            Home
          </a>
          <a href="#menu" className="transition-opacity hover:opacity-60">
            Menu
          </a>
          <a href="#new-drink" className="transition-opacity hover:opacity-60">
            Delivery
          </a>
        </nav>
        <div className="flex items-center gap-3 text-espresso sm:gap-[1.4vw]">
          <button aria-label="Favorites" className="transition-opacity hover:opacity-60">
            <Heart className="size-4 sm:size-[clamp(1rem,1.3vw,1.3rem)]" strokeWidth={1.5} />
          </button>
          <button aria-label="Account" className="transition-opacity hover:opacity-60">
            <User className="size-4 sm:size-[clamp(1rem,1.3vw,1.3rem)]" strokeWidth={1.5} />
          </button>
          <a href="#menu" aria-label="Basket" className="transition-opacity hover:opacity-60">
            <ShoppingBasket
              className="size-4 sm:size-[clamp(1rem,1.3vw,1.3rem)]"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </header>

      {/* Headline + actions, anchored left so the mug owns the right half */}
      <div className="relative z-10 flex flex-1 items-center px-5 pb-20 sm:px-[2.7vw] sm:pb-[5vw]">
        <div className="max-w-[21rem] sm:max-w-[30rem] lg:max-w-[36rem]">
          <p className="text-[10px] uppercase tracking-[0.42em] text-espresso/55 sm:text-[11px]">
            Specialty coffee
          </p>

          <h1 className="mt-4 font-serif text-[clamp(3.6rem,13vw,5.5rem)] font-light leading-[0.86] text-espresso sm:mt-5 sm:text-[clamp(4.5rem,8.5vw,7rem)]">
            <span className="block">Order</span>
            <span className="relative block italic">
              Coffee
              <span className="absolute -right-1 top-[64%] font-script text-[0.3em] font-normal italic tracking-normal text-caramel sm:-right-6">
                Welcome
              </span>
            </span>
          </h1>

          <p className="mt-5 max-w-[20rem] text-sm leading-relaxed text-espresso/70 sm:mt-7 sm:max-w-[24rem] sm:text-base">
            Espresso, cold milk and ice — poured slowly, served cold.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
            <Button
              asChild
              variant="caramel"
              className="h-11 rounded-full bg-espresso px-7 font-serif text-base tracking-wide text-cream shadow-[0_18px_40px_-18px_rgba(58,32,21,0.85)] hover:bg-espresso/90 sm:h-12 sm:px-8 sm:text-lg"
            >
              <a href="#menu">Explore the menu</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-11 rounded-full border border-espresso/25 px-7 font-serif text-base tracking-wide text-espresso hover:bg-espresso/5 hover:text-espresso sm:h-12 sm:px-8 sm:text-lg"
            >
              <a href="#new-drink">New drink</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-5 z-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-espresso/40 sm:left-[2.7vw]">
        <span className="h-px w-10 bg-espresso/25" />
        Scroll
      </div>
    </section>
  );
}
