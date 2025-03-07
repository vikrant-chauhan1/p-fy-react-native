import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createTables, getEarnings, getExpenses } from "../../db/database";

const HomeScreen = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    const setupDB = async () => {
      try {
        await createTables();
        loadData();
      } catch (error) {
        console.error("Database setup error:", error);
      }
    };

    setupDB();
  }, []);

  const loadData = async () => {
    try {
      const earnings = await getEarnings();
      const expenses = await getExpenses();
      setTotalEarnings(
        earnings.reduce((sum, earning) => sum + (earning.amount ?? 0), 0)
      );
      setTotalExpenses(
        expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0)
      );
      setRecentExpenses(expenses.slice(-20));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  return (
    <LinearGradient colors={["#4facfe", "#00f2fe"]} style={styles.container}>
      <Text style={styles.heading}>Finance Summary</Text>
      
      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>💰 Earnings: ₹{totalEarnings}</Text>
        <Text style={styles.summaryText}>💸 Expenses: ₹{totalExpenses}</Text>
        <Text style={styles.savingsText}>🏦 Savings: ₹{totalEarnings - totalExpenses}</Text>
      </View>

      <Text style={styles.subHeading}>Recent Expenses</Text>

      {recentExpenses.length > 0 ? (
        <FlatList
          data={recentExpenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseAmount}>₹{item.amount}</Text>
              <Text style={styles.expenseCategory}>{item.category}</Text>
              <Text style={styles.expenseDescription}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noExpenses}>No recent expenses recorded.</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 15,
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  savingsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  expenseItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2980b9",
  },
  expenseDescription: {
    fontSize: 14,
    color: "#555",
  },
  noExpenses: {
    textAlign: "center",
    color: "white",
  },
});

export default HomeScreen;
