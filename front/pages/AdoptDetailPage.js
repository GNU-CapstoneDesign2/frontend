import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
export default function AdoptDetailPage() {
    const navigation = useNavigation();

    const handleCall = () => {
        Linking.openURL("tel:01000000000");
    };

    const dogImages = [
        require("../assets/dog1.jpeg"),
        require("../assets/dog2.jpg"),
        require("../assets/dog3.png"),
        require("../assets/dog4.webp"),
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>입양대기</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* 동물 사진 */}
                <View style={styles.swiperWrapper}>
                    <Swiper showsButtons={false} dotColor="#ccc" activeDotColor="#333" loop={false}>
                        {dogImages.map((img, index) => (
                            <Image key={index} source={img} style={styles.dogImage} resizeMode="contain" />
                        ))}
                    </Swiper>
                </View>

                {/* 지도 이미지 */}
                <Image source={require("../assets/map.png")} style={styles.mapImage} />
                <View style={styles.infoBox}>
                    <Text>게시글 등록 날짜:</Text>
                    <Text>동물등록번호:</Text>
                    <Text>접수일:</Text>
                    <Text>발견장소:</Text>
                    <Text>축종:</Text>
                    <Text>색상:</Text>
                    <Text>나이:</Text>
                    <Text>체중:</Text>
                    <Text>성별:</Text>
                    <Text>중성화여부:</Text>
                    <Text>특이사항:</Text>
                    <Text>공고시작일:</Text>
                    <Text>공고종료일:</Text>
                    <Text>상태:</Text>
                    <Text>보호소명:</Text>
                    <Text>보호소전화번호:</Text>
                </View>

                {/* 전화하기 버튼 */}
                <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                    <Text style={styles.callButtonText}>전화하기</Text>
                </TouchableOpacity>
            </ScrollView>
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
    dogImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover",
        marginBottom: 16,
        borderRadius: 8,
    },
    mapImage: {
        width: "100%",
        height: 150,
        resizeMode: "cover",
        marginBottom: 16,
        borderRadius: 8,
    },
    infoBox: {
        marginBottom: 24,
    },
    callButton: {
        backgroundColor: "#ccc",
        alignSelf: "flex-end",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
    },
    callButtonText: {
        fontWeight: "bold",
    },
    swiperWrapper: {
        height: 250,
        marginBottom: 16,
    },
});
