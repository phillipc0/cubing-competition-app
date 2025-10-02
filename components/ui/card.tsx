import * as React from "react";
import {
  Pressable,
  PressableProps,
  Text,
  TextProps,
  View,
  ViewProps,
} from "react-native";
import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const Card = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  PressableProps
>(({ className, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm shadow-foreground/10 active:opacity-80",
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

function CardHeader({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <View
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return (
    <Text
      role="heading"
      aria-level={3}
      className={cn(
        "text-2xl text-card-foreground font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: TextProps & {
  ref?: React.RefObject<Text>;
}) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View className={cn("p-6 pt-0", className)} {...props} />
    </TextClassContext.Provider>
  );
}

const CardBody = React.forwardRef<View, ViewProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  ),
);
CardBody.displayName = "CardBody";

function CardFooter({
  className,
  ...props
}: ViewProps & {
  ref?: React.RefObject<View>;
}) {
  return (
    <View
      className={cn("flex flex-row items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardBody,
};
