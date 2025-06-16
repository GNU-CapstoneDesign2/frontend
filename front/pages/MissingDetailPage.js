import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { formatTime, formatDate } from "../utils/formatters"; // 날짜 포맷팅 유틸리티 함수
import WebView from "react-native-webview";
//api
import fetchLostDetail from "../api/fetchLostDetail";

export default function MissingDetailPage() {
    const route = useRoute();
    const navigation = useNavigation();

    const [postData, setPostData] = useState({
        postId: route.params?.postId || null,
        petType: "",
        name: "",
        gender: "",
        breed: "",
        petNum: "",
        phone: "",
        reward: "",

        createdAt: "",
        date: "",
        address: "",
        content: "",
        images: [],
        userId: "",
        coordinates: {
            latitude: null,
            longitude: null,
        },
    });

    // UTC 시간을 KST로 변환하는 함수
    const utcConvertToKST = (utcDate) => {
        const kstDate = new Date(utcDate);
        kstDate.setHours(kstDate.getHours() + 9);
        return kstDate.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    };

    useEffect(() => {
        const fetchPostDetail = async () => {
            const result = await fetchLostDetail(postData.postId);
            setPostData((prev) => ({
                ...prev,
                name: result["lost"].name,
                gender: result["lost"].gender,
                breed: result["lost"].breed,
                petNum: result["lost"].petNum,
                phone: result["lost"].phone,
                reward: result["lost"].reward,

                petType: result["common"].petType,
                createdAt: utcConvertToKST(result["common"].createdAt),
                date:
                    formatDate(result["common"].date.split("T")[0]) +
                    " " +
                    formatTime(result["common"].date.split("T")[1]),
                address: result["common"].address,
                content: result["common"].content,
                images: result["common"].images,
                userId: result["common"].userId,
                coordinates: result["common"].coordinates,
                writerName: result["common"].userName,
                writerProfileImg: result["common"].userImg,
            }));
        };

        fetchPostDetail();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
            {/*  커스텀 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>실종 글</Text>
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
                                style={styles.dogImage}
                                resizeMode="contain"
                            />
                        ))}
                    </Swiper>
                </View>

                {/* 강아지 정보 */}
                <View style={styles.detailInfo}>
                    <View style={styles.rowWrap}>
                        <Text style={styles.label}>이름 :</Text>
                        <Text style={styles.value}>{postData.name}</Text>
                        <Text style={styles.label}>성별 :</Text>
                        <Text style={styles.value}>{postData.gender}</Text>
                    </View>

                    <View style={styles.rowWrap}>
                        <>
                            <Text style={styles.label}>등록번호 :</Text>
                            <Text style={styles.value}>{postData.petNum}</Text>
                        </>
                        <Text style={styles.label}>품종 :</Text>
                        <Text style={styles.value}>{postData.breed}</Text>
                    </View>
                    <Text style={{ marginTop: 8 }}>🕒 실종 시간 : {postData.date}</Text>

                    <Text>📍 실종 장소 : {postData.address}</Text>

                    <Text>
                        📞 연락처 :{" "}
                        <Text style={styles.phone} onPress={() => Linking.openURL(`tel:${postData.phone}`)}>
                            {postData.phone}
                        </Text>
                    </Text>
                </View>

                {/* 지도 정적 웹뷰 */}
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

            {/* 사례금 + 채팅 */}
            <View style={styles.rewardBoxContainer}>
                <View style={styles.rewardBox}>
                    <Text style={styles.rewardText}>사례금 : {postData.reward} 원</Text>
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
    dogImage: {
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
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    mapImage: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginBottom: 12,
        resizeMode: "cover",
    },
    detailBox: {
        backgroundColor: "#f5f5f5",
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    rewardText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chatButton: {
        backgroundColor: "#5555aa",
        paddingHorizontal: 24, // 더 넓게
        paddingVertical: 12, // 더 높게
        borderRadius: 8,
        marginVertical: 10,
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
