import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { addExpenses, getExpenses, deleteExpense, createTables } from "../../db/database"

const ExpensesScreen = () => {
  const [expensesList, setExpensesList] = useState<any[]>([])
  const [amount, setAmount] = useState<string>("")
  const [category, setCategory] = useState<string>("Compulsory")
  const [description, setDescription] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<number>(0)

  useEffect(() => {
    createTables()
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const expenses = await getExpenses()
      setExpensesList(expenses)
      calculateTotalExpenses(expenses)
    } catch (error) {
      console.error("Error loading expenses:", error)
    }
  }

  const handleAddExpenses = async () => {
    if (!amount || isNaN(Number.parseFloat(amount))) {
      alert("Please enter a valid amount")
      return
    }
    if (!category || (category !== "Compulsory" && category !== "Miscellaneous")) {
      alert("Invalid category selected")
      return
    }

    try {
      await addExpenses(Number.parseFloat(amount), category, description)
      setAmount("")
      setDescription("")
      setCategory("Compulsory")
      loadExpenses()
    } catch (error) {
      console.error("Failed to add expenses:", error)
    }
  }

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpense(id)
      loadExpenses()
    } catch (error) {
      console.error("Failed to delete expense:", error)
    }
  }

  const calculateTotalExpenses = (expensesData: any[]) => {
    const total = expensesData.reduce((sum, expense) => sum + (expense.amount ?? 0), 0)
    setTotalExpenses(total)
  }

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No expenses recorded yet</Text>
      <Text style={styles.emptySubText}>Add your first expense above</Text>
    </View>
  )

  const getCategoryColor = (categoryType: string) => {
    return categoryType === "Compulsory" ? "#e57373" : "#81c784"
  }

  return (
   
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          
          {/* Wrap everything inside ScrollView */}
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Expenses</Text>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Expenses</Text>
                <Text style={styles.totalAmount}>{formatCurrency(totalExpenses)}</Text>
              </View>
            </View>
    
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={styles.input}
                placeholderTextColor="#999"
              />
    
              <TextInput
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                placeholderTextColor="#999"
              />
    
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#666"
                >
                  <Picker.Item label="Compulsory" value="Compulsory" />
                  <Picker.Item label="Miscellaneous" value="Miscellaneous" />
                </Picker>
              </View>
    
              <TouchableOpacity style={styles.addButton} onPress={handleAddExpenses} activeOpacity={0.8}>
                <Text style={styles.addButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
    
            <View style={styles.listContainer}>
              <View style={styles.listHeader}>
                <Text style={[styles.columnHeader, styles.amountColumn]}>Amount</Text>
                <Text style={[styles.columnHeader, styles.categoryColumn]}>Category</Text>
                <Text style={[styles.columnHeader, styles.descriptionColumn]}>Description</Text>
                <Text style={[styles.columnHeader, styles.actionColumn]}>Action</Text>
              </View>
    
              <FlatList
                data={expensesList}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <Text style={[styles.itemText, styles.amountColumn, styles.amountText]}>
                      ₹{item.amount}
                    </Text>
                    <View style={[styles.categoryColumn]}>
                      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + "20" }]}>
                        <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                          {item.category === "Compulsory"?"C":item.category==="Miscellaneous"?"M" :"R"}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.itemText, styles.descriptionColumn]} numberOfLines={1} ellipsizeMode="tail">
                      {item.description || "—"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteExpense(item.id)}
                      style={styles.actionColumn}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <View style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={expensesList.length === 0 ? { flex: 1 } : {}}
                nestedScrollEnabled={true} // ✅ Allows FlatList to work inside ScrollView
                scrollEnabled={false} // ✅ Prevents FlatList from scrolling separately
              />
            </View>
          </ScrollView>
    
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#d32f2f",
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  addButton: {
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    marginBottom: 8,
  },
  columnHeader: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  amountColumn: {
    flex: 1,
  },
  categoryColumn: {
    flex: 1.2,
  },
  descriptionColumn: {
    flex: 1.8,
  },
  actionColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
  },
  amountText: {
    fontWeight: "600",
    color: "#d32f2f",
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#d32f2f",
    fontSize: 13,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#757575",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9e9e9e",
  },
})

export default ExpensesScreen
