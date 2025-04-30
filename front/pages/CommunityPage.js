import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
export default function CommunityPage() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            {/* 커스텀 헤더 */}
            <View style={styles.header}>
                <Text style={styles.title}>커뮤니티</Text>
            </View>

            {/* 페이지 내용 */}
            <View style={styles.content}>
                <Text>커뮤니티 컨텐츠</Text>
            </View>

            <NavigationBar />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
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
