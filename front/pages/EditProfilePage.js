import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import axios from "axios";

export default function EditProfilePage() {
  const navigation = useNavigation();

  // State 정의
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const [originalNickname, setOriginalNickname] = useState("");
  const [originalImage, setOriginalImage] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // 마운트 시점에 유저 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        navigation.replace("LoginPage");
        return;
      }

      try {
        const response = await axios.get(
          "https://petfinderapp.duckdns.org/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.data;

        // 필드 읽어서 저장
        setNickname(user.name);
        setProfileImage(user.image);
        setOriginalNickname(user.name);
        setOriginalImage(user.image);
      } catch (err) {
        Alert.alert("오류", "회원 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchUserInfo();
  }, [navigation]);

  // 앨범에서 이미지 선택
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/duz332ntn/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Cloudinary 업로드 실패");
    }
  };

  // 저장 버튼
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        navigation.replace("LoginPage");
        return;
      }

      const isNicknameChanged =
        nickname.trim() !== originalNickname.trim();
      const isImageChanged =
        profileImage != null && profileImage !== originalImage;

      if (!isNicknameChanged && !isImageChanged) {
        alert("변경된 내용이 없습니다.");
        return;
      }

      // 닉네임 길이 유효성 검사 (2자 이상 10자 이하)
      if (
        isNicknameChanged &&
        (nickname.trim().length < 2 || nickname.trim().length > 10)
      ) {
        alert("닉네임은 2자 이상 10자 이하로 입력해주세요.");
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

      const response = await axios.put(
        "https://petfinderapp.duckdns.org/users/me",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("수정이 완료되었습니다.");
        navigation.replace("MyPage");
      }
    } catch (error) {
      Alert.alert(
        "수정 실패",
        error.response?.data?.message || "오류가 발생했습니다."
      );
    }
  };

  // 계정 탈퇴
  const handleWithdraw = () => {
    setShowModal(true);
  };
  const confirmWithdraw = async () => {
    setShowModal(false);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        navigation.replace("LoginPage");
        return;
      }
      await axios.delete("https://petfinderapp.duckdns.org/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      await AsyncStorage.clear();
      navigation.replace("LoginPage");
    } catch (error) {
      Alert.alert("탈퇴 실패", "잠시 후 다시 시도해주세요.");
    }
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
        <TouchableOpacity
          style={styles.profileImageButton}
          onPress={pickImage}
        >
          {profileImage ? (
            <View>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                blurRadius={8}
              />
              <View style={styles.overlay}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.overlayText}>
                  프로필 사진 변경
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera" size={24} color="#000" />
              <Text style={styles.profileImageText}>
                프로필 사진 변경
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="닉네임 변경"
          value={nickname}
          onChangeText={setNickname}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>수정완료</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
          <Text style={styles.buttonText}>계정탈퇴</Text>
        </TouchableOpacity>
      </View>

      {/* 탈퇴 확인 모달 */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              정말 탈퇴하시겠어요?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setShowModal(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>취소</Text>
              </Pressable>
              <Pressable
                onPress={confirmWithdraw}
                style={styles.confirmButton}
              >
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
