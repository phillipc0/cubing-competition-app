import { Linking, Pressable, View } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { siteConfig } from "lib/constants";
import { useColorScheme } from "lib/useColorScheme";
import { Text } from "components/ui/text";
import { ThemeToggle } from "components/ThemeToggle";
import { GithubIcon } from "lib/icons/Github";
import { Logo } from "lib/icons/Logo";

export function Navbar({ options, navigation }: NativeStackHeaderProps) {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="border-b border-border bg-background"
    >
      <View className="h-16 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-4">
          {canGoBack && (
            <Pressable onPress={() => navigation.goBack()}>
              <Text className="text-primary text-lg">{"<"}</Text>
            </Pressable>
          )}
          <Link href="/" asChild>
            <Pressable className="flex-row items-center gap-2">
              <Logo />
              <Text className="font-bold">{siteConfig.name}</Text>
            </Pressable>
          </Link>
        </View>
        <Text className="absolute left-0 right-0 text-center font-semibold text-lg w-full -z-10">
          {options.title}
        </Text>
        <View className="flex-row items-center gap-4">
          <Pressable onPress={() => Linking.openURL(siteConfig.links.github)}>
            <GithubIcon className="text-foreground" />
          </Pressable>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
}
