import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";
import { addWork, deleteWork, getWorkForUser, updateWork } from "@/services/workService";

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
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchWorkLogs = async () => {
    const result = await getWorkForUser();
    if ("code" in result) {
      Alert.alert("Error", result.message);
    } else {
      setWorkLogs(result);
    }
  };

  useEffect(() => {
    fetchWorkLogs();
  }, []);

  const handleSave = async () => {
    if (!client || !project || !hours) {
      return Alert.alert("Missing info", "Please fill all fields");
    }

    setLoading(true);

    const payload = {
      client,
      project,
      hours: Number(hours),
      date: new Date().toISOString().split("T")[0],
    };

    const result = editingId
      ? await updateWork(editingId, payload)
      : await addWork(client, project, Number(hours), payload.date);

    if ("code" in result) {
      Alert.alert("Error", result.message);
    } else {
      setClient("");
      setProject("");
      setHours("");
      setEditingId(null);
      fetchWorkLogs();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Entry", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteWork(id);
          if (result !== true) {
            Alert.alert("Error", result.message);
          }
          fetchWorkLogs();
        },
      },
    ]);
  };

  const totalHours = workLogs.reduce((sum, e) => sum + e.hours, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View className="px-6 pt-6 mb-6">
          <Text className="text-[#0D9488] text-xs font-bold tracking-widest mb-1">
            WORK & PRODUCTIVITY
          </Text>
          <Text className="text-3xl font-black text-slate-900">
            Track Your Work
          </Text>
        </View>

        {/* INPUT CARD */}
        <View className="mx-6 bg-white rounded-3xl p-6 shadow-md mb-6">

          <Text className="font-semibold text-slate-700 mb-1">Client</Text>
          <TextInput
            value={client}
            onChangeText={setClient}
            placeholder="Client name"
            className="bg-slate-50 rounded-xl px-4 py-3 mb-4 border border-slate-100"
          />

          <Text className="font-semibold text-slate-700 mb-1">Project</Text>
          <TextInput
            value={project}
            onChangeText={setProject}
            placeholder="Project name"
            className="bg-slate-50 rounded-xl px-4 py-3 mb-4 border border-slate-100"
          />

          <Text className="font-semibold text-slate-700 mb-1">Hours Worked</Text>
          <TextInput
            value={hours}
            onChangeText={setHours}
            placeholder="e.g. 5"
            keyboardType="numeric"
            className="bg-slate-50 rounded-xl px-4 py-3 mb-6 border border-slate-100"
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-[#0D9488] py-4 rounded-2xl items-center shadow-lg"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg uppercase">
                {editingId ? "Update Work" : "Save Work"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* TOTAL HOURS */}
        <View className="mx-6 bg-emerald-50 rounded-2xl p-5 mb-6 flex-row justify-between items-center">
          <Text className="text-emerald-900 font-bold text-lg">
            Total Hours
          </Text>
          <Text className="text-emerald-900 font-black text-2xl">
            {totalHours}h
          </Text>
        </View>

        {/* HISTORY */}
        <View className="px-6">
          <Text className="text-xl font-black text-slate-900 mb-4">
            Work History
          </Text>

          {workLogs.length === 0 ? (
            <Text className="text-slate-400 text-center">
              No work logged yet
            </Text>
          ) : (
            workLogs.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                activeOpacity={0.8}
                onPress={() => {
                  // Load this entry into the input fields for editing
                  setEditingId(entry.id);
                  setClient(entry.client);
                  setProject(entry.project);
                  setHours(String(entry.hours));
                }}
                className="bg-white rounded-[30px] p-5 mb-4 shadow-sm border border-slate-100"
              >
                <View className="flex-row items-center">
                  {/* Left colored box */}
                  <View className="bg-blue-50 w-14 h-14 rounded-2xl items-center justify-center mr-4">
                    <Text className="text-2xl font-bold">💼</Text>
                  </View>

                  {/* Work info */}
                  <View className="flex-1">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase">{entry.date}</Text>
                    <Text className="text-slate-900 font-black text-lg">{entry.client}</Text>
                    <View className="flex-row mt-1">
                      <View className="bg-emerald-50 px-2 py-0.5 rounded mr-2">
                        <Text className="text-[#0D9488] text-[9.5px] font-bold">{entry.project}</Text>
                      </View>
                      <View className="bg-emerald-50 px-2 py-0.5 rounded">
                        <Text className="text-[#0D9488] text-[9.5px] font-bold">{entry.hours}h</Text>
                      </View>
                    </View>
                  </View>

                  {/* Delete button */}
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

export default WorkTracker;
