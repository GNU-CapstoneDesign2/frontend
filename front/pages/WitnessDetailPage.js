import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, formatDate } from "../utils/formatters";
import WebView from "react-native-webview";
//api
import fetchSightDetail from "../api/fetchSightDetail";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WitnessDetailPage() {
    const route = useRoute();
    const navigation = useNavigation();

    const [postData, setPostData] = useState({
        postId: route.params?.postId || null,
        userId: "",
        state: "SIGHT",
        creatAt: "",
        date: "",
        address: "",
        petType: "",
        content: "",
        coordinates: {
            latitude: null,
            longitude: null,
        },
        images: [],
    });

    // UTC 시간을 KST로 변환하는 함수
    const utcConvertToKST = (utcDate) => {
        const kstDate = new Date(utcDate);
        kstDate.setHours(kstDate.getHours() + 9);
        return kstDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            const result = await fetchSightDetail(postData.postId);
            console.log(result);
            if (result) {
                setPostData((prev) => ({
                    ...prev,
                    userId: result.userId,
                    createdAt: utcConvertToKST(result.createdAt),
                    date: formatDate(result.date.split("T")[0]) + " " + formatTime(result.date.split("T")[1]),
                    address: result.address,
                    petType: result.petType,
                    content: result.content,
                    images: result.images,
                    coordinates: result.coordinates,
                    writerName: result.userName,
                    writerProfileImg: result.userImg,
                }));
            } else {
                Alert.alert("해당 게시글을 찾을 수 없습니다.");
                navigation.goBack();
            }
        };
        fetchPostDetail();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/*  커스텀 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>목격 글</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* 사용자 정보 + 등록일 + 수정/삭제 */}
                <View style={styles.topRow}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: postData.writerProfileImg }} style={styles.avatar} />
                        <Text style={styles.userId}>{postData.writerName}</Text>
                    </View>
                    <View>
                        <Text style={styles.dateText}>{postData.createdAt} 작성됨</Text>
                    </View>
                </View>

                {/* 이미지 슬라이더 */}
                <View style={styles.swiperWrapper}>
                    <Swiper showsButtons={false} dotColor="#ccc" activeDotColor="#333" loop={false}>
                        {(postData.images.length > 0 ? postData.images : [{ fileURL: null }]).map((img, index) => (
                            <Image
                                key={index}
                                source={img.fileURL ? { uri: img.fileURL } : require("../assets/image_not_found.jpg")}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        ))}
                    </Swiper>
                </View>

                {/* 목격 정보 */}
                <View style={styles.detailInfo}>
                    <Text style={{ marginTop: 8 }}>🕒 목격 시간 : {postData.date}</Text>
                    <Text>📍 목격 장소 : {postData.address}</Text>
                </View>

                {/* 지도 이미지 */}
                <View style={styles.mapImage}>
                    <WebView
                        key={`${postData.coordinates.latitude}-${postData.coordinates.longitude}`}
                        source={{
                            uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html?mode=staticMap",
                        }}
                        javaScriptEnabled={true}
                        originWhitelist={["*"]}
                        injectedJavaScript={`
                                            window.staticMaplatlng = {
                                                lat: ${postData.coordinates.latitude},
                                                lng: ${postData.coordinates.longitude}
                                            };
                                            true;
                                        `}
                    />
                </View>

                {/* 상세내용 */}
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>{postData.content || "상세 내용이 없습니다."}</Text>
                </View>
            </ScrollView>

            <View style={styles.rewardBoxContainer}>
                <View style={styles.rewardBox}>
                    <TouchableOpacity
                    style={styles.chatButton}
                    onPress={async () => {
                        try {
                        const token = await AsyncStorage.getItem("accessToken");
                        if (!token) {
                            Alert.alert("로그인이 필요합니다");
                            return;
                        }

                        const response = await fetch("https://petfinderapp.duckdns.org/chatrooms", {
                            method: "POST",
                            headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ postId: postData.postId }),
                        });

                        const result = await response.json();

                        console.log("응답 상태코드:", response.status);
                        console.log("응답 바디:", result);
                        console.log("보낸 postId:", postData.postId);

                        if ((response.status === 200 || response.status === 201) && result.data?.roomId) {
                        navigation.navigate("ChatRoomPage", { roomId: result.data.roomId });
                        } else {
                        Alert.alert("채팅방 생성 실패", result.message || "알 수 없는 오류");
                        }
                        } catch (error) {
                        console.error("채팅방 생성 오류:", error);
                        Alert.alert("오류", "채팅방 생성 중 문제가 발생했습니다.");
                        }
                    }}
                    >
                    <Text style={{ color: "white" }}>채팅하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    header: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        paddingHorizontal: 0,
    },
    backButton: {
        paddingHorizontal: 12,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 24,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 13,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        backgroundColor: "#ccc",
    },
    userId: {
        fontSize: 16,
        fontWeight: "bold",
    },
    dateText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#888",
    },
    swiperWrapper: {
        height: 250,
        marginBottom: 16,
        backgroundColor: "black",
    },
    image: {
        width: Dimensions.get("window").width - 32,
        height: 250,
        alignSelf: "center",
    },
    detailInfo: {
        marginBottom: 12,
        gap: 4,
    },
    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 4,
    },
    label: {
        fontWeight: "bold",
        marginRight: 4,
    },
    value: {
        marginRight: 12,
        maxWidth: "40%",
    },
    phone: {
        color: "blue",
        textDecorationLine: "underline",
    },
    mapImage: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: "cover",
    },
    detailBox: {
        backgroundColor: "#eee",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    detailText: {
        color: "#333",
        fontSize: 14,
        lineHeight: 20,
    },
    rewardBoxContainer: {
        borderTopWidth: 0.5,
        borderTopColor: "#ccc",
    },
    rewardBox: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    rewardText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chatButtonWrapper: {
        alignItems: "flex-end",
    },
    chatButton: {
        backgroundColor: "#5555aa",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    fullscreenImage: {
        width: "100%",
        height: "100%",
    },
});
