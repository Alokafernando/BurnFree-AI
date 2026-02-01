import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView, StatusBar } from "react-native";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { auth, db } from "@/services/firebase";

// Emojis for mood and stress
const moodEmojis = ["😡", "😟", "😐", "🙂", "😊", "😁", "😃", "😍"];
const stressEmojis = ["😌", "😐", "😣", "😫", "😖", "😡"];
const sleepHours = Array.from({ length: 24 }, (_, i) => i + 1);

interface MoodEntry {
  id: string;
  mood: number;
  stress: number;
  sleep: number;
  notes: string;
  date: string;
}

const MoodLogger = () => {
  const [mood, setMood] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [sleep, setSleep] = useState<number | null>(null);
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

  useEffect(() => { fetchHistory(); }, []);

  // Save entry
  const handleSave = async () => {
    if (!userId) return;
    if (mood === null || stress === null || sleep === null) {
      return alert("Please select mood, stress, and sleep hours!");
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "mood_logs"), {
        userId,
        mood,
        stress,
        sleep,
        notes,
        date: moment().format("YYYY-MM-DD"),
      });
      setMood(null); setStress(null); setSleep(null); setNotes("");
      await fetchHistory();
      alert("Mood entry saved!");
    } catch (err) {
      console.log(err);
      alert("Failed to save mood entry.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    alert("Delete Entry?");
    await deleteDoc(doc(db, "mood_logs", id));
    fetchHistory();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="px-5 py-6" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Hello</Text>
            <Text className="text-3xl font-extrabold text-gray-900">Track Your Mood</Text>
          </View>
          <View className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
            <Feather name="calendar" size={24} color="#64748b" />
          </View>
        </View>

        {/* Mood Card */}
        <View className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Mood</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {moodEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setMood(index + 1)}
                className={`px-4 py-3 m-1 rounded-2xl ${mood === index + 1 ? 'bg-indigo-300 shadow-lg' : 'bg-gray-100'}`}
              >
                <Text className="text-3xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Right gradient hint */}
          <View className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </View>

        {/* Stress Card */}
        <View className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Stress</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {stressEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setStress(index + 1)}
                className={`px-4 py-3 m-1 rounded-2xl ${stress === index + 1 ? 'bg-rose-300 shadow-lg' : 'bg-gray-100'}`}
              >
                <Text className="text-3xl">{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Right gradient hint */}
          <View className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </View>

        {/* Sleep Card */}
        <View className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Sleep Hours</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {sleepHours.map((h) => (
              <TouchableOpacity
                key={h}
                onPress={() => setSleep(h)}
                className={`px-4 py-3 rounded-2xl m-1 ${sleep === h ? 'bg-amber-300 shadow-lg' : 'bg-gray-100'}`}
              >
                <Text className="font-bold text-gray-700">{h}h</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Notes Card */}
        <View className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Notes (Optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Any thoughts for today?"
            className="border border-gray-300 rounded-xl px-4 py-3 h-20 text-gray-700"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className={`py-4 rounded-3xl items-center mb-6 ${loading ? 'bg-gray-300' : 'bg-gradient-to-r from-teal-500 to-teal-700 shadow-lg'}`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex-row items-center">
              <Text className="text-white font-bold text-lg mr-2">Save Mood</Text>
              <Feather name="check-circle" size={20} color="white" />
            </View>
          )}
        </TouchableOpacity>

        {/* History */}
        <Text className="text-2xl font-bold text-gray-900 mb-4">History</Text>
        {history.length === 0 ? (
          <View className="items-center py-12 bg-gray-100/50 rounded-2xl border border-dashed border-gray-300">
            <Feather name="file-text" size={48} color="#94a3b8" />
            <Text className="text-gray-400 mt-3 font-medium">No entries yet.</Text>
          </View>
        ) : (
          history.map(entry => (
            <View
              key={entry.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex-row justify-between items-center"
            >
              <View>
                <Text className="text-gray-900 font-bold">{moment(entry.date).format("MMM D, YYYY")}</Text>
                <Text className="text-gray-600 mt-1">
                  Mood: {moodEmojis[entry.mood - 1]}, Stress: {stressEmojis[entry.stress - 1]}, Sleep: {entry.sleep}h
                </Text>
                {entry.notes ? <Text className="text-gray-500 mt-1 italic">"{entry.notes}"</Text> : null}
              </View>
              <TouchableOpacity onPress={() => handleDelete(entry.id)} className="p-2 bg-rose-50 rounded-xl">
                <Feather name="trash-2" size={20} color="#fb7185" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodLogger;