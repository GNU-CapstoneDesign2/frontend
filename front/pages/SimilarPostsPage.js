//유사 게시글 조회 페이지
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SCREEN_HEIGHT, SCREEN_WIDTH, normalize } from "../utils/normalize";

import LottieView from "lottie-react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import EventSource from "react-native-event-source";

import { formatDate, formatTime } from "../utils/formatters";
export default function SimilarPostsPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const esRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                const url = `https://petfinderapp.duckdns.org/similarity?postId=${route.params.postId}&token=${token}`;
                const headers = { Accept: "text/event-stream" };
                const es = new EventSource(url, { headers });
                esRef.current = es;
                es.addEventListener("open", () => console.log("SSE 연결 열림"));
                es.addEventListener("ping", (e) => console.log("SSE 메시지:", e.data));
                es.addEventListener("complete", (e) => {
                    setLoading(false);
                    const result = JSON.parse(e.data);
                    console.log(result.items);
                    setPosts(result.items);
                    es.close();
                });
                es.addEventListener("error", (e) => {
                    console.error("SSE 에러:", e);
                    es.close();
                    esRef.current = null;
                });
            } catch (e) {
                console.error("[SSE] 요청 실패", e);
            }
        };

        fetchData();

        return () => {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
        };
    }, [route.params.postId]); // postId가 바뀔 때만 재실행되도록 의존성 지정

    const stateBadgeColor = (state) => {
        switch (state) {
            case "LOST":
                return { backgroundColor: "#1abc54" };
            case "SIGHT":
                return { backgroundColor: "#0057ff" };
            case "NOTICE":
                return { backgroundColor: "#1abc54" };
            case "ADOPT":
                return { backgroundColor: "#ffd600" };
            default:
                return { backgroundColor: "#ccc" };
        }
    };
    const filterMap = {
        LOST: "실종",
        SIGHT: "목격",
        NOTICE: "공고중",
        ADOPT: "입양대기",
    };
    const navigateRoute = (state) => {
        switch (state) {
            case "SIGHT":
                return "WitnessDetailPage";
            case "NOTICE":
                return "AdoptNoticeDetailPage";
            case "ADOPT":
                return "AdoptNoticeDetailPage";
        }
    };
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={{ flex: 1 }}>
                    {/* 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>유사도 매칭 결과</Text>
                    </View>

                    <View style={styles.content}>
                        {loading ? (
                            // 로딩 화면
                            <View style={{ alignItems: "center", marginTop: 30 }}>
                                <LottieView
                                    source={require("../assets/loading.json")}
                                    autoPlay
                                    loop
                                    style={{ width: 200, height: 200 }}
                                />
                                <Text
                                    style={{ textAlign: "center", fontSize: 18, marginBottom: 4, fontWeight: "bold" }}
                                >
                                    잠시만 기다려주세요...
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: "#888",
                                        fontWeight: "bold",
                                        marginBottom: 100,
                                    }}
                                >
                                    유사한 동물을 찾고있어요
                                </Text>
                            </View>
                        ) : !posts && posts.length === 0 ? (
                            // 유사 게시글 없음
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 100,
                                }}
                            >
                                <View style={{ marginBottom: 30 }}>
                                    <Image
                                        source={require("../assets/no-results.png")}
                                        style={{ width: 200, height: 200 }}
                                    ></Image>
                                </View>
                                <Text style={{ textAlign: "center", fontWeight: "bold", color: "grey" }}>
                                    유사한 동물을 찾지 못했어요
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={posts}
                                keyExtractor={(item) => item.similarPostId}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate(navigateRoute(item.postState), {
                                                postId: item.similarPostId,
                                            });
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.card}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <View style={styles.imageWrapper}>
                                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                                </View>
                                                <View style={{ flex: 1, marginLeft: 10 }}>
                                                    <View style={[styles.stateBadge, stateBadgeColor(item.postState)]}>
                                                        <Text style={styles.stateBadgeText}>
                                                            {filterMap[item.postState]}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.infoText}>
                                                        시간:{" "}
                                                        {formatDate(item.date.split("T")[0]) +
                                                            " " +
                                                            formatTime(item.date.split("T")[1]) || ""}
                                                    </Text>
                                                    <Text
                                                        style={styles.infoText}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        장소: {item.address}
                                                    </Text>
                                                    <Text
                                                        style={styles.infoText}
                                                        numberOfLines={1}
                                                        ellipsizeMode="tail"
                                                    >
                                                        설명: {item.description}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
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
        alignItems: "center",
        height: SCREEN_HEIGHT * 0.07,
        paddingHorizontal: SCREEN_WIDTH * 0.043,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: SCREEN_WIDTH * 0.038,
        fontWeight: "bold",
        marginRight: SCREEN_WIDTH * 0.053,
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "column",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 7,
        elevation: 4,
        padding: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#eee",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    stateBadge: {
        alignSelf: "flex-end",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginBottom: 5,
        marginTop: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    stateBadgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    infoText: {
        fontSize: 14,
        color: "#222",
        marginBottom: 2,
    },
});
