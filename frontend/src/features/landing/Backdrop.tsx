/** Fixed colour mist behind every light section, so glass cards always have colour to refract. */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#f4f7f9]">
      <div className="absolute -top-[25%] -left-[20%] size-[70vmax] bg-[radial-gradient(closest-side,rgb(156_195_220/0.4),transparent)] md:animate-drift" />
      <div className="absolute top-[25%] -right-[25%] size-[65vmax] bg-[radial-gradient(closest-side,rgb(50_83_107/0.16),transparent)] md:animate-drift [animation-delay:-9s]" />
      <div className="absolute -bottom-[30%] left-[15%] size-[60vmax] bg-[radial-gradient(closest-side,rgb(139_196_116/0.18),transparent)] md:animate-drift [animation-delay:-18s]" />
      <div className="noise absolute inset-0 opacity-[0.04] mix-blend-overlay" />
    </div>
  );
}
