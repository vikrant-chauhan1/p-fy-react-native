import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createTables, getEarnings, getExpenses } from "../../db/database";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = width * 0.85;

type Expense = {
  id: number;
  amount: number;
  category: string;
  description: string;
  time?: string;
};

const HomeScreen = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState("summary");

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
      const expenses = (await getExpenses()) as Expense[];
      setTotalEarnings(
        earnings.reduce((sum, earning) => sum + (earning.amount ?? 0), 0)
      );
      setTotalExpenses(
        expenses.reduce((sum: number, expense: any) => sum + (expense.amount ?? 0), 0)
      );
      const sortedRecentExpenses = Array.isArray(expenses) ? expenses.sort((a: any, b: any) => b.id - a.id) : [];
      setRecentExpenses(sortedRecentExpenses.slice(0, 20)); // Limit to 5 most recent
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === "Compulsory") {
      return <FontAwesome5 name="home" size={18} color="#ff5a5f" />;
    } else {
      return <MaterialCommunityIcons name="shopping-outline" size={20} color="#4a90e2" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString("en-IN");
  };

  const savingsPercentage = totalEarnings > 0 
    ? Math.round((totalEarnings - totalExpenses) / totalEarnings * 100) 
    : 0;

  return (
    <LinearGradient 
      colors={["#4158D0", "#C850C0", "#FFCC70"]} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }} 
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Dashboard</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "summary" && styles.activeTab]} 
            onPress={() => setActiveTab("summary")}
          >
            <Text style={[styles.tabText, activeTab === "summary" && styles.activeTabText]}>Summary</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "expenses" && styles.activeTab]} 
            onPress={() => setActiveTab("expenses")}
          >
            <Text style={[styles.tabText, activeTab === "expenses" && styles.activeTabText]}>Expenses</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === "summary" ? (
          <>
            <View style={styles.balanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <MaterialCommunityIcons name="wallet-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.balanceAmount}>{formatCurrency(totalEarnings - totalExpenses)}</Text>
              <View style={styles.savingsContainer}>
                <View style={styles.savingsBar}>
                  <View style={[styles.savingsFill, { width: `${savingsPercentage}%` }]} />
                </View>
                <Text style={styles.savingsPercentage}>{savingsPercentage}% saved</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={[styles.statCard, styles.incomeCard]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="arrow-down-circle" size={24} color="#4CAF50" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Income</Text>
                  <Text style={styles.statAmount}>{formatCurrency(totalEarnings)}</Text>
                </View>
              </View>
              
              <View style={[styles.statCard, styles.expenseCard]}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="arrow-up-circle" size={24} color="#F44336" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Expenses</Text>
                  <Text style={styles.statAmount}>{formatCurrency(totalExpenses)}</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.recentExpensesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            
          </View>

          {recentExpenses.length > 0 ? (
            <FlatList
              data={recentExpenses}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.expenseItem}>
                  <View style={styles.expenseIconContainer}>
                    {getCategoryIcon(item.category)}
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseDescription} numberOfLines={1}>
                      {item.description}
                    </Text>
                    <View style={styles.expenseMetaRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                      </View>
                      {item.time && <Text style={styles.expenseDate}>{item.time}</Text>}
                    </View>
                  </View>
                  <Text style={styles.expenseAmount}>-{formatCurrency(item.amount)}</Text>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="receipt" size={50} color="rgba(255,255,255,0.5)" />
              <Text style={styles.noExpenses}>No recent expenses recorded</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    padding: 5,
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#4158D0",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  balanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    backdropFilter: "blur(10px)",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  balanceAmount: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 15,
  },
  savingsContainer: {
    marginTop: 5,
  },
  savingsBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  savingsFill: {
    height: "100%",
    backgroundColor: "#FFCC70",
    borderRadius: 3,
  },
  savingsPercentage: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  statIconContainer: {
    marginRight: 12,
  },
  statLabel: {
    color: "#666",
    fontSize: 14,
  },
  statAmount: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  recentExpensesContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    minHeight: 300,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    color: "#4158D0",
    fontWeight: "600",
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  expenseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  expenseMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
  },
  expenseDate: {
    fontSize: 12,
    color: "#999",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F44336",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  noExpenses: {
    marginTop: 10,
    color: "#999",
    fontSize: 16,
  },
});

export default HomeScreen;
