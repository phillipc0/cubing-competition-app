import { Pressable } from "react-native";
import { useColorScheme } from "lib/useColorScheme";
import { Sun } from "lib/icons/Sun";
import { MoonStar } from "lib/icons/MoonStar";

export function ThemeToggle() {
  const { isDark, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="h-10 w-10 items-center justify-center rounded-lg active:opacity-70"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <MoonStar className="text-foreground" size={22} />
      ) : (
        <Sun className="text-foreground" size={22} />
      )}
    </Pressable>
  );
}
