import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import { useColorScheme } from "nativewind";
import { Text } from "./text";
import { cn } from "lib/utils";

interface SpinnerProps {
  label?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ label, className }) => {
  const { colorScheme } = useColorScheme();

  return (
    <View
      className={cn("flex-col items-center justify-center gap-2", className)}
    >
      <ActivityIndicator
        size="large"
        color={colorScheme === "dark" ? "white" : "black"}
      />
      {label && <Text className="text-muted-foreground">{label}</Text>}
    </View>
  );
};

export { Spinner };
