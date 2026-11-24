/** Small physical props shared by the hero, About collage and the skills board. Decorative only. */

export function BinderClip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden>
      <path d="M17 26 L22 3 M47 26 L42 3" fill="none" stroke="#c9ced6" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M22 3 Q32 -1 42 3" fill="none" stroke="#e8ebef" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 24 H58 L52 52 H12 Z" fill="#16181c" />
      <path d="M8 26 H56" stroke="#4a4f57" strokeWidth="2" />
    </svg>
  );
}

/** The site's bug, drawn once; faces right. */
export function BugGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 44" className={className} aria-hidden>
      <g className="bug-legs" stroke="#121418" strokeWidth="2.2" strokeLinecap="round">
        <path d="M20 28 13 37M28 30 27 40M36 28 42 37M20 20 12 15M36 20 44 15" />
      </g>
      <ellipse cx="28" cy="24" rx="14" ry="10.5" fill="#ff5a47" stroke="#121418" strokeWidth="2" />
      <path d="M28 14v20" stroke="#121418" strokeWidth="1.6" />
      <circle cx="22" cy="21" r="2.2" fill="#121418" />
      <circle cx="33" cy="27" r="2.2" fill="#121418" />
      <circle cx="44" cy="22" r="6" fill="#121418" />
      <path d="M48 18l5-5M49 23l6-1" stroke="#121418" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="46" cy="20.5" r="1.1" fill="#fff" />
    </svg>
  );
}

export function Tape({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden className={`tape ${className}`} style={style} />;
}

export function Pin({ className = "", id }: { className?: string; id?: string }) {
  return <span aria-hidden data-pin={id} className={`pin ${className}`} />;
}
