import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { createTables, getEarnings, getExpenses } from "../../db/database";

const HomeScreen = () => {
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  useEffect(() => {
    const setupDB = async () => {
      try {
        await createTables();
        console.log("Database initialized successfully!");
        loadData();
      } catch (error) {
        console.error("Error setting up the database:", error);
      }
    };

    setupDB();
  }, [2]);

  const loadData = async () => {
    try {
      const earnings = await getEarnings();
      const expenses  = await getExpenses();
      
      const totalEarnings = Array.isArray(earnings)
       ? earnings.reduce((sum, earning) => sum + (earning.amount ?? 0), 0)
      : 0;

      const totalExpenses = Array.isArray(expenses)
        ? expenses.reduce((sum, expense) => sum + (expense.amount ?? 0), 0)
      : 0;

      setTotalEarnings(totalEarnings);
      setTotalExpenses(totalExpenses);



      
    } catch (error) {
      console.error("Error loading financial data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal Finance Summary</Text>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>💰 Total Earnings: ₹{totalEarnings}</Text>
        <Text style={styles.summaryText}>💸 Total Expenses: ₹{totalExpenses}</Text>
        <Text style={styles.summaryText}>
          🏦 Savings: ₹{totalEarnings - totalExpenses}
        </Text>
      </View>

      <Text style={styles.subHeading}>Last 20 Expenses:</Text>

      {recentExpenses.length > 0 ? (
        <FlatList
          data={recentExpenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text>₹{item.amount} - {item.category}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noExpenses}>No expenses recorded yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  summaryBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  expenseItem: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },
  noExpenses: {
    textAlign: "center",
    color: "gray",
  },
});

export default HomeScreen;
