"use client"

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
  Image,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { MaterialIcons } from "@expo/vector-icons"
import { addExpenses, getExpenses, deleteExpense, createTables } from "../../db/database"
import expenseCatCrying from "../../assets/images/expenseCatCrying.png"

const ExpensesScreen = () => {
  const [expensesList, setExpensesList] = useState<any[]>([])
  const [amount, setAmount] = useState<string>("")
  const [category, setCategory] = useState<string>("Compulsory")
  const [description, setDescription] = useState<string>("")
  const [totalExpenses, setTotalExpenses] = useState<number>(0)
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    createTables()
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const expenses = await getExpenses()
      const sortedExpenses = Array.isArray(expenses) ? expenses.sort((a: any, b: any) => b.id - a.id) : []
      setExpensesList(sortedExpenses)
      calculateTotalExpenses(expenses)
    } catch (error) {
      console.error("Error loading expenses:", error)
    }
  }

  const calculateTotalExpenses = (expenses: any[]) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    setTotalExpenses(total)
  }

  const handleAddExpenses = async () => {
    if (!amount || !description || isNaN(Number.parseFloat(amount))) {
      alert("Please enter a valid amount and description")
      return
    }
    if (!category || (category !== "Compulsory" && category !== "Miscellaneous" && category !== "Food" && category !=="Grocery")) {
      alert("Invalid category selected")
      return
    }

    try {
      await addExpenses(Number.parseFloat(amount), category, description)
      setAmount("")
      setDescription("")
      setCategory("Compulsory")
      setShowImage(true)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Expenses</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Expenses</Text>
              <Text style={styles.totalAmount}>{`₹${totalExpenses.toFixed(2)}`}</Text>
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
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              placeholderTextColor="#999"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                
              >
                <Picker.Item label="Compulsory" value="Compulsory" />
                <Picker.Item label="Miscellaneous" value="Miscellaneous" />
                <Picker.Item label="Food" value="Food" />
                <Picker.Item label="Grocery" value="Grocery" />
              </Picker>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddExpenses} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>

            {showImage && <Image source={expenseCatCrying} style={styles.image} />}
          </View>

          {/* Improved Expense List UI */}
          <View style={styles.expenseListHeader}>
            <Text style={[styles.columnHeader, { flex: 0.3 }]}>Amount</Text>
            <Text style={[styles.columnHeader, { flex: 0.55 }]}>Details & Date</Text>
            <Text style={[styles.columnHeader, { flex: 0.15 }]}>Action</Text>
          </View>
          <FlatList
            data={expensesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.expenseItem,
                  item.category === "Compulsory" ? styles.compulsoryExpense : styles.miscExpense,
                ]}
              >
                <View style={styles.amountSection}>
                  <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.expenseDescription} numberOfLines={1} ellipsizeMode="tail">
                    {item.description}
                  </Text>
                  <View style={styles.metaDataRow}>
                    <View style={styles.categoryBadge}>
                      <Text >{item.category}</Text>
                    </View>
                    <Text style={styles.expenseTime}>{new Date(item.date).toLocaleDateString()}</Text>

                  </View>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(item.id)}>
                  <MaterialIcons name="delete" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            nestedScrollEnabled={true}
            scrollEnabled={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  totalContainer: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5a5f",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#ff5a5f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseListHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 8,
  },
  columnHeader: {
    fontWeight: "bold",
    color: "#666",
    fontSize: 14,
  },
  expenseItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  compulsoryExpense: {
    borderLeftWidth: 4,
    borderLeftColor: "#ff5a5f",
  },
  miscExpense: {
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2",
  },
  amountSection: {
    flex: 0.3,
    justifyContent: "center",
  },
  detailsSection: {
    flex: 0.55,
    justifyContent: "center",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  expenseDescription: {
    fontSize: 15,
    marginBottom: 4,
    color: "#333",
  },
  expenseTime: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#ff5a5f",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
  },
  metaDataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
})

export default ExpensesScreen

