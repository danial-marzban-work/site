import { Heart, ShoppingBasket, User } from "lucide-react";
import hero from "@/assets/hero-iced-coffee.webp";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-latte">
      <img
        src={hero}
        alt="Iced coffee with whipped cream on a stone block"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_60%]"
        width={1536}
        height={1024}
      />

      {/* Navbar */}
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 pt-5 sm:px-[2.7vw] sm:pt-[1.8vw]">
        <a href="/" className="font-heavy text-xl text-cream sm:text-[clamp(1.25rem,2vw,2rem)]">
          Drinko
        </a>
        <nav className="flex justify-center gap-3 text-[12px] text-cream sm:gap-[4.4vw] sm:text-[clamp(0.8rem,1.1vw,1.05rem)]">
          <a href="#" className="transition-opacity hover:opacity-80">
            Home
          </a>
          <a href="#menu" className="transition-opacity hover:opacity-80">
            Menu
          </a>
          <a href="#new-drink" className="transition-opacity hover:opacity-80">
            Delivery
          </a>
        </nav>
        <div className="flex items-center gap-3 text-cream sm:gap-[1.6vw]">
          <button aria-label="Favorites" className="transition-opacity hover:opacity-80">
            <Heart className="size-4 sm:size-[clamp(1rem,1.4vw,1.4rem)]" strokeWidth={1.8} />
          </button>
          <button aria-label="Account" className="transition-opacity hover:opacity-80">
            <User className="size-4 sm:size-[clamp(1rem,1.4vw,1.4rem)]" strokeWidth={1.8} />
          </button>
          <a href="#menu" aria-label="Basket" className="transition-opacity hover:opacity-80">
            <ShoppingBasket className="size-4 sm:size-[clamp(1rem,1.4vw,1.4rem)]" strokeWidth={1.8} />
          </a>
        </div>
      </header>

      {/* Headline around the cup */}
      <div className="relative h-[max(26rem,60.5vw)] sm:h-[60.5vw] sm:max-h-[56rem]">
        <h1 className="absolute inset-x-0 top-[52%] flex items-center justify-center gap-[30vw] sm:gap-[23vw] px-[3vw] font-wide uppercase leading-none text-cream sm:top-[49%]">
          <span className="text-[6.2vw] sm:text-[min(6.6vw,6.5rem)]">Order</span>
          <span className="relative text-[6.2vw] sm:text-[min(6.6vw,6.5rem)]">
            Coffee
            <span className="absolute right-0 top-[95%] font-script text-[0.42em] font-normal normal-case italic tracking-normal">
              Welcome
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
