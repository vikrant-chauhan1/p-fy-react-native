import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { addEarnings, getEarnings, createTables, deleteEarning } from "../../db/database";
import ExpenseCar from "../../assets/images/ExpenseCar.png"

const EarningsScreen = () => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [earningsList, setEarningsList] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [showImage, setShowImage] = useState<boolean>(false)

  useEffect(() => {
    createTables();
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const earnings = await getEarnings();
      const sortedEarnings = Array.isArray(earnings)
      ? earnings.sort((a:any,b:any)=>b.id - a.id) : [];
      setEarningsList(sortedEarnings);
      console.log(earnings)
      getTotalEarnings(earnings);
    } catch (error) {
      console.error("Error loading earnings: ", error);
    }
  };

  const handleAddEarnings = async () => {
    if (!amount || !description || isNaN(parseFloat(amount))) {
      Alert.alert("Invalid Input", "Please enter a valid amount and description");
      return;
    }
    try {
      await addEarnings(parseFloat(amount), description);
      setAmount("");
      setDescription("");
      loadEarnings();
      setShowImage(true);
    } catch (error) {
      console.error("Failed to add earnings", error);
    }
  };

  const handleDeleteEarning = async (id: number) => {
    try {
      await deleteEarning(id);
      loadEarnings();
    } catch (error) {
      console.error("Error deleting earning:", error);
    }
  };

  const getTotalEarnings = (earningsData: any[]) => {
    const total = earningsData.reduce((sum, earning) => sum + (earning.amount ?? 0), 0);
    setTotalEarnings(total);
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No earnings added yet.</Text>
      <Text style={styles.emptySubText}>Start adding your earnings to track them.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <KeyboardAvoidingView
        
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Earnings</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Earnings</Text>
              <Text style={styles.totalAmount}>{totalEarnings}</Text>
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
  
            <TouchableOpacity style={styles.addButton} onPress={handleAddEarnings} activeOpacity={0.8}>
              <Text style={styles.addButtonText}>Add Earning</Text>
            </TouchableOpacity>

            {showImage && <Image source={ExpenseCar} style={styles.image} />}
          </View>
          
  
          <View style={styles.listContainer}>
            <FlatList
              data={earningsList}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={[styles.itemText, styles.amountText]}>₹{item.amount}</Text>
                  <Text style={[styles.itemText, styles.descriptionColumn]} numberOfLines={1} ellipsizeMode="tail">
                    {item.description || "—"}
                  </Text>
                  <Text style={[styles.dateColumn]}>{item.date.split(" ")[0]}</Text>
  
                  <TouchableOpacity
                    onPress={() => handleDeleteEarning(item.id)}
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
              contentContainerStyle={earningsList.length === 0 ? { flex: 1 } : {}}
              
              nestedScrollEnabled={true} // ✅ Allows FlatList to work inside ScrollView
              scrollEnabled={false} // ✅ Prevents FlatList from scrolling separately
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    color: "#2e7d32",
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
  addButton: {
    backgroundColor: "#4a6da7",
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
    color: "#2e7d32",
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
  descriptionColumn: {
    flex: 1,
    marginHorizontal: 10,
    color: "#333",
  },
  actionColumn: {
    justifyContent: "center",
    alignItems: "center",
  },
  dateColumn: {
    justifyContent: "center",
    alignItems: "center",
    marginRight:15,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 10,
  },
  
});

export default EarningsScreen;
