import * as React from "react";
import { FlatList, Modal, Pressable, SafeAreaView, View } from "react-native";
import { cn } from "lib/utils";
import { Text } from "./text";
import { Button } from "./button";

interface SelectItemProps {
  label: string;
  value: string;
}

const SelectItem: React.FC<SelectItemProps> = () => {
  // This component is a placeholder for props typing and doesn't render directly.
  return null;
};

interface SelectProps {
  label?: string;
  placeholder?: string;
  children: React.ReactElement<SelectItemProps>[];
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  children,
  selectedValue,
  onValueChange,
  className,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const options = React.Children.map(children, (child) => child.props);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  const handleSelect = (value: string) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View className={cn("w-full", className)}>
      {label && <Text className="mb-2 text-base font-medium">{label}</Text>}
      <Pressable
        onPress={() => setModalVisible(true)}
        className="h-12 w-full flex-row items-center justify-between rounded-lg border border-input bg-background px-4"
      >
        <Text
          className={cn(
            "text-base",
            selectedValue ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selectedLabel}
        </Text>
        <Text className="text-muted-foreground">▼</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-background">
          <View className="p-4">
            <Text className="text-2xl font-bold mb-4">
              {label || "Select an option"}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item.value)}
                  className="p-4 border-b border-border"
                >
                  <Text className="text-lg">{item.label}</Text>
                </Pressable>
              )}
            />
            <Button
              variant="outline"
              onPress={() => setModalVisible(false)}
              className="mt-4"
            >
              <Text>Close</Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export { Select, SelectItem };
