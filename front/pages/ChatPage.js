import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH } from "../utils/normalize";
import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function ChatPage() {
  const navigation = useNavigation();
  const [chatList, setChatList] = useState([]); // API에서 불러온 채팅 목록 상태

  // 서버에서 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      
      if (!token) return;

      const response = await axios.get("https://petfinderapp.duckdns.org/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data.map((item) => ({
        id: item.roomId.toString(),
        roomId: item.roomId,
        name: item.senderName,
        profile: item.senderProfile,
        message: item.lastMessage,
        time: new Date(item.lastMessageTime).toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setChatList(data);
    } catch (error) {
      console.error("채팅방 목록 조회 실패:", error.response?.data || error.message);
      Alert.alert("오류", "채팅방 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatRoomPage", { roomId: item.roomId })}
    >
      <Image
        source={item.profile ? { uri: item.profile } : require("../assets/avatar.png")}
        style={styles.avatar}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View style={{ flex: 1 }}>
          {/* 커스텀 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>채팅</Text>
          </View>

          {/* 채팅방 목록 */}
          <View style={styles.content}>
            <FlatList data={chatList} keyExtractor={(item) => item.id} renderItem={renderChatItem} />
          </View>
        </View>

        {/* 하단 탭 */}
        <NavigationBar />
      </SafeAreaView>
    </PaperProvider>
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
    width: "100%",
    backgroundColor: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: "center",
  },
  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  chatTime: {
    fontSize: 12,
    color: "#888",
  },
  chatMessage: {
    fontSize: 14,
    color: "#555",
  },
});