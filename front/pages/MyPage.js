import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
//api
import fetchMyInfo from "../api/fetchMyinfo";
import logout from "../api/logout";

export default function MyPage() {
    const navigation = useNavigation();
    const [myInfo, setMyInfo] = useState({
        name: "",
        image: null,
    });

    const handleLogout = async () => {
        logout(navigation);
    };

    useEffect(() => {
        const loadMyInfo = async () => {
            const myInfoData = await fetchMyInfo();
            setMyInfo({
                name: myInfoData.name || "",
                image:
                    myInfoData.image ||
                    "http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg",
            });
        };
        loadMyInfo();
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
                        source={{ uri: myInfo.image }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.userId}>
                        <Text style={{ fontWeight: "bold" }}>{myInfo.name}</Text>
                    </Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfilePage")}>
                        <Text style={styles.editButtonText}>정보수정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate("MyPostListPage")}>
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
