//유사 게시글 조회 페이지
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SCREEN_HEIGHT, SCREEN_WIDTH, normalize } from "../utils/normalize";

import LottieView from "lottie-react-native";
export default function SimilarPostsPage() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // TODO: 실제 API 엔드포인트로 교체
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 예시: fetch("/api/similar-posts")
                // 아래는 목업 데이터 (실제 API 호출로 교체)
                const response = {
                    status: 200,
                    data: {
                        content: [
                            {
                                postId: 101,
                                state: "목격",
                                date: "2025년 04월 08일 15시 30분",
                                address: "서울 강남구",
                                description: "실종 대상에 대한 상세 설명",
                                imageUrl: "https://cdn.pixabay.com/photo/2017/10/04/02/24/puppy-2814858_640.jpg",
                            },
                            {
                                postId: 102,
                                state: "입양대기",
                                date: "2025년 04월 07일 12시 00분",
                                address: "부산 해운대구",
                                description: "실종 대상에 대한 간략한 설명",
                                imageUrl: "https://cdn.pixabay.com/photo/2017/10/04/02/24/puppy-2814858_640.jpg",
                            },
                        ],
                    },
                };
                // 실제 사용시 아래 주석 해제
                // const res = await fetch('API_URL');
                // const response = await res.json();
                if (response.status === 200) {
                    setPosts(response.data.content);
                } else {
                    setPosts([]);
                }
            } catch (e) {
                setError("오류가 발생했습니다.");
                setPosts([]);
            } finally {
                // setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stateBadgeColor = (state) => {
        switch (state) {
            case "실종":
                return { backgroundColor: "#1abc54" };
            case "공고중":
                return { backgroundColor: "#0057ff" };
            case "목격":
                return { backgroundColor: "#1abc54" };
            case "입양대기":
                return { backgroundColor: "#ffd600" };
            default:
                return { backgroundColor: "#ccc" };
        }
    };

    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={{ flex: 1 }}>
                    {/* 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                            <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>유사도 매칭 결과</Text>
                    </View>
                    {/* 컨텐츠 화면 */}
                    <View style={styles.content}>
                        {loading ? (
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
                                    분석 중...
                                </Text>
                            </View>
                        ) : error ? (
                            //에러 발생 화면
                            <Text style={{ textAlign: "center", color: "red", marginTop: 30 }}>{error}</Text>
                        ) : posts.length === 0 ? (
                            //유사 게시글 없을 때
                            <Text style={{ textAlign: "center", marginTop: 30 }}>
                                유사한 게시글이 존재하지 않습니다.
                            </Text>
                        ) : (
                            posts.map((post) => (
                                <View key={post.postId} style={styles.card}>
                                    <View
                                        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                                    >
                                        <View style={styles.imageWrapper}>
                                            <Image source={{ uri: post.imageUrl }} style={styles.image} />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <View style={[styles.stateBadge, stateBadgeColor(post.state)]}>
                                                <Text style={styles.stateBadgeText}>{post.state}</Text>
                                            </View>
                                            <Text style={styles.infoText}>시간: {post.date ? post.date : ""}</Text>
                                            <Text style={styles.infoText}>장소: {post.address}</Text>
                                            <Text style={styles.infoText}>설명: {post.description}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                            // <View>
                            //     <Text>adasd</Text>
                            // </View>
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
        // justifyContent: "center",
        padding: SCREEN_WIDTH * 0.03,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "column",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 12,
        padding: 12,
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
