import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import { auth, db } from "@/services/firebase";

interface MoodEntry {
  id: string;
  mood: number;
  stress: number;
  sleep: number;
  notes: string;
  date: string;
}

const MoodLogger = () => {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("");
  const [sleep, setSleep] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<MoodEntry[]>([]);

  const userId = auth.currentUser?.uid;

  // Fetch history
  const fetchHistory = async () => {
    if (!userId) return;
    const q = query(
      collection(db, "mood_logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    const entries: MoodEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<MoodEntry, "id">),
    }));
    setHistory(entries);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Save entry
  const handleSave = async () => {
    if (!userId) return;
    if (!mood || !stress || !sleep) return Alert.alert("Please fill all required fields!");
    setLoading(true);
    try {
      await addDoc(collection(db, "mood_logs"), {
        userId,
        mood: Number(mood),
        stress: Number(stress),
        sleep: Number(sleep),
        notes,
        date: moment().format("YYYY-MM-DD"),
      });
      setMood("");
      setStress("");
      setSleep("");
      setNotes("");
      await fetchHistory();
      Alert.alert("Mood entry saved!");
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to save mood entry.");
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
          await deleteDoc(doc(db, "mood_logs", id));
          fetchHistory();
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Log Your Mood</Text>

      {/* Mood Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Mood (1-10)</Text>
        <TextInput
          value={mood}
          onChangeText={setMood}
          keyboardType="numeric"
          placeholder="Enter your mood"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      {/* Stress Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Stress (1-10)</Text>
        <TextInput
          value={stress}
          onChangeText={setStress}
          keyboardType="numeric"
          placeholder="Enter your stress level"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      {/* Sleep Input */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Sleep (hours)</Text>
        <TextInput
          value={sleep}
          onChangeText={setSleep}
          keyboardType="numeric"
          placeholder="Enter sleep hours"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      {/* Notes */}
      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any notes for today?"
          multiline
          className="border border-gray-300 rounded-xl px-4 py-3 h-20 text-gray-700"
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
          <Text className="text-white font-bold text-lg">Save Mood</Text>
        )}
      </TouchableOpacity>

      {/* History */}
      <Text className="text-xl font-bold text-gray-800 mb-2">History</Text>
      {history.length === 0 ? (
        <Text className="text-gray-500">No mood entries yet.</Text>
      ) : (
        history.map(entry => (
          <View key={entry.id} className="border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-800 font-semibold">{moment(entry.date).format("MMM D, YYYY")}</Text>
              <Text className="text-gray-600">Mood: {entry.mood}, Stress: {entry.stress}, Sleep: {entry.sleep}h</Text>
              {entry.notes ? <Text className="text-gray-500">Notes: {entry.notes}</Text> : null}
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

export default MoodLogger;