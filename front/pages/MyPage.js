import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
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
                    <Text>마이페이지 컨텐츠</Text>
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
        justifyContent: "center",
        alignItems: "center",
    },
});
