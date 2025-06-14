import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Button,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../sockets/StompClient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatRoomPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomId } = route.params;

  const [myId, setMyId] = useState(null); // 현재 사용자 ID
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [message, setMessage] = useState(""); // 입력창 메시지 내용
  const [showPostPicker, setShowPostPicker] = useState(false); // 공유 게시글 모달 표시 여부
  const [myPosts, setMyPosts] = useState([]); // 내 게시글 목록
  const [chatRoomInfo, setChatRoomInfo] = useState(null); // 채팅방 정보 (게시글, 참여자 등)

  // 채팅방 상세정보 (게시글 + 참여자 목록) 불러오기, 일단 가데이터
  const fetchRoomInfo = async () => {
    // const token = await AsyncStorage.getItem("accessToken");
    // const res = await axios.get(`https://petfinderapp.duckdns.org/chatrooms/${roomId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    const res = {
      data: {
        data: {
          roomId: roomId,
          post: {
            postId: 123,
            state: "실종",
            date: "2025-04-08T15:30:00Z",
            address: "서울 강남구",
            description: "실종 대상에 대한 상세 설명",
            imageUrl: "https://example.com/image1.jpg"
          },
          participants: [
            {
              userId: 1001,
              name: "홍길동",
              profileImage: "https://example.com/profiles/hong.jpg",
              isMe: true
            },
            {
              userId: 1002,
              name: "Alice",
              profileImage: "https://example.com/profiles/alice.jpg",
              isMe: false
            }
          ]
        }
      }
    };

    const myInfo = res.data.data.participants.find((p) => p.isMe);
    setMyId(myInfo.userId);
    setChatRoomInfo(res.data.data);
  };

  // 내 게시글 목록 불러오기 (공유용)
  const fetchMyPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get(
        "https://petfinderapp.duckdns.org/users/me/posts",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 0, size: 20 },
        }
      );

      const formatted = response.data.data.content.map((item) => ({
        id: item.postId.toString(),
        status: item.state === "LOST" ? "실종" : "목격",
        time: new Date(item.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        location: item.address,
        description: item.description,
        imageUrl: item.imageUrl,
      }));

      setMyPosts(formatted);
    } catch (error) {
      console.error("내 게시물 조회 실패:", error.response?.data || error.message);
      Alert.alert("오류", "내 게시물 불러오기 실패");
    }
  };

  // 초기 메시지 불러오기, 일단 가데이터
  const fetchInitialMessages = async () => {
    // const data = await fetchMessages(roomId);
    
    const data = [
      {
        senderId: 1002,
        message: "안녕하세요!",
        createAt: "2025-04-08T15:30:00Z",
        post: null,
      },
      {
        senderId: 1001,
        message: "반갑습니다!",
        createAt: "2025-04-08T15:31:00Z",
        post: {
          state: "실종",
          date: "2025-04-08T14:00:00Z",
          address: "서울 강남구",
          description: "포메라니안 찾습니다.",
          imageUrl: "https://example.com/image1.jpg",
        },
      },
    ];

    const formatted = data.map((msg) => ({
      id: Date.now().toString() + Math.random(),
      sender: String(msg.senderId) === String(myId) ? "me" : "other",
      text: msg.message,
      time: new Date(msg.createAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      date: new Date(msg.createAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
      post: msg.post
        ? {
            status: msg.post.state,
            time: new Date(msg.post.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
            location: msg.post.address,
            description: msg.post.description,
            imageUrl: msg.post.imageUrl,
          }
        : null,
    }));
    setMessages(formatted);
  };

  // 컴포넌트 mount 시 채팅방 정보 불러오기
  useEffect(() => {
    (async () => {
      await fetchRoomInfo();
    })();
  }, []);

  // 내 ID 로드 후 메시지 불러오기 & WebSocket 연결
  useEffect(() => {
    if (myId === null) return;
    fetchInitialMessages();

    connectWebSocket(roomId, (msg) => {
      const isMe = String(msg.senderId) === String(myId);
      const formattedMsg = {
        id: Date.now().toString() + Math.random(),
        sender: isMe ? "me" : "other",
        text: msg.message,
        time: new Date(msg.createAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        date: new Date(msg.createAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" }),
        post: msg.post
          ? {
              status: msg.post.state,
              time: new Date(msg.post.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
              location: msg.post.address,
              description: msg.post.description,
              imageUrl: msg.post.imageUrl,
            }
          : null,
      };
      setMessages((prev) => [...prev, formattedMsg]);
    });

    return () => {
      disconnectWebSocket();
    };
  }, [myId]);

  // 메시지 전송 핸들러
  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(roomId, myId, message);
    setMessage("");
  };

  // 게시글 선택 공유 핸들러
  const handleSelectPost = (post) => {
    sendMessage(roomId, myId, "해당 게시글을 확인해주세요.", post);
    setShowPostPicker(false);
  };

  // 채팅 메시지 렌더링 함수
  const renderItem = ({ item }) => {
    const isMe = item.sender === "me";

    if (item.post) {
      return (
        <View style={[styles.sharedPostContainer, isMe ? styles.myMessage : styles.otherMessage]}>
          <Image source={{ uri: item.post.imageUrl }} style={styles.sharedPostImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: "bold", color: "red" }}>{item.post.status}</Text>
            <Text>시간: {item.post.time}</Text>
            <Text>장소: {item.post.location}</Text>
            <Text>설명: {item.post.description}</Text>
          </View>
        </View>
      );
    }

    return (
      <>
        {item.date && <Text style={styles.dateText}>{item.date}</Text>}
        <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.otherMessage]}>
          {!isMe && <Image source={require("../assets/avatar.png")} style={styles.avatar} />}
          <View style={styles.bubble}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>채팅</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 상단 게시글 정보 */}
      {chatRoomInfo?.post && (
        <View style={styles.topPostContainer}>
          <Image source={{ uri: chatRoomInfo.post.imageUrl }} style={styles.topPostImage} />
          <View style={styles.topPostTextWrapper}>
            <Text style={styles.topPostLabel}>시간: <Text style={styles.topPostValue}>{new Date(chatRoomInfo.post.date).toLocaleString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</Text></Text>
            <Text style={styles.topPostLabel}>장소: <Text style={styles.topPostValue}>{chatRoomInfo.post.address}</Text></Text>
            <Text style={styles.topPostLabel}>설명: <Text style={styles.topPostValue}>{chatRoomInfo.post.description}</Text></Text>
          </View>
          <View style={styles.topPostBadge}>
            <Text style={{ color: "white", fontWeight: "bold" }}>{chatRoomInfo.post.state}</Text>
          </View>
        </View>
      )}

      {/* 채팅 메시지 목록 + 입력창 */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.innerContainer}>
        <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={styles.messages} />

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => {
              fetchMyPosts();
              setShowPostPicker(true);
            }}
            style={{ marginRight: 10 }}
          >
            <Image source={require("../assets/share-icon.jpg")} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="메시지 입력" value={message} onChangeText={setMessage} />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={{ color: "white" }}>전송</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 게시글 공유 모달 */}
      <Modal visible={showPostPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={myPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectPost(item)}>
                <Image source={{ uri: item.imageUrl }} style={styles.sharedPostImage} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{
                    fontWeight: "bold",
                    color: item.status === "실종" ? "#ff3b30" : "#0057ff"
                  }}>
                    {item.status}
                  </Text>
                  <Text>{item.time}</Text>
                  <Text>{item.location}</Text>
                  <Text numberOfLines={1}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          {/* 닫기 버튼이 너무 아래로 치우쳐있어서 넣은 safearea */}
          <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "white" }}>
            <Button title="닫기" onPress={() => setShowPostPicker(false)} />
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "bold" },
  topPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    position: "relative",
  },
  topPostImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#ccc" },
  topPostTextWrapper: { flex: 1, marginLeft: 12 },
  topPostLabel: { fontSize: 13, color: "#333" },
  topPostValue: { fontWeight: "500" },
  topPostBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "red",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  innerContainer: { flex: 1 },
  messages: { padding: 10, paddingBottom: 20 },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
    maxWidth: "80%",
  },
  myMessage: { alignSelf: "flex-end", justifyContent: "flex-end" },
  otherMessage: { alignSelf: "flex-start" },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#ccc", marginRight: 6 },
  bubble: { backgroundColor: "#eee", borderRadius: 12, padding: 10 },
  messageText: { fontSize: 14 },
  timeText: { fontSize: 10, color: "#888", alignSelf: "flex-end", marginTop: 2 },
  dateText: { textAlign: "center", color: "#999", marginVertical: 10, fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sharedPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    maxWidth: "85%",
  },
  sharedPostImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#ddd" },
  modalContainer: { flex: 1, backgroundColor: "white", paddingTop: 60, paddingHorizontal: 16 },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 10,
  },
});
