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
import { addExpenses, getExpenses, deleteExpense, createTables } from "../../db/database"
import ExpenseCar from "../../assets/images/ExpenseCar.png"

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
      setExpensesList(expenses)
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
      setShowImage(true) // Show image when expense is added
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

            {/* Display the image only when an expense is added */}
            {showImage && <Image source={ExpenseCar} style={styles.image} />}
          </View>

          <FlatList
            data={expensesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>
                  {item.category}: ₹{item.amount.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => handleDeleteExpense(item.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            nestedScrollEnabled={true} // ✅ Allows FlatList to work inside ScrollView
            scrollEnabled={false} // ✅ Prevents FlatList from scrolling separately
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  picker: {
    height: 50,
    width: "100%",
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
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  expenseText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff5a5f",
    padding: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default ExpensesScreen
