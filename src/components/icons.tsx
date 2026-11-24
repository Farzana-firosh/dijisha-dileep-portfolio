import {
  ArrowDown as LArrowDown,
  ArrowUpRight as LArrowUpRight,
  Bug as LBug,
  Check as LCheck,
  Copy as LCopy,
  Download as LDownload,
  Mail as LMail,
  MessageCircle,
  Phone as LPhone,
  ScanSearch,
  SendHorizontal,
  Sparkles,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { SVGProps } from "react";
import { siGit, siGitlab, siPostman, siSelenium, type SimpleIcon } from "simple-icons";

type IconProps = SVGProps<SVGSVGElement>;

// Interface icons come from lucide, wrapped so they stay decorative by default and share one stroke weight
const icon = (I: LucideIcon) =>
  function Icon(p: IconProps) {
    return <I aria-hidden strokeWidth={1.75} {...(p as LucideProps)} />;
  };

export const ArrowUpRight = icon(LArrowUpRight);
export const ArrowDown = icon(LArrowDown);
export const Download = icon(LDownload);
export const Copy = icon(LCopy);
export const Check = icon(LCheck);
export const Cross = icon(X);
export const Send = icon(SendHorizontal);
export const Lens = icon(ScanSearch);
export const Bug = icon(LBug);
export const Spark = icon(Sparkles);
export const Mail = icon(LMail);
export const Phone = icon(LPhone);
export const Chat = icon(MessageCircle);
export const WhatsApp = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.2-3.6.94.96-3.5-.23-.36a9.47 9.47 0 0 1-1.45-5.05c0-5.23 4.26-9.5 9.5-9.5a9.44 9.44 0 0 1 6.72 2.79 9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.26 9.5-9.48 9.5Zm8.08-17.58A11.35 11.35 0 0 0 12.05.5C5.76.5.64 5.62.64 11.92c0 2.01.53 3.97 1.53 5.7L.54 23.5l6.03-1.58a11.38 11.38 0 0 0 5.47 1.4h.01c6.29 0 11.41-5.12 11.41-11.42 0-3.05-1.19-5.92-3.34-8.08Z" />
  </svg>
);

/** Not in simple-icons (brand removed), so drawn inline. */
export const LinkedIn = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

function Brand({ icon, ...p }: IconProps & { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d={icon.path} />
    </svg>
  );
}

export const tools = {
  Selenium: siSelenium,
  Postman: siPostman,
  Git: siGit,
  GitLab: siGitlab,
} satisfies Record<string, SimpleIcon>;

export function ToolLogo({ name, ...p }: IconProps & { name: keyof typeof tools }) {
  return <Brand icon={tools[name]} {...p} />;
}
