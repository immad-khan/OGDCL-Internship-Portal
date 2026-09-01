import { cn, initials, avatarGradient } from "@/lib/utils";

const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-24 w-24 text-3xl",
} as const;

export function Avatar({
  name,
  size = "md",
  className,
  ring = true,
}: {
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        avatarGradient(name),
        sizes[size],
        ring && "ring-2 ring-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
