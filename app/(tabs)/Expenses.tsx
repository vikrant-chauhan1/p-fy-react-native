import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { addExpenses, getExpenses, createTables } from "../../db/database";
import { Picker } from "@react-native-picker/picker";



const ExpensesScreen=()=>{
  const [expensesList,setExpensesList]= useState<any[]>([]);
  const[amount,setAmount] = useState<string>("");
  const [category,setCategory]= useState<string>("Compulsory");
  const [description,setDescription]= useState<string>("");
  const[totalExpenses,setTotalExpenses]= useState<number>(0)
  useEffect(()=>{
    createTables(); //ensuring the tables are made
    loadExpenses();
  },[]);

  const loadExpenses= async()=>{

    try {
      const expenses = await getExpenses();
      
      setExpensesList(expenses);
      getTotalExpense(expenses);
    } catch (error) {
      console.error("Error loading expenses at expense page",error);

      
    }

  }

  const handleAddExpenses = async()=>{
    if (!amount || isNaN(parseFloat(amount))) {
      console.error("Invalid amount: ", amount);
      alert("Please enter a valid amount");
      return;
    }
    if (!category || (category !== "Compulsory" && category !== "Miscellaneous")) {
      alert("Invalid category selected");
      return;
    }
  
    console.log("Adding expense with:", { amount, category, description });

    try {
      await addExpenses(parseFloat(amount),category,description);
      setAmount("");
      setDescription("");
      setCategory("Compulsory")
      console.log("expense added successfully")
      loadExpenses();
    } catch (error) {
      console.error("Failed to add expenses from expense page",error)
      throw error
    }

  }

  const getTotalExpense = async(expensesData : any[])=>{
   const total= expensesData.reduce((sum,expense)=>
    sum+(expense.amount?? 0),0 );
   setTotalExpenses(total);
   
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
        Total Expenses: ₹{totalExpenses}
      </Text>

      <TextInput
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={{
          borderWidth: 1,
          marginBottom: 10,
        }}
      >
        <Picker.Item label="Compulsory" value="Compulsory" />
        <Picker.Item label="Miscellaneous" value="Miscellaneous" />
      </Picker>

      <Button title="Add Expense" onPress={handleAddExpenses} />

      <FlatList
        data={expensesList}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <Text>
            {item.amount ?? "N/A"} - {item.category ?? "No Category"} -{" "}
            {item.description ?? "No Description"}
          </Text>
        )}
      />
    </View>
  );
}
export default ExpensesScreen;