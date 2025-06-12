import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
//api
import fetchMyInfo from "../api/fetchMyinfo";
import editMyInfo from "../api/editMyInfo";
import deleteUser from "../api/deleteUser";

export default function EditProfilePage() {
    const navigation = useNavigation();

    // State 정의
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const [originalNickname, setOriginalNickname] = useState("");
    const [originalImage, setOriginalImage] = useState(null);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        //기존 내 정보 조회
        const getMyInfo = async () => {
            const orginalInfo = await fetchMyInfo();
            setNickname(orginalInfo.name);
            setProfileImage(orginalInfo.image);
            setOriginalNickname(orginalInfo.name);
            setOriginalImage(orginalInfo.image);
        };
        getMyInfo();
    }, []);

    // 앨범에서 이미지 선택
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("사진 접근 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Cloudinary에 업로드 후 URL 반환
    const uploadToCloudinary = async (imageUri) => {
        const formData = new FormData();
        formData.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "profile.jpg",
        });
        formData.append("upload_preset", "profile_preset");

        const response = await fetch("https://api.cloudinary.com/v1_1/duz332ntn/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {
            return data.secure_url;
        } else {
            throw new Error("Cloudinary 업로드 실패");
        }
    };

    // 저장 버튼
    const handleSave = async () => {
        const isNicknameChanged = nickname.trim() !== originalNickname.trim();
        const isImageChanged = profileImage != null && profileImage !== originalImage;

        if (!isNicknameChanged && !isImageChanged) {
            Alert.alert("안내", "변경된 내용이 없습니다.");
            return;
        }

        // 닉네임 길이 유효성 검사 (2자 이상 10자 이하)
        if (isNicknameChanged && (nickname.trim().length < 2 || nickname.trim().length > 10)) {
            Alert.alert("안내", "닉네임은 2자 이상 10자 이하로 입력해주세요.");
            return;
        }

        // imageUrl 기본값으로 원래 이미지 URL 세팅
        let imageUrl = originalImage;
        if (isImageChanged) {
            imageUrl = await uploadToCloudinary(profileImage);
        }

        // 항상 name과 imageUrl을 포함
        const body = {
            name: nickname,
            imageUrl: imageUrl,
        };
        //저장 api 호출
        editMyInfo(body, navigation);
    };

    // 계정 탈퇴
    const handleWithdraw = () => {
        setShowModal(true);
    };

    const confirmWithdraw = async () => {
        setShowModal(false);
        deleteUser(navigation);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>정보수정</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 프로필 이미지 + 닉네임 수정 영역 */}
            <View style={styles.profileSection}>
                <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
                    {profileImage ? (
                        <View>
                            <Image source={{ uri: profileImage }} style={styles.profileImage} blurRadius={8} />
                            <View style={styles.overlay}>
                                <Ionicons name="camera" size={24} color="#fff" />
                                <Text style={styles.overlayText}>프로필 사진 변경</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Ionicons name="camera" size={24} color="#000" />
                            <Text style={styles.profileImageText}>프로필 사진 변경</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="닉네임 변경"
                        value={nickname}
                        onChangeText={setNickname}
                    />
                    {nickname.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setNickname("")}
                            style={{ position: "absolute", right: 2, padding: 8, zIndex: 2 }}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                            <Ionicons name="close-circle" size={20} color="#bbb" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>수정완료</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
                    <Text style={styles.buttonText}>계정탈퇴</Text>
                </TouchableOpacity>
            </View>

            {/* 탈퇴 확인 모달 */}
            <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>정말 탈퇴하시겠어요?</Text>
                        <View style={styles.modalButtons}>
                            <Pressable onPress={() => setShowModal(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelText}>취소</Text>
                            </Pressable>
                            <Pressable onPress={confirmWithdraw} style={styles.confirmButton}>
                                <Text style={styles.confirmText}>탈퇴</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        justifyContent: "space-between",
    },
    headerTitle: { fontSize: SCREEN_WIDTH * 0.038, fontWeight: "bold" },

    profileSection: {
        alignItems: "center",
        padding: 24,
    },
    profileImageButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#eee",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        overflow: "hidden",
    },
    profileImage: {
        width: 100,
        height: 100,
        resizeMode: "cover",
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    overlayText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 4,
    },
    profileImageText: {
        fontSize: 12,
        marginTop: 4,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
    },
    button: {
        width: "100%",
        backgroundColor: "#e0e0e0",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000088",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginRight: 12,
    },
    cancelText: {
        fontWeight: "500",
    },
    confirmButton: {
        backgroundColor: "#f66",
        padding: 10,
        borderRadius: 8,
    },
    confirmText: {
        fontWeight: "500",
        color: "#fff",
    },
});
