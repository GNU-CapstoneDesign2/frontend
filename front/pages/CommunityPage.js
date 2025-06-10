import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import { PaperProvider } from "react-native-paper";

export default function CommunityPage() {
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={{ flex: 1 }}>
                    {/* 커스텀 헤더 */}
                    <View style={styles.header}>
                        <Text style={styles.title}>커뮤니티</Text>
                    </View>

                    {/* 페이지 내용 */}
                    <View style={styles.content}>
                        <Text> 커뮤니티 페이지 내용</Text>
                    </View>

                    <NavigationBar />
                </View>
            </SafeAreaView>
        </PaperProvider>
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
    //
});
