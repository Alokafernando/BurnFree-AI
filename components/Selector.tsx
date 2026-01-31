import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface NumberSelectorProps {
  label: string;
  min: number;
  max: number;
  value: number | null;
  onSelect: (value: number) => void;
  activeColor?: string; // Single color for the active state
  emojis?: string[];
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  label,
  min,
  max,
  value,
  onSelect,
  activeColor = "bg-teal-500",
  emojis,
}) => {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-end mb-3 px-1">
        <Text className="text-gray-900 text-lg font-bold">{label}</Text>
        {value && (
          <Text className="text-teal-600 font-bold text-sm">Selected: {value}</Text>
        )}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 4, paddingRight: 20 }}
      >
        {numbers.map((num, idx) => {
          const isSelected = value === num;
          return (
            <TouchableOpacity
              key={num}
              onPress={() => onSelect(num)}
              activeOpacity={0.7}
              className={`mr-3 w-14 h-14 rounded-2xl items-center justify-center shadow-sm 
                ${isSelected ? activeColor : "bg-white border border-gray-100"}`}
            >
              <Text className={`font-bold text-lg ${isSelected ? "text-white" : "text-gray-500"}`}>
                {emojis?.[idx] || num}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NumberSelector;