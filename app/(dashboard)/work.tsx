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
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";

interface WorkEntry {
  id: string;
  client: string;
  project: string;
  hours: number;
  date: string;
}

const WorkTracker = () => {
  const userId = auth.currentUser?.uid;
  const [client, setClient] = useState("");
  const [project, setProject] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [workLogs, setWorkLogs] = useState<WorkEntry[]>([]);

  // Fetch work logs
  const fetchWorkLogs = async () => {
    if (!userId) return;
    const q = query(
      collection(db, "work_logs"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    const entries: WorkEntry[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<WorkEntry, "id">),
    }));
    setWorkLogs(entries);
  };

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  // Save work entry
  const handleSave = async () => {
    if (!client || !project || !hours)
      return Alert.alert("Please fill all fields!");
    setLoading(true);
    try {
      await addDoc(collection(db, "work_logs"), {
        userId,
        client,
        project,
        hours: Number(hours),
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      });
      setClient("");
      setProject("");
      setHours("");
      fetchWorkLogs();
      Alert.alert("Work entry saved!");
    } catch (error) {
      console.log(error);
      Alert.alert("Failed to save work entry.");
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
          await deleteDoc(doc(db, "work_logs", id));
          fetchWorkLogs();
        },
      },
    ]);
  };

  // Calculate total hours
  const totalHours = workLogs.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-4">Work Tracker</Text>

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
        <Text className="text-gray-700 mb-1">Project</Text>
        <TextInput
          value={project}
          onChangeText={setProject}
          placeholder="Enter project name"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-1">Hours Worked</Text>
        <TextInput
          value={hours}
          onChangeText={setHours}
          placeholder="Enter hours worked"
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
          <Text className="text-white font-bold text-lg">Save Work</Text>
        )}
      </TouchableOpacity>

      {/* Summary */}
      <View className="bg-blue-100 rounded-xl p-4 mb-4 shadow-md">
        <Text className="text-gray-700 font-semibold">Total Hours: {totalHours}</Text>
      </View>

      {/* Work History */}
      <Text className="text-xl font-bold text-gray-800 mb-2">Work History</Text>
      {workLogs.length === 0 ? (
        <Text className="text-gray-500">No work entries yet.</Text>
      ) : (
        workLogs.map((entry) => (
          <View
            key={entry.id}
            className="border border-gray-200 rounded-xl p-4 mb-3 flex-row justify-between items-center"
          >
            <View>
              <Text className="text-gray-800 font-semibold">
                {entry.client} - {entry.project}
              </Text>
              <Text className="text-gray-600">
                Hours: {entry.hours} | Date: {entry.date}
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

export default WorkTracker;