/** Renders a translated `{accent}` template with the highlighted words wrapped (word order differs per language). */
export function Accent({ text, accent, className }: { text: string; accent: string; className: string }) {
  const [before, after = ""] = text.split("{accent}");
  return (
    <>
      {before}
      <span className={className}>{accent}</span>
      {after}
    </>
  );
}
