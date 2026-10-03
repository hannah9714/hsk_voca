import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#7567df",
        tabBarInactiveTintColor: "#999999",

        tabBarStyle: {
          height: 85,
          paddingTop: 8,
          paddingBottom: 22,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#eeeeee",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      {/* 단어장 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "단어장",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 귀뚫기 게임 */}
      <Tabs.Screen
        name="listening_game"
        options={{
          title: "리스닝 게임",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="headset-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
