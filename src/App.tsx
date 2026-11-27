import { Hero } from "@/components/drinko/Hero";
import { NewDrink } from "@/components/drinko/NewDrink";
import { Menu } from "@/components/drinko/Menu";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <main className="relative z-10">
        <Hero />
        <NewDrink />
        <Menu />
      </main>
      <Toaster position="bottom-right" theme="light" richColors />
    </div>
  );
}
