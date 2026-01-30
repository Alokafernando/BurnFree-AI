import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { auth } from "@/services/firebase";
import { updateUserProfileImage } from "@/services/userService";
import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "@/config/upload";
import { signOut } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = auth.currentUser;

  // Reload user info and set profile image on mount
  useEffect(() => {
    const reloadUser = async () => {
      await auth.currentUser?.reload();
      setProfileImage(auth.currentUser?.photoURL || null);
    };
    reloadUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      router.replace("/login"); // your login route
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to log out");
    } finally {
      setLoggingOut(false);
    }
  };

  // Request media permissions
  const requestMediaPermission = async (fromCamera: boolean): Promise<boolean> => {
    try {
      let status;
      if (fromCamera) {
        const result = await ImagePicker.getCameraPermissionsAsync();
        status = result.status;
        if (status !== "granted") {
          Alert.alert("Camera Permission Needed", "We need access to your camera to take a profile picture.", [{ text: "OK" }]);
          const newResult = await ImagePicker.requestCameraPermissionsAsync();
          status = newResult.status;
        }
      } else {
        const result = await ImagePicker.getMediaLibraryPermissionsAsync();
        status = result.status;
        if (status !== "granted") {
          Alert.alert("Media Library Permission Needed", "We need access to your photo library to select a profile picture.", [{ text: "OK" }]);
          const newResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          status = newResult.status;
        }
      }
      return status === "granted";
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Pick image from camera or gallery
  const handleImagePick = async (fromCamera: boolean) => {
    const allowed = await requestMediaPermission(fromCamera);
    if (!allowed) return;

    try {
      setUploading(true);

      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
            quality: 0.7,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images as any,
            quality: 0.7,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const cloudUrl = await uploadImageToCloudinary(result.assets[0].uri);

        // Use new method to update Firestore and Auth
        if (auth.currentUser) {
          const success = await updateUserProfileImage(auth.currentUser.uid, cloudUrl);
          if (success) {
            setProfileImage(cloudUrl);
            Alert.alert("Success", "Profile picture updated!");
          } else {
            Alert.alert("Error", "Failed to update profile image");
          }
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#F0FDFA", "#EFF6FF", "#FFFFFF"]} className="absolute inset-0" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* HEADER */}
        <View className="px-6 pt-6 items-center pb-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-[35px] bg-white shadow-xl shadow-teal-900/10 items-center justify-center border-2 border-white overflow-hidden">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 96, height: 96, borderRadius: 35 }}
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcons name="account" size={50} color="#0D9488" />
              )}

              {uploading && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center rounded-[35px]">
                  <ActivityIndicator size="small" color="white" />
                </View>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-xl border-2 border-white shadow-md"
              onPress={async () => {
                Alert.alert("Profile Image", "Choose how to set your profile picture", [
                  { text: "Camera", onPress: () => handleImagePick(true) },
                  { text: "Gallery", onPress: () => handleImagePick(false) },
                  { text: "Cancel", style: "cancel" },
                ]);
              }}
            >
              <MaterialCommunityIcons name="pencil" size={12} color="white" />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-black text-slate-900 mt-3">{user?.displayName || "-"}</Text>
          <Text className="text-slate-500 font-medium text-sm">{user?.email || "-"}</Text>
        </View>

        {/* STATS */}
        <View className="flex-row justify-around py-3 mx-6 mb-4 bg-white/60 rounded-2xl border border-white">
          <StatItem value="12" label="TASKS" />
          <View className="w-px h-6 bg-slate-200" />
          <StatItem value="5" label="STREAK" />
          <View className="w-px h-6 bg-slate-200" />
          <StatItem value="Gold" label="RANK" />
        </View>

        {/* ACTION SECTIONS */}
        <View className="px-6">
          <Text className="text-slate-900 font-black text-lg mb-2 ml-1">Account & Security</Text>
          <View className="bg-white rounded-3xl p-1 shadow-sm border border-slate-50">
            <MenuButton icon="shield-lock-outline" title="Privacy & Security" color="#0D9488" />
            <MenuButton icon="key-outline" title="Change Password" color="#0D9488" onPress={() => router.push("/change-password")}/>
          </View>

          <Text className="text-slate-900 font-black text-lg mb-2 ml-1 mt-6">Preferences</Text>
          <View className="bg-white rounded-3xl p-1 shadow-sm border border-slate-50">
            <MenuButton icon="bell-outline" title="Notifications" color="#0D9488" />
            <MenuButton icon="palette-outline" title="Appearance" color="#0D9488" />
          </View>
        </View>

        {/* LOGOUT */}
        <View style={{ height: 20 }} />
        <View className="px-6 mb-28">
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center py-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm"
          >
            {loggingOut && <ActivityIndicator size="small" color="#ef4444" className="mr-2" />}
            <MaterialCommunityIcons name="logout-variant" size={24} color="#ef4444" />
            <Text className="text-red-500 font-black text-xl ml-3">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-components
const StatItem = ({ value, label }: any) => (
  <View className="items-center">
    <Text className="text-teal-600 font-black text-xl">{value}</Text>
    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</Text>
  </View>
);

const MenuButton = ({ icon, title, color, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-4">
    <View className="flex-row items-center">
      <View style={{ backgroundColor: `${color}15` }} className="w-12 h-12 rounded-xl items-center justify-center">
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      <Text className="ml-4 text-slate-700 font-bold text-base">{title}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#cbd5e1" />
  </TouchableOpacity>
);
