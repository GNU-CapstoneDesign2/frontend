//챗 페이지
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
export default function ChatPage() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1 }}>
            {/* 커스텀 헤더 */}
            <View style={styles.header}>
                <Text style={styles.title}>챗 목록 페이지</Text>
            </View>

            {/* 페이지 내용 */}
            <View style={styles.content}>
                <Text>채팅방 목록</Text>
            </View>

            <NavigationBar />
        </View>
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
        justifyContent: "center",
        alignItems: "center",
    },
});
