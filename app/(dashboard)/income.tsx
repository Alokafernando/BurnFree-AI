import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth } from "@/services/firebase";

import {
  addIncome,
  deleteIncome,
  getIncomeForUser,
  updateIncome,
} from "@/services/incomeService";

import { Income, IncomeType } from "@/types/Income";

const IncomeTracker = () => {
  const userId = auth.currentUser?.uid;

  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<IncomeType>("freelance");

  const [loading, setLoading] = useState(false);
  const [incomeLogs, setIncomeLogs] = useState<Income[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ---------------- FETCH ----------------
  const fetchIncomeLogs = async () => {
    const result = await getIncomeForUser();

    if ("code" in result) {
      Alert.alert("Error", result.message);
    } else {
      setIncomeLogs(result);
    }
  };

  useEffect(() => {
    fetchIncomeLogs();
  }, []);

  // ---------------- SAVE / UPDATE ----------------
  const handleSave = async () => {
    if (!client || !amount) {
      return Alert.alert("Missing info", "Please fill all fields");
    }

    setLoading(true);

    const date = new Date().toISOString().split("T")[0];

    const result = editingId
      ? await updateIncome(editingId, {
        client,
        amount: Number(amount),
        type,
        date,
      })
      : await addIncome(client, Number(amount), type, date);

    if ("code" in result) {
      Alert.alert("Error", result.message);
    } else {
      setClient("");
      setAmount("");
      setType("freelance");
      setEditingId(null);
      fetchIncomeLogs();
    }

    setLoading(false);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteIncome(id);

          if (result !== true) {
            Alert.alert("Error", result.message);
          }

          fetchIncomeLogs();
        },
      },
    ]);
  };

  // ---------------- TOTAL ----------------
  const totalIncome = incomeLogs.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View className="px-6 pt-6 mb-6">
          <Text className="text-[#0D9488] text-xs font-bold tracking-widest mb-1">
            INCOME & EARNINGS
          </Text>
          <Text className="text-3xl font-black text-slate-900">
            Track Your Income
          </Text>
        </View>

        {/* INPUT CARD */}
        <View className="mx-6 bg-white rounded-3xl p-6 shadow-md mb-6">

          {/* CLIENT */}
          <Text className="font-semibold text-slate-700 mb-1">Client</Text>
          <TextInput
            value={client}
            onChangeText={setClient}
            placeholder="Client name"
            className="bg-slate-50 rounded-xl px-4 py-3 mb-4 border border-slate-100"
          />

          {/* AMOUNT */}
          <Text className="font-semibold text-slate-700 mb-1">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Income amount"
            keyboardType="numeric"
            className="bg-slate-50 rounded-xl px-4 py-3 mb-4 border border-slate-100"
          />

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-[#0D9488] py-4 rounded-2xl items-center shadow-lg"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg uppercase">
                {editingId ? "Update Income" : "Save Income"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TOTAL */}
        <View className="mx-6 bg-emerald-50 rounded-2xl p-5 mb-6 flex-row justify-between items-center">
          <Text className="text-emerald-900 font-bold text-lg">
            Total Income
          </Text>
          <Text className="text-emerald-900 font-black text-2xl">
            ${totalIncome.toFixed(2)}
          </Text>
        </View>

        {/* HISTORY */}
        <View className="px-6">
          <Text className="text-xl font-black text-slate-900 mb-4">
            Income History
          </Text>

          {incomeLogs.length === 0 ? (
            <Text className="text-slate-400 text-center">
              No income logged yet
            </Text>
          ) : (
            incomeLogs.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                activeOpacity={0.8}
                onPress={() => {
                  // Load into edit mode
                  setEditingId(entry.id);
                  setClient(entry.client);
                  setAmount(String(entry.amount));
                  setType(entry.type);
                }}
                className="bg-white rounded-[30px] p-5 mb-4 shadow-sm border border-slate-100"
              >
                <View className="flex-row items-center">

                  {/* Left Icon Box */}
                  <View className="bg-emerald-50 w-14 h-14 rounded-2xl items-center justify-center mr-4">
                    <Text className="text-2xl font-bold">💰</Text>
                  </View>

                  {/* Income Info */}
                  <View className="flex-1">

                    {/* Date */}
                    <Text className="text-slate-400 text-[10px] font-bold uppercase">
                      {entry.date}
                    </Text>

                    {/* Client */}
                    <Text className="text-slate-900 font-black text-lg">
                      {entry.client}
                    </Text>

                    {/* Badges Row */}
                    <View className="flex-row mt-1">

                      {/* Type Badge */}
                      <View className="bg-emerald-50 px-2 py-0.5 rounded mr-2">
                        <Text className="text-[#0D9488] text-[9.5px] font-bold">
                          {entry.type}
                        </Text>
                      </View>

                      {/* Amount Badge */}
                      <View className="bg-emerald-50 px-2 py-0.5 rounded">
                        <Text className="text-[#0D9488] text-[9.5px] font-bold">
                          ${entry.amount.toFixed(2)}
                        </Text>
                      </View>

                    </View>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDelete(entry.id)}
                    className="p-3 bg-rose-50 rounded-full"
                  >
                    <FontAwesome5 name="trash" size={16} color="#E11D48" />
                  </TouchableOpacity>

                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default IncomeTracker;
