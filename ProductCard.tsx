import { Button } from "@/components/ui/button";
import type { Product } from "./products";

export function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <article className="flex h-full flex-col bg-latte p-3 sm:p-4">
      <div className="flex aspect-[3/4] items-center justify-center overflow-hidden bg-background">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="mt-3 text-sm font-bold text-espresso sm:text-[15px]">{product.name}</h3>
      <p className="mt-0.5 min-h-[2.2em] text-[11px] leading-tight text-latte-ink sm:text-xs">
        {product.description}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="pl-1 text-sm font-bold text-espresso sm:text-base">{product.price}</span>
        <Button
          variant="cart"
          size="sm"
          className="h-7 px-4 text-[11px] sm:w-[58%] sm:text-xs"
          onClick={() => onAdd(product)}
        >
          to cart
        </Button>
      </div>
    </article>
  );
}
