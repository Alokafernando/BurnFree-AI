import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";

interface MoodEntry {
  mood: number;
  stress: number;
  sleep: number;
  date: string;
}

interface WorkEntry {
  hours: number;
  date: string;
}

interface IncomeEntry {
  amount: number;
  date: string;
}

const Dashboard = ({ navigation }: any) => {
  const userId = auth.currentUser?.uid;

  const [loading, setLoading] = useState(true);
  const [burnoutScore, setBurnoutScore] = useState(0);
  const [incomeStability, setIncomeStability] = useState("Stable");
  const [advice, setAdvice] = useState<string[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [incomeLogs, setIncomeLogs] = useState<IncomeEntry[]>([]);

  // Fetch data
  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      // Mood logs
      const moodSnapshot = await getDocs(
        query(collection(db, "mood_logs"), where("userId", "==", userId))
      );
      const moods: MoodEntry[] = moodSnapshot.docs.map(doc => doc.data() as MoodEntry);
      setMoodLogs(moods);

      // Work logs
      const workSnapshot = await getDocs(
        query(collection(db, "work_logs"), where("userId", "==", userId))
      );
      const works: WorkEntry[] = workSnapshot.docs.map(doc => doc.data() as WorkEntry);
      setWorkLogs(works);

      // Income logs
      const incomeSnapshot = await getDocs(
        query(collection(db, "income_logs"), where("userId", "==", userId))
      );
      const incomes: IncomeEntry[] = incomeSnapshot.docs.map(doc => doc.data() as IncomeEntry);
      setIncomeLogs(incomes);

      // Calculate Burnout Score (simple example)
      const avgMood = moods.length ? moods.reduce((a, b) => a + b.mood, 0) / moods.length : 5;
      const avgStress = moods.length ? moods.reduce((a, b) => a + b.stress, 0) / moods.length : 5;
      const avgHours = works.length ? works.reduce((a, b) => a + b.hours, 0) / works.length : 8;
      const score = Math.min(100, Math.max(0, avgHours + avgStress * 5 - avgMood * 5));
      setBurnoutScore(Math.round(score));

      // Income Stability (simple example)
      const totalIncome = incomes.reduce((a, b) => a + b.amount, 0);
      setIncomeStability(totalIncome > 5000 ? "Stable" : "Unstable");

      // AI Advice
      const adviceArr: string[] = [];
      if (score > 70) adviceArr.push("High burnout risk! Take a break.");
      else if (score > 40) adviceArr.push("Moderate burnout. Monitor your stress.");
      else adviceArr.push("Low burnout. Keep up the good work!");
      if (totalIncome < 2000) adviceArr.push("Income is low. Consider more clients.");
      setAdvice(adviceArr);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" className="flex-1 justify-center items-center" />;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Dashboard</Text>

      {/* Burnout Score */}
      <View className="bg-red-100 rounded-xl p-4 mb-4 shadow-md">
        <Text className="text-gray-700 font-semibold">Burnout Score</Text>
        <Text className="text-3xl font-bold text-red-600">{burnoutScore}</Text>
      </View>

      {/* Income Stability */}
      <View className="bg-green-100 rounded-xl p-4 mb-4 shadow-md">
        <Text className="text-gray-700 font-semibold">Income Stability</Text>
        <Text className="text-2xl font-bold text-green-700">{incomeStability}</Text>
      </View>

      {/* AI Advice */}
      <Text className="text-lg font-semibold text-gray-800 mb-2">AI Advice</Text>
      {advice.map((item, index) => (
        <View key={index} className="bg-teal-50 rounded-xl p-3 mb-2 shadow-sm">
          <Text className="text-gray-700">{item}</Text>
        </View>
      ))}

      {/* Quick Links */}
      <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Quick Actions</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.navigate("MoodLogger")}
          className="bg-teal-700 flex-1 mx-1 py-4 rounded-xl items-center"
        >
          <FontAwesome5 name="smile-beam" size={24} color="white" />
          <Text className="text-white font-bold mt-1">Mood</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("WorkTracker")}
          className="bg-teal-700 flex-1 mx-1 py-4 rounded-xl items-center"
        >
          <Ionicons name="briefcase" size={24} color="white" />
          <Text className="text-white font-bold mt-1">Work</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("IncomeTracker")}
          className="bg-teal-700 flex-1 mx-1 py-4 rounded-xl items-center"
        >
          <FontAwesome5 name="dollar-sign" size={24} color="white" />
          <Text className="text-white font-bold mt-1">Income</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;