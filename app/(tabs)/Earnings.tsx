import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { addEarnings, getEarnings, createTables } from "../../db/database";

const EarningsScreen=()=>{
  const [amount,setAmount]=useState<string>("");
  const [description,setDescription]= useState<string>("");
  const [earningsList,setEarningsList]=useState<any[]>([]);
  const [totalEarnings,setTotalEarnings]=useState<number>(0)

  useEffect(()=> {
    createTables(); //ensuring the tables are created if they don't exist already
    loadEarnings(); //laoding the existing earnings
    

  },[]);

  const loadEarnings = async()=>{
    try {
      const earnings = await getEarnings();
      console.log(earnings);
      setEarningsList(earnings);
      GetTotalEarnings(earnings);
    } catch (error) {
      console.error("error laoding earnings : ",error)
      
    }
  };

  const handleAddEarnings= async()=>{
    await addEarnings(parseFloat(amount),description)
    setAmount("");
    setDescription("");
    loadEarnings();
  };
  const GetTotalEarnings= async(earningsData :any[])=>{
    if (!Array.isArray(earningsData) || earningsData.length === 0) {
      setTotalEarnings(0);
      return;
    }
    const total =earningsData.reduce((sum,earning)=>sum+(earning.amount | 0),0);
    setTotalEarnings(total)
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>
        Total Earnings: ₹{totalEarnings}
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
      <Button title="Add Earnings" onPress={handleAddEarnings} />

      <FlatList
        data={earningsList}
        keyExtractor={(item) => item.id?.toString() } // Prevent crashes if `id` is undefined
        renderItem={({ item }) => (
        <Text>{item.amount ?? "N/A"} - {item.description ?? "No Description"}</Text>
        )}
      />

    </View>
  );
}
export default EarningsScreen;;