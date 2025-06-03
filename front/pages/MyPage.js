import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

export default function MyPage() {
    const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState({
        name: "",
        image: null,
    });

    //내 정보 조회 API 호출
    const fetchUserInfo = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        try {
            const response = await axios.get("https://petfinderapp.duckdns.org/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                const result = response.data;
                //유저 정보 처리
                setUserInfo({
                    name: result.data?.name || "",
                    image:
                        result.data?.image ||
                        "http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
                });
            } else {
                //실패 시 처리 코드
                console.log("유저 정보 가져오기 실패");
            }
        } catch (error) {
            console.log("API 호출 오류:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");

            const response = await axios.post(
                "https://petfinderapp.duckdns.org/auth/logout",
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("로그아웃 응답:", response.data);

            await AsyncStorage.removeItem("accessToken"); // 토큰 제거
            navigation.replace("LoginPage"); // 로그인 페이지로 이동
        } catch (error) {
            console.error("로그아웃 실패:", error.response?.data || error.message);
        }
    };



    useEffect(() => {
        // 컴포넌트가 마운트될 때 유저 정보 가져오기
        fetchUserInfo();
    }, []);
    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
            <View style={{ flex: 1 }}>
                {/* 커스텀 헤더 */}
                <View style={styles.header}>
                    <Text style={styles.title}>마이페이지</Text>
                </View>

                {/* 마이페이지 내용 */}
                <View style={styles.content}>
                    <Image
                        // 유저 정보 기반 프로필 이미지 반영
                        source={{ uri: userInfo.image }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userId}>
                        <Text style={{ fontWeight: "bold" }}>{userInfo.name}</Text>
                    </Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfilePage")}>
                        <Text style={styles.editButtonText}>정보수정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuButton}>
                        <Text style={styles.menuButtonText}>내 게시물 보기</Text>
                    </TouchableOpacity>

                    {/* 로그인 페이지로 이동 */}
                    <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
                        <Text style={styles.menuButtonText}>로그아웃</Text>
                    </TouchableOpacity>
                </View>

                <NavigationBar />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
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
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 32,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#ccc",
        marginBottom: 10,
    },
    userId: {
        fontSize: 16,
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 20,
    },
    editButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    menuButton: {
        width: "100%",
        backgroundColor: "#e0e0e0",
        paddingVertical: 12,
        marginVertical: 8,
        borderRadius: 12,
        alignItems: "center",
    },
    menuButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
});
