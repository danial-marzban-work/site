import icedLatte from "@/assets/iced-latte-coconut.webp";

const stats = [
  { big: "3", small: "Syrups", sub: "vanilla, caramel, hazelnut", align: "items-start text-left" },
  { big: "With", small: "", sub: "espresso + cold milk + ice", align: "items-center text-center" },
  { big: "20%", small: "", sub: "Sale", align: "items-center text-center" },
];

export function NewDrink() {
  return (
    <section id="new-drink" className="overflow-hidden bg-blush">
      <div className="mx-auto grid max-w-[1440px] gap-0 px-6 pt-12 sm:px-[6vw] lg:grid-cols-[1fr_1fr] lg:gap-0 lg:pt-14">
        <div className="pb-12 lg:pb-16">
          <h2 className="leading-[0.85]">
            <span className="flex items-end gap-3">
              <span className="font-wide text-[clamp(3.2rem,6.2vw,6rem)] text-cream">New</span>
              <span className="mb-[0.6em] font-script text-[clamp(1.1rem,2vw,2rem)] italic text-cream">
                attetion
              </span>
            </span>
            <span className="block font-heavy text-[clamp(4.2rem,9.4vw,9rem)] text-espresso">drink</span>
          </h2>

          <h3 className="mt-8 text-3xl font-bold text-espresso sm:mt-10 sm:text-[2.6rem]">Iced Latte</h3>
          <p className="mt-2 max-w-[21rem] text-xs font-medium leading-snug text-espresso sm:text-[13px]">
            A refreshing coffee drink made with espresso, cold milk, and ice. It has a smooth, light flavor,
            balancing the strength of espresso with the creaminess of milk. Perfect for hot days or when you
            want a cool, energizing coffee without being too strong.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 sm:mt-14">
            {stats.map((s) => (
              <div key={s.big} className={`flex flex-col ${s.align}`}>
                <p className="text-3xl font-bold leading-none text-espresso sm:text-[2.6rem]">
                  {s.big}
                  {s.small && <span className="ml-1.5 text-base sm:text-xl">{s.small}</span>}
                </p>
                <p className="mt-1.5 max-w-[9rem] text-xs font-semibold leading-tight text-blush-ink sm:text-base">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-end justify-center lg:justify-end">
          <div className="absolute left-0 top-[38%] z-10 text-left sm:left-[2%] lg:left-[6%]">
            <p className="font-wide text-[clamp(2.2rem,4.4vw,4.2rem)] leading-none text-espresso">6.50$</p>
            <p className="mt-1 pl-[0.8em] font-wide text-[clamp(1rem,2vw,1.9rem)] leading-none text-espresso/60 line-through decoration-2">
              7.80$
            </p>
          </div>
          <img
            src={icedLatte}
            alt="Iced latte with coconut"
            loading="lazy"
            width={768}
            height={1152}
            className="relative -mb-2 ml-[30%] w-[min(70%,26rem)] lg:ml-0 lg:mr-[2vw] lg:w-[min(80%,28rem)]"
          />
        </div>
      </div>
    </section>
  );
}
