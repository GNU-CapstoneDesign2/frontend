import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

export default function MyPage() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
      <View style={{ flex: 1 }}>
        {/* 커스텀 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>마이페이지</Text>
        </View>

        {/* 마이페이지 내용 */}
        <View style={styles.content}>
          <Image
            source={require("../assets/avatar.png")}
            style={styles.profileImage}
          />
          <Text style={styles.userId}>
            <Text style={{ fontWeight: "bold" }}>user_id </Text>1231232
          </Text>

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfilePage")}>
            <Text style={styles.editButtonText}>정보수정</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>내 게시물 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <NavigationBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: SCREEN_WIDTH * 0.038,
    fontWeight: "bold",
  },
  content: {
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-start",   
  paddingTop: 32,                 
  paddingHorizontal: 20,
  backgroundColor: "#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 10,
  },
  userId: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  menuButton: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
