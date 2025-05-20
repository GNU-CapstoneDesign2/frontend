import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

const dogImages = [
    require("../assets/dog1.jpeg"),
    require("../assets/dog2.jpg"),
    require("../assets/dog3.png"),
    require("../assets/dog4.webp"),
];

export default function MissingDetailPage() {
    const phoneNumber = "01000000000";
    const navigation = useNavigation();

    const handleEdit = () => console.log("수정 클릭");
    const handleDelete = () => console.log("삭제 클릭");

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
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
                        <Image source={{ uri: "https://placekitten.com/100/100" }} style={styles.avatar} />
                        <Text style={styles.userId}>user_id 1231232</Text>
                    </View>
                    <View style={styles.rightTopBox}>
                        <Text style={styles.dateText}>게시글 등록 날짜</Text>
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
                        {dogImages.map((img, index) => (
                            <Image key={index} source={img} style={styles.dogImage} resizeMode="contain" />
                        ))}
                    </Swiper>
                </View>

                {/* 강아지 정보 */}
                <View style={styles.detailInfo}>
                    <View style={styles.rowWrap}>
                        <Text style={styles.label}>이름 :</Text>
                        <Text style={styles.value}>보리</Text>
                        <Text style={styles.label}>성별 :</Text>
                        <Text style={styles.value}>수컷</Text>
                    </View>
                    <View style={styles.rowWrap}>
                        <Text style={styles.label}>등록번호 :</Text>
                        <Text style={styles.value}>1234-5678</Text>
                        <Text style={styles.label}>품종 :</Text>
                        <Text style={styles.value}>포메라니안</Text>
                    </View>
                    <Text style={{ marginTop: 8 }}>🕒 2025년 03월 15일 오후 00:00 실종</Text>
                    <Text>📍 경상남도 진주시 가좌동 ○○○○○</Text>
                    <Text style={styles.phone} onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
                        📞 010 - 0000 - 0000
                    </Text>
                </View>

                {/* 지도 이미지 */}
                <Image source={require("../assets/map.png")} style={styles.mapImage} />

                {/* 상세내용 */}
                <View style={styles.detailBox}>
                    <Text style={styles.detailText}>
                        하얀 포메라니안이며, 사람을 잘 따르고 겁이 많습니다. 마지막으로 본 곳은 경상국립대학교 근처이며
                        빨간 목줄을 착용하고 있었습니다. 목격하신 분은 꼭 연락 부탁드립니다.
                    </Text>
                </View>

                {/* 사례금 + 채팅 */}
                <View style={styles.rewardBox}>
                    <Text style={styles.rewardText}>사례금 : 100,000원</Text>
                    <TouchableOpacity style={styles.chatButton}>
                        <Text style={{ color: "white" }}>채팅하기</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    rewardBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rewardText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    chatButton: {
        backgroundColor: "#5555aa",
        paddingHorizontal: 24, // 더 넓게
        paddingVertical: 12, // 더 높게
        borderRadius: 8,
    },
});
