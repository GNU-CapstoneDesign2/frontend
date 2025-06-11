import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import useTokenExpirationCheck from "../hooks/useTokenExpirationCheck";
const myPosts = [
    {
        id: "p1",
        status: "실종",
        time: "2025-04-08T15:30:00Z",
        location: "서울 강남구",
        description: "실종 대상에 대한 상세 설명",
        imageUrl: "https://via.placeholder.com/100",
    },
];

export default function ChatRoomPage() {
    // useTokenExpirationCheck();
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { id: "1", sender: "me", text: "ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ", time: "오후 4:25", date: "2025년 3월 16일 월요일" },
        { id: "2", sender: "other", text: "ㅁㅁㅁㅁㅁㅁㅁ", time: "오후 4:26" },
    ]);
    const [showPostPicker, setShowPostPicker] = useState(false);

    const handleSend = () => {
        if (!message.trim()) return;
        const newMsg = {
            id: Date.now().toString(),
            sender: "me",
            text: message,
            time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newMsg]);
        setMessage("");
    };

    const handleSelectPost = (post) => {
        const postMessage = {
            id: Date.now().toString(),
            sender: "me",
            post,
        };
        setMessages((prev) => [...prev, postMessage]);
        setShowPostPicker(false);
    };

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
                        {item.time && <Text style={styles.timeText}>{item.time}</Text>}
                    </View>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* 상단 커스텀 헤더 */}
            <View style={styles.header}>
                <View style={styles.headerSide}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>채팅</Text>
                </View>
                <View style={styles.headerSide} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.innerContainer}
            >
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.messages}
                />

                {/* 하단 입력창 */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowPostPicker(true)} style={{ marginRight: 10 }}>
                        <Image source={require("../assets/share-icon.jpg")} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        placeholder="메시지 입력"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={{ color: "white" }}>전송</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* 모달 - 게시글 선택 */}
            <Modal visible={showPostPicker} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <FlatList
                        data={myPosts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectPost(item)}>
                                <Image source={{ uri: item.imageUrl }} style={styles.sharedPostImage} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={{ fontWeight: "bold", color: "red" }}>{item.status}</Text>
                                    <Text>{item.time}</Text>
                                    <Text>{item.location}</Text>
                                    <Text numberOfLines={1}>{item.description}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="닫기" onPress={() => setShowPostPicker(false)} />
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
    },
    headerSide: {
        width: 56,
        alignItems: "center",
        justifyContent: "center",
    },
    headerCenter: {
        flex: 1,
        alignItems: "center",
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },

    innerContainer: { flex: 1 },
    messages: { padding: 10, paddingBottom: 20 },
    messageContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
        maxWidth: "80%",
    },
    myMessage: {
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    otherMessage: {
        alignSelf: "flex-start",
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#ccc",
        marginRight: 6,
    },
    bubble: {
        backgroundColor: "#eee",
        borderRadius: 12,
        padding: 10,
    },
    messageText: {
        fontSize: 14,
    },
    timeText: {
        fontSize: 10,
        color: "#888",
        alignSelf: "flex-end",
        marginTop: 2,
    },
    dateText: {
        textAlign: "center",
        color: "#999",
        marginVertical: 10,
        fontSize: 12,
    },
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
    sharedPostImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: "#ddd",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    modalItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
        paddingBottom: 10,
    },
});
