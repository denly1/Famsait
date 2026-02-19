export default function MarqueeText({ text }: { text: string }) {
  return (
    <div className="relative overflow-hidden bg-black border-y border-border py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="mx-8 text-2xl sm:text-3xl font-bold tracking-tight text-white/20"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
