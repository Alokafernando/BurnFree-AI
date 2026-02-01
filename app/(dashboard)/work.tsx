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
            // onPress={handleSave}
            disabled={loading}
            className="bg-[#0D9488] py-4 rounded-2xl items-center shadow-lg"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg uppercase">
                Save Work
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
            workLogs.map(entry => (
              <View
                key={entry.id}
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm flex-row justify-between items-center"
              >
                <View>
                  <Text className="font-bold text-slate-800">
                    {entry.client}
                  </Text>
                  <Text className="text-slate-500 text-sm">
                    {entry.project} • {entry.hours}h
                  </Text>
                  <Text className="text-slate-400 text-xs">
                    {entry.date}
                  </Text>
                </View>

                <TouchableOpacity
                  // onPress={() => handleDelete(entry.id)}
                  className="p-3 bg-rose-50 rounded-full"
                >
                  <FontAwesome5 name="trash" size={16} color="#E11D48" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkTracker;
