import * as React from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { cn } from "lib/utils";
import { Text } from "./text";

interface InputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  isClearable?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  (
    { className, label, icon, isClearable, value, onChangeText, ...props },
    ref,
  ) => {
    const hasValue = value && value.length > 0;

    return (
      <View className={cn("w-full", className)}>
        {label && <Text className="mb-2 text-base font-medium">{label}</Text>}
        <View className="relative flex-row items-center">
          {icon && <View className="absolute left-3 z-10">{icon}</View>}
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            className={cn(
              "flex-1 h-12 rounded-lg border border-input bg-background px-3 text-base text-foreground",
              icon ? "pl-10" : "pl-4",
              isClearable && hasValue ? "pr-10" : "pr-4",
            )}
            placeholderTextColor="hsl(var(--muted-foreground))"
            {...props}
          />
          {isClearable && hasValue && (
            <Pressable
              onPress={() => onChangeText?.("")}
              className="absolute right-3 z-10"
            >
              <Text className="text-muted-foreground">✕</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  },
);
Input.displayName = "Input";

export { Input };
