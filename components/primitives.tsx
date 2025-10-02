import { tv } from "tailwind-variants";

// NOTE: Gradient text is not supported in React Native out-of-the-box.
// The `color` variants have been simplified to use solid colors.
export const title = tv({
  base: "tracking-tight font-semibold",
  variants: {
    color: {
      violet: "text-violet-500",
      yellow: "text-yellow-500",
      blue: "text-blue-500",
      cyan: "text-cyan-500",
      green: "text-green-500",
      pink: "text-pink-500",
      foreground: "text-foreground",
    },
    size: {
      sm: "text-3xl",
      md: "text-4xl",
      lg: "text-5xl",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    size: "md",
    color: "foreground",
  },
});

export const subtitle = tv({
  base: "w-full my-2 text-lg text-muted-foreground",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
