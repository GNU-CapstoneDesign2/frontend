import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import { formatDate, formatTime } from "../utils/formatters";
//api
import fetchAdoptNoticePostDetail from "../api/fetchAdoptNoticePostDetail";

export default function AdoptNoticeDetailPage() {
    const route = useRoute();
    const navigation = useNavigation();

    const handleCall = () => {
        Linking.openURL(`tel:${postData.sheleterPhone}`);
    };

    const [postData, setPostData] = useState({
        postId: route.params.postId,
        state: "",
        createdAt: "", // 게시글 등록 날짜
        desertionNum: "", // 동물등록번호
        date: "", // 접수일
        address: "",
        petType: "",
        color: "",
        age: "",
        weight: null,
        gender: "",
        neuter: "",
        startDate: "",
        endDate: "",
        content: "", //특이사항
        shelterName: "",
        sheleterPhone: "",
        images: [],
        coordinates: {
            latitude: null,
            longitude: null,
        },
    });
    useEffect(() => {
        const fetchPostDetail = async () => {
            const result = await fetchAdoptNoticePostDetail(postData.postId);
            setPostData((prev) => ({
                ...prev,
                state: result.common.state,
                createdAt:
                    formatDate(result.common.createdAt.split("T")[0]) +
                    " " +
                    formatTime(result.common.createdAt.split("T")[1]),
                desertionNum: result.adopt.desertionNum,
                date: formatDate(result.common.date.split("T")[0]) + " " + formatTime(result.common.date.split("T")[1]),
                address: result.common.address,
                petType: result.common.petType,
                color: result.adopt.color,
                age: result.adopt.age,
                weight: result.adopt.weight,
                gender: result.adopt.gender === "M" ? "수" : "암",
                neuter: result.adopt.neuter === "NOT_NEUTERED" ? "중성화 O" : "중성화 X",
                startDate:
                    formatDate(result.adopt.startDate.split("T")[0]) +
                    " " +
                    formatTime(result.adopt.startDate.split("T")[1]),
                endDate:
                    formatDate(result.adopt.endDate.split("T")[0]) +
                    " " +
                    formatTime(result.adopt.endDate.split("T")[1]),
                content: result.common.content,
                shelterName: result.adopt.shelterName,
                sheleterPhone: result.adopt.shelterPhone,
                images: result.common.images,
                coordinates: result.common.coordinates,
            }));
        };
        fetchPostDetail();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{postData.state === "NOTICE" ? "공고중" : "입양대기"}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* 동물 사진 */}
                <View style={styles.swiperWrapper}>
                    <Swiper showsButtons={false} dotColor="#ccc" activeDotColor="#333" loop={false}>
                        {(postData.images.length > 0 ? postData.images : [{ fileURL: null }]).map((img, index) => (
                            <Image
                                key={index}
                                source={img.fileURL ? { uri: img.fileURL } : require("../assets/image_not_found.jpg")}
                                style={styles.image}
                                contentFit="contain"
                            />
                        ))}
                    </Swiper>
                </View>

                <View>
                    <Text style={styles.infoText}>게시글 등록 날짜: {postData.createdAt}</Text>
                    <Text style={styles.infoText}>동물등록번호: {postData.desertionNum}</Text>
                    <Text style={styles.infoText}>접수일: {postData.date}</Text>
                    <Text style={styles.infoText}>발견장소: {postData.address}</Text>
                    <Text style={styles.infoText}>색상: {postData.color}</Text>
                    <Text style={styles.infoText}>나이: {postData.age}</Text>
                    <Text style={styles.infoText}>체중: {postData.weight}</Text>
                    <Text style={styles.infoText}>성별: {postData.gender}</Text>
                    <Text style={styles.infoText}>중성화여부: {postData.neuter}</Text>
                    <Text style={styles.infoText}>공고시작일: {postData.startDate}</Text>
                    <Text style={styles.infoText}>공고종료일: {postData.endDate}</Text>
                    <Text style={[styles.infoText, { marginBottom: 30 }]}>특이사항: {postData.content}</Text>
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
            </ScrollView>
            {/* 전화하기 버튼 */}
            <View style={styles.buttonContainer}>
                <View style={{ marginLeft: 15 }}>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>{postData.shelterName}</Text>
                    <Text style={{ fontSize: 17, fontWeight: "700" }}>{postData.sheleterPhone}</Text>
                </View>
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Text style={styles.callButtonText}>전화하기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        height: 48,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    image: {
        width: Dimensions.get("window").width - 32,
        height: 250,
        alignSelf: "center",
    },
    mapImage: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
        marginBottom: 16,
        borderRadius: 8,
    },

    infoText: {
        fontWeight: "600",
        marginBottom: 3,
    },
    callButton: {
        backgroundColor: "#ccc",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        marginRight: 20,
    },
    callButtonText: {
        fontWeight: "bold",
    },
    swiperWrapper: {
        height: 250,
        marginBottom: 16,
        backgroundColor: "#f5f5f5",
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopColor: "#ccc",
        borderTopWidth: 0.5,
        paddingTop: 10,
    },
});
