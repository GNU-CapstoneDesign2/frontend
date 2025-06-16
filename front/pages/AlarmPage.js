import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import fetchAlarmList from "../api/fetchAlarmList";

export default function AlarmPage() {
    const navigation = useNavigation();
    const [alarmList, setAlarmList] = useState([]);

    useEffect(() => {
        const getAlarmList = async () => {
            const result = await fetchAlarmList();
            console.log(result[0].redirect.split(",")[1]);
            const newList = result.filter((item) => !item.isRead);
            const oldList = result.filter((item) => item.isRead);
            const combined = [...newList, ...oldList];
            setAlarmList(combined);
        };

        getAlarmList();
    }, []);

    const formatRelativeTimeKST = (createdAt) => {
        const KST_OFFSET = 9 * 60 * 60 * 1000;

        const created = new Date(new Date(createdAt).getTime() + KST_OFFSET); //createdAt UTC 시간을 KST 변환
        const now = new Date(new Date().getTime());
        const diffMs = now - created;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return "방금 전";
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        return `${diffDays}일 전`;
    };

    const renderItem = ({ item, index }) => {
        const prevItem = alarmList[index - 1];
        const isFirstNew = !item.isRead && (index === 0 || prevItem.isRead);
        const isFirstOld = item.isRead && (index === 0 || !prevItem.isRead);

        return (
            <View style={{ flex: 1, width: "100%" }}>
                {isFirstNew && <Text style={styles.sectionHeader}>새 알림</Text>}
                {isFirstOld && <Text style={styles.sectionHeader}>지난 알림</Text>}

                <View style={styles.card}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={{
                                uri:
                                    item.redirect && item.redirect.split(",")[0]
                                        ? item.redirect.split(",")[0]
                                        : require("../assets/not_found.png"),
                            }}
                            style={styles.image}
                        />
                        <View style={styles.messageContainer}>
                            <Text style={styles.titleText}>{item.message}</Text>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    marginTop: 12,
                                    justifyContent: "space-between",
                                }}
                            >
                                <TouchableOpacity
                                    style={{ alignSelf: "flex-start" }}
                                    onPress={() => {
                                        navigation.navigate("WitnessDetailPage", {
                                            postId: parseInt(item.redirect.split(",")[1]),
                                        });
                                    }}
                                >
                                    <Text style={styles.linkText}>해당 게시글 이동</Text>
                                </TouchableOpacity>
                                <Text style={styles.timeText}>{formatRelativeTimeKST(item.createdAt)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>알림 목록</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={alarmList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
    },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        backgroundColor: "#FFFFFF",
        justifyContent: "space-between",
    },
    headerTitle: {
        fontSize: SCREEN_WIDTH * 0.038,
        fontWeight: "bold",
        color: "#222",
    },
    sectionHeader: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
        paddingHorizontal: 10,
        marginTop: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        width: "100%",
        padding: 12,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#EAEAEA",
    },
    messageContainer: {
        flex: 1,
        marginLeft: 12,
    },
    titleText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    messageText: {
        fontSize: 14,
        fontWeight: "400",
        color: "#444",
    },
    linkText: {
        color: "#0057ff",
        fontWeight: "500",
    },
    timeText: {
        fontSize: 12,
        color: "#999",
        marginTop: 4,
    },
});
