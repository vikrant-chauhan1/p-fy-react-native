import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createTables } from "../../db/database";

const App = () => {
  useEffect(() => {
    const setupDB = async () => {
      try {
        await createTables(); 
        console.log("Database initialized successfully!");
      } catch (error) {
        console.error("Error setting up the database:", error);
      }
    };

    setupDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Personal Finance App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", 
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white", 
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
