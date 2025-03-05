import * as SQLite from "expo-sqlite";

// Open or create the database
const getDB = async () => {
    return await SQLite.openDatabaseAsync("finance.db");
}

// Function to create the database tables
export const createTables = async () => {
    const db = await getDB();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS earnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                description TEXT,
                date TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                category TEXT CHECK(category IN ('Compulsory', 'Miscellaneous')) NOT NULL,
                description TEXT,
                date TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error; // Optional: depends if you want to propagate the error
    } 
};

export const addEarnings = async (amount: number, description: string) => {
    const db = await getDB();
    try {
        await db.runAsync(
            `INSERT INTO earnings (amount, description) VALUES (?, ?)`,
            [amount, description]
        );
        console.log("Earnings added successfully");
    } catch (error) {
        console.error("Error adding earnings:", error);
        throw error; 
    } 
};

export const getEarnings = async () => {
    const db = await getDB();
    try {
        const results = await db.getAllAsync(`SELECT * FROM earnings;`);
        const formattedResults = results.map((row: any) => ({
            id: row.id,
            amount: row.AMOUNT,  // SQLite returns uppercase keys
            description: row.description,
            date: row.date,
          }));
      
          return formattedResults;
        
    } catch (error) {
        console.error("Error fetching earnings:", error);
        throw error;
    }
};

export const addExpenses = async(amount :number,category :string,description:string)=>{
    const db = await getDB();
    try {
        await db.runAsync(`INSERT INTO expenses (amount,category,description) VALUES(?,?,?)`,[amount,category,description]);
        console.log("Expenses added successfully")
        
    } catch (error) {
        console.error("Failed to add earnings",error);
        throw error;
    }
}

export const getExpenses = async()=>{
    const db = await getDB();
    try {
        const result = await db.getAllAsync(`SELECT * FROM expenses;`)
        console.log(result);
        console.log("result is above")
        return result;
        
    } catch (error) {
        console.error("Error fetching expenses",error);
        throw error;
        
    }
}
