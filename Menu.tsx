import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { categories, rowOne, rowTwo, type Product } from "./products";

function rotate<T>(list: T[], by: number) {
  const n = list.length;
  const k = ((by % n) + n) % n;
  return [...list.slice(k), ...list.slice(0, k)];
}

function ProductRow({ products, onAdd }: { products: Product[]; onAdd: (p: Product) => void }) {
  const [offset, setOffset] = useState(0);
  const shown = rotate(products, offset);
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 sm:gap-4">
      <Button
        variant="arrow"
        size="icon"
        aria-label="Previous drinks"
        onClick={() => setOffset((o) => o - 1)}
        className="[&_svg]:size-7 sm:[&_svg]:size-10"
      >
        <ChevronLeft strokeWidth={1.2} />
      </Button>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {shown.map((p) => (
          <ProductCard key={p.name} product={p} onAdd={onAdd} />
        ))}
      </div>
      <Button
        variant="arrow"
        size="icon"
        aria-label="Next drinks"
        onClick={() => setOffset((o) => o + 1)}
        className="[&_svg]:size-7 sm:[&_svg]:size-10"
      >
        <ChevronRight strokeWidth={1.2} />
      </Button>
    </div>
  );
}

export function Menu() {
  const [active, setActive] = useState(categories[0]);
  const [count, setCount] = useState(0);

  const add = (p: Product) => {
    setCount((c) => c + 1);
    toast.success(`${p.name} added to your basket`, { description: p.price });
  };

  return (
    <section id="menu" className="mx-auto max-w-[1240px] px-3 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-24">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 px-2 sm:px-16">
        <div className="min-w-0">
          <h2 className="font-heavy text-4xl leading-none text-espresso sm:text-6xl">Menu</h2>
          <p className="ml-[4.2em] mt-1 font-script text-xl italic leading-none text-caramel-soft sm:text-3xl">
            drinks
          </p>
        </div>
        <Button variant="caramel" className="h-10 px-5 text-sm sm:h-12 sm:px-8 sm:text-lg">
          my basket{count > 0 ? ` (${count})` : ""}
        </Button>
      </div>

      <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto px-2 sm:mt-14 sm:flex-wrap sm:justify-center sm:gap-4 sm:overflow-visible">
        {categories.map((c) => (
          <Button
            key={c}
            variant="pill"
            data-active={active === c}
            onClick={() => setActive(c)}
            className="h-9 shrink-0 px-5 text-sm sm:h-11 sm:px-7 sm:text-[15px]"
          >
            {c}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-12 sm:mt-8 sm:space-y-20">
        <ProductRow products={rowOne} onAdd={add} />
        <ProductRow products={rowTwo} onAdd={add} />
      </div>

      <div className="mt-6 flex justify-center sm:mt-8">
        <Button variant="caramel" className="h-9 px-7 text-base sm:h-10 sm:px-8 sm:text-lg">
          More
        </Button>
      </div>
    </section>
  );
}
