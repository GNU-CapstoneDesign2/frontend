import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH } from "../utils/normalize";
import { PaperProvider } from "react-native-paper";

export default function ChatPage() {
  const navigation = useNavigation();

  const chatList = [
    { id: "1", name: "UserName", message: "대화내용", time: "오후 4:25" },
    { id: "2", name: "UserName", message: "대화내용", time: "오후 3:25" },
    { id: "3", name: "UserName", message: "대화내용", time: "오후 1:25" },
  ];

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem}
        onPress={() =>
      navigation.navigate("ChatRoomPage")
    }
  >
      <Image
        source={require("../assets/avatar.png")} // 여기에 본인 아바타 이미지 경로 지정
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
            <FlatList
              data={chatList}
              keyExtractor={(item) => item.id}
              renderItem={renderChatItem}
            />
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
