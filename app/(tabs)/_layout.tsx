import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Icons for the tabs

export default function TabLayout() {
  return (
    <Tabs>
      {/* Summary Page (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Summary",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Earnings Page */}
      <Tabs.Screen
        name="Earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Expenses Page */}
      <Tabs.Screen
        name="Expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
