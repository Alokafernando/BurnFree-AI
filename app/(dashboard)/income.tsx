import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";

interface IncomeEntry {
  id: string;
  client: string;
  amount: number;
  date: string;
}

const IncomeTracker = () => {
  const userId = auth.currentUser?.uid;
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [incomeLogs, setIncomeLogs] = useState<IncomeEntry[]>([]);

  // Fetch income logs
  const fetchIncomeLogs = async () => {
    if (!userId) return;
    const q = query(
      collection(db, "income_logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    const entries: IncomeEntry[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IncomeEntry, "id">),
    }));
    setIncomeLogs(entries);
  };

  useEffect(() => {
    fetchIncomeLogs();
  }, []);

  // Save income entry
  const handleSave = async () => {
    if (!client || !amount)
      return Alert.alert("Please fill all fields!");
    setLoading(true);
    try {
      await addDoc(collection(db, "income_logs"), {
        userId,
        client,
        amount: Number(amount),
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      });
      setClient("");
      setAmount("");
      fetchIncomeLogs();
      Alert.alert("Income entry saved!");
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to save income entry.");
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "income_logs", id));
          fetchIncomeLogs();
        },
      },
    ]);
  };

  // Calculate total income
  const totalIncome = incomeLogs.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Income Tracker</Text>

      {/* Input Fields */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Client</Text>
        <TextInput
          value={client}
          onChangeText={setClient}
          placeholder="Enter client name"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter income amount"
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className="bg-teal-700 py-4 rounded-2xl items-center shadow-md mb-6"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Save Income</Text>
        )}
      </TouchableOpacity>

      {/* Summary */}
      <View className="bg-green-100 rounded-xl p-4 mb-4 shadow-md">
        <Text className="text-gray-700 font-semibold">
          Total Income: ${totalIncome.toFixed(2)}
        </Text>
      </View>

      {/* Income History */}
      <Text className="text-xl font-bold text-gray-800 mb-2">Income History</Text>
      {incomeLogs.length === 0 ? (
        <Text className="text-gray-500">No income entries yet.</Text>
      ) : (
        incomeLogs.map((entry) => (
          <View
            key={entry.id}
            className="border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-gray-800 font-semibold">{entry.client}</Text>
              <Text className="text-gray-600">
                Amount: ${entry.amount.toFixed(2)} | Date: {entry.date}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(entry.id)}>
              <FontAwesome5 name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default IncomeTracker;