import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfilePage() {
    const navigation = useNavigation();
    const [nickname, setNickname] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 프로필 사진 선택
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

    const handleSave = () => {
        console.log("수정 완료:", nickname, profileImage);
    };

    const handleWithdraw = () => {
        setShowModal(true);
    };

    const confirmWithdraw = () => {
        setShowModal(false);
        // 실제 계정 탈퇴 로직 추가
        console.log("계정 탈퇴 처리");
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>정보수정</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* 프로필 섹션 */}
            <View style={styles.profileSection}>
                <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <Ionicons name="camera" size={24} color="#000" />
                            <Text style={styles.profileImageText}>프로필 사진 변경</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput style={styles.input} placeholder="닉네임 변경" value={nickname} onChangeText={setNickname} />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>수정완료</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
                    <Text style={styles.buttonText}>계정탈퇴</Text>
                </TouchableOpacity>
            </View>

            {/* 계정탈퇴 모달 */}
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
    headerTitle: { fontSize: 16, fontWeight: "bold" },
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
