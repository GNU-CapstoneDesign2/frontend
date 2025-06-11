import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, formatDate } from "../utils/formatters";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import useTokenExpirationCheck from "../hooks/useTokenExpirationCheck";

export default function WitnessDetailPage() {
    // useTokenExpirationCheck();
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

    const getPostDetail = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        try {
            const response = await axios.get(`https://petfinderapp.duckdns.org/posts/found/${postData.postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const result = response.data;
                //petType, state 는 사용하지 않고 지도에서 게시글 검색 시 사용하는 정보임
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
                }));
                console.log("게시글 ID :", postData.postId);
            } else {
                console.error("게시글을 불러오는 데 실패했습니다 :", response.status);
                Alert.Alert("오류", "게시글을 불러오는 데 실패했습니다.");
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert("에러", "게시글을 불러오는 중 에러가 발생했습니다.");
            // navigation.goBack();
        }
    };

    useEffect(() => {
        getPostDetail();
    }, []);

    const handleEdit = () => console.log("수정 클릭");
    const handleDelete = () => console.log("삭제 클릭");

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
                        <Image source={{ uri: "https://placekitten.com/100/100" }} style={styles.avatar} />
                        <Text style={styles.userId}>{postData.userId}</Text>
                    </View>
                    <View style={styles.rightTopBox}>
                        <Text style={styles.dateText}>{postData.createdAt} 작성됨</Text>
                        <View style={styles.editButtons}>
                            <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
                                <Text style={styles.editBtnText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleDelete}
                                style={[styles.editBtn, { backgroundColor: "#ddd" }]}
                            >
                                <Text style={[styles.editBtnText, { color: "#000" }]}>삭제</Text>
                            </TouchableOpacity>
                        </View>
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
                    <TouchableOpacity style={styles.chatButton}>
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
        marginVertical: 12,
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
    rightTopBox: {
        alignItems: "flex-end",
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: "#888",
    },
    editButtons: {
        flexDirection: "row",
        gap: 6,
    },
    editBtn: {
        backgroundColor: "#f09090",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    editBtnText: {
        color: "white",
        fontWeight: "bold",
    },
    swiperWrapper: {
        height: 250,
        marginBottom: 16,
        backgroundColor: "#f5f5f5",
    },
    image: {
        width: Dimensions.get("window").width - 32,
        height: 250,
        borderRadius: 8,
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
});
