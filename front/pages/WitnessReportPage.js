//목격 제보 페이지
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker";
import ImageSelectButton from "../components/ImageSelectButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { normalize, SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

export default function MissingReportPage() {
    const [imageUri, setImageUri] = useState(null);
    const [formData, setFormData] = useState({
        witnessDate: "", //목격 날짜
        witnessTime: "", //목격 시간
        location: "", //목격 장소
        description: "", //설명
    });
    const navigation = useNavigation();

    //권한 요청
    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("권한 요청", "사진 접근 권한이 필요합니다.");
                }
            }
        })();
    }, []);

    const handleCameraPress = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0].uri;
                setImageUri(selectedImage);
            }
        } catch (error) {
            console.error("사진 선택 오류:", error);
            Alert.alert("오류", "사진을 불러오는 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            {/* 커스텀 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>목격 제보</Text>
            </View>

            {/* 컨텐츠 스크롤 뷰 */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 카메라/갤러리 */}
                <View style={styles.imageSection}>
                    {imageUri ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.changeImageButton} onPress={handleCameraPress}>
                                <Text style={styles.changeImageText}>이미지 변경</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <ImageSelectButton onPress={handleCameraPress} />
                    )}
                </View>

                {/* 입력 폼 */}
                <View style={styles.formContainer}>
                    <View style={styles.inputDateTime}>
                        <View style={[styles.inputGroup, styles.dateTimeGroup]}>
                            <Text style={styles.label}>목격 날짜</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ex) 2025.01.23"
                                value={formData.missingDate}
                                onChangeText={(text) => setFormData({ ...formData, missingDate: text })}
                            />
                        </View>

                        <View style={[styles.inputGroup, styles.dateTimeGroup]}>
                            <Text style={styles.label}>목격 시간</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ex) 24 : 00"
                                value={formData.missingTime}
                                onChangeText={(text) => setFormData({ ...formData, missingTime: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>목격 장소</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                        />
                        {/* 목격 장소 지도로 보기 */}
                        <TouchableOpacity style={styles.mapSelectButton}>
                            <Text style={styles.mapSelectText}>목격 장소 자동 입력</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 정적 지도 영역 */}
                    <View style={styles.mapContainer} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>설명</Text>
                        <TextInput
                            style={[styles.input, styles.descriptionInput]}
                            multiline
                            numberOfLines={4}
                            placeholder="특징을 적어주세요."
                            value={formData.description}
                            onChangeText={(text) => setFormData({ ...formData, description: text })}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>작성완료</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        height: SCREEN_HEIGHT * 0.07,
        paddingHorizontal: SCREEN_WIDTH * 0.043,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: SCREEN_WIDTH * 0.048,
        fontWeight: "bold",
        marginRight: SCREEN_WIDTH * 0.053,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: SCREEN_WIDTH * 0.053,
    },
    imageSection: {
        width: SCREEN_WIDTH * 0.345,
        height: SCREEN_WIDTH * 0.345,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SCREEN_WIDTH * 0.027,
        marginBottom: SCREEN_WIDTH * 0.053,
    },
    imagePreviewContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: SCREEN_WIDTH * 0.027,
        overflow: "hidden",
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: SCREEN_WIDTH * 0.027,
    },
    changeImageButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: SCREEN_WIDTH * 0.013,
        alignItems: "center",
    },
    changeImageText: {
        color: "#fff",
        fontSize: SCREEN_WIDTH * 0.032,
    },
    formContainer: {
        width: "100%",
    },
    inputDateTime: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SCREEN_WIDTH * 0.04,
    },
    dateTimeGroup: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: SCREEN_WIDTH * 0.053,
    },
    label: {
        fontSize: SCREEN_WIDTH * 0.037,
        color: "#333",
        fontWeight: "bold",
        marginBottom: SCREEN_WIDTH * 0.013,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        paddingLeft: SCREEN_WIDTH * 0.015,
        fontSize: SCREEN_WIDTH * 0.04,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
    },
    mapSelectButton: {
        backgroundColor: "#f0f0f0",
        padding: SCREEN_WIDTH * 0.032,
        borderRadius: SCREEN_WIDTH * 0.013,
        alignItems: "center",
        marginTop: SCREEN_WIDTH * 0.027,
    },
    mapSelectText: {
        fontSize: SCREEN_WIDTH * 0.037,
        fontWeight: "bold",
        color: "#666",
    },
    mapContainer: {
        width: "100%",
        height: SCREEN_HEIGHT * 0.25,
        backgroundColor: "#f0f0f0",
        marginBottom: SCREEN_WIDTH * 0.053,
        borderRadius: SCREEN_WIDTH * 0.013,
    },
    descriptionInput: {
        height: SCREEN_HEIGHT * 0.15,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#f0f0f0",
        padding: SCREEN_WIDTH * 0.04,
        borderRadius: SCREEN_WIDTH * 0.013,
        alignItems: "center",
        marginTop: SCREEN_WIDTH * 0.027,
        marginBottom: SCREEN_WIDTH * 0.053,
    },
    submitButtonText: {
        color: "#333",
        fontSize: SCREEN_WIDTH * 0.043,
        fontWeight: "bold",
    },
});
