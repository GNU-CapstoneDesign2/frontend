//챗 페이지
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH } from "../utils/normalize";
import { PaperProvider } from "react-native-paper";
export default function ChatPage() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={{ flex: 1 }}>
                    {/* 커스텀 헤더 */}
                    <View style={styles.header}>
                        <Text style={styles.title}>챗 목록 페이지</Text>
                    </View>

                    {/* 페이지 내용 */}
                    <View style={styles.content}>
                        <Text>채팅방 목록</Text>
                    </View>
                </View>
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
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});
