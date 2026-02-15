import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Feather, FontAwesome5 } from "@expo/vector-icons"
import moment from "moment"
import { auth, db } from "@/services/firebase"
import {
  collection, addDoc, getDocs, query, where,
  orderBy, deleteDoc, updateDoc, doc,
} from "firebase/firestore"

// --- Constants ---
const moodOptions = [
  { val: 2, emoji: "😫", label: "Awful" },
  { val: 4, emoji: "😟", label: "Low" },
  { val: 6, emoji: "😐", label: "Okay" },
  { val: 8, emoji: "🙂", label: "Good" },
  { val: 10, emoji: "🤩", label: "Great" },
]

const stressOptions = [
  { val: 2, emoji: "🧘", label: "Zen" },
  { val: 5, emoji: "⚖️", label: "Mild" },
  { val: 8, emoji: "😰", label: "High" },
  { val: 10, emoji: "🔥", label: "Extreme" },
]

const MoodLogger = () => {
  const [mood, setMood] = useState<number | null>(null)
  const [stress, setStress] = useState<number | null>(null)
  const [sleep, setSleep] = useState<number>(8)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const userId = auth.currentUser?.uid

  const fetchHistory = async () => {
    if (!userId) return
    try {
      const q = query(collection(db, "mood_logs"), where("userId", "==", userId), orderBy("date", "desc"))
      const snapshot = await getDocs(q)
      setHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchHistory() }, [])

  const handleSave = async () => {
    if (!userId || !mood || !stress) return Alert.alert("Wait!", "Please select Mood and Stress.")
    setLoading(true)
    try {
      const payload = { userId, mood, stress, sleep, notes, date: moment().format("YYYY-MM-DD") }

      if (editingId) {
        await updateDoc(doc(db, "mood_logs", editingId), payload)
      } else {
        await addDoc(collection(db, "mood_logs"), payload)
      }

      setMood(null)
      setStress(null)
      setSleep(8)
      setNotes("")
      setEditingId(null)

      fetchHistory()
    } catch (e) {
      Alert.alert("Error", "Save failed.")
    } finally {
      setLoading(false)
    }
  }


  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Remove this entry?", [
      { text: "Cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          await deleteDoc(doc(db, "mood_logs", id))
          fetchHistory()
        }
      },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9F9FF]">
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* --- HEADER --- */}
          <View className="px-6 pt-6 mb-6">
            <Text className="text-[#0D9488] font-bold uppercase tracking-widest text-[10px] mb-1">SOUL TRACKER</Text>
            <Text className="text-4xl font-black text-[#1A1A1A]">{editingId ? "Edit Log" : "How are you?"}</Text>
          </View>

          {/* --- INPUT CARD --- */}
          <View className="mx-6 bg-white rounded-[40px] p-6 shadow-xl shadow-emerald-100 border border-emerald-50">
            <Text className="text-slate-900 font-bold mb-3 text-base">Mood</Text>
            <View className="flex-row justify-between mb-8">
              {moodOptions.map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => setMood(item.val)}
                  className={`items-center p-3 rounded-2xl w-[18%] ${mood === item.val ? "bg-[#0D9488]" : "bg-slate-50"}`}
                >
                  <Text className="text-2xl">{item.emoji}</Text>
                  <Text className={`text-[9px] font-bold mt-1 ${mood === item.val ? "text-white" : "text-slate-400"}`}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-slate-900 font-bold mb-3 text-base">Stress</Text>
            <View className="flex-row justify-between mb-8">
              {stressOptions.map((item) => (
                <TouchableOpacity
                  key={item.val}
                  onPress={() => setStress(item.val)}
                  className={`items-center p-3 rounded-2xl w-[23%] ${stress === item.val ? "bg-[#0D9488]" : "bg-slate-50"}`}
                >
                  <Text className="text-xl mb-1">{item.emoji}</Text>
                  <Text className={`text-[10px] font-black ${stress === item.val ? "text-white" : "text-slate-500"}`}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-slate-900 font-bold mb-3">Sleep: <Text className="text-[#0D9488]">{sleep} hours</Text></Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setSleep(num)}
                  className={`w-12 h-12 rounded-full items-center justify-center mr-2 border-2 ${sleep === num ? "bg-[#0D9488] border-[#0D9488]" : "bg-white border-slate-100"}`}
                >
                  <Text className={`font-bold ${sleep === num ? "text-white" : "text-slate-400"}`}>{num}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="What's on your mind?..."
              multiline
              className="bg-slate-50 rounded-3xl p-5 h-28 mb-6 text-slate-800 border border-slate-100"
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              className="bg-[#0D9488] py-5 rounded-[25px] flex-row justify-center items-center"
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <>
                  <Text className="text-white font-black text-lg uppercase tracking-tighter mr-2">
                    {editingId ? "Update Log" : "Save Log"}
                  </Text>
                  <Feather name="arrow-right" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* --- HISTORY SECTION --- */}
          <View className="px-6 mt-10">
            <Text className="text-2xl font-black text-slate-900 mb-6">Your Journey</Text>

            {history.map((item) => {
              const moodIcon = moodOptions.find(m => m.val === item.mood) || moodOptions[2]
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    setEditingId(item.id)
                    setMood(item.mood)
                    setStress(item.stress)
                    setSleep(item.sleep)
                    setNotes(item.notes)
                  }}
                  className="bg-white rounded-[30px] p-5 mb-4 shadow-sm border border-slate-100"
                >
                  <View className="flex-row items-center">
                    <View className="bg-purple-50 w-14 h-14 rounded-2xl items-center justify-center mr-4">
                      <Text className="text-3xl">{moodIcon.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-400 text-[10px] font-bold uppercase">{moment(item.date).format("MMM DD, YYYY")}</Text>
                      <Text className="text-slate-900 font-black text-lg">{moodIcon.label}</Text>
                      <View className="flex-row mt-1">
                        <View className="bg-emerald-50 px-2 py-0.5 rounded mr-2">
                          <Text className="text-[#0D9488] text-[9px] font-bold">STRESS {item.stress}</Text>
                        </View>
                        <View className="bg-emerald-50 px-2 py-0.5 rounded">
                          <Text className="text-[#0D9488] text-[9px] font-bold">🌙 {item.sleep}H SLEEP</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      className="p-3 bg-rose-50 rounded-full"
                    >
                      <FontAwesome5 name="trash" size={16} color="#E11D48" />
                    </TouchableOpacity>
                  </View>

                  {item.notes ? (
                    <View className="mt-3 pt-3 border-t border-slate-50">
                      <Text className="text-slate-500 italic text-sm">"{item.notes}"</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              )
            })}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default MoodLogger