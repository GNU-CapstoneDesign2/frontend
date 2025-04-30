//실종 신고 페이지
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Platform,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    PixelRatio,
    Dimensions,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import ImageSelectButton from "../components/ImageSelectButton";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { normalize, SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

export default function MissingReportPage() {
    const [imageUri, setImageUri] = useState(null);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "", //이름
        breed: "", //품종
        registrationNumber: "", //등록번호
        gender: "암", //성별
        missingDate: "", //실종 날짜
        missingTime: "", //실종 시간
        location: "", //실종 장소
        contact: "", //연락처
        reward: "", //사례금
        description: "", //설명
    });
    const navigation = useNavigation();

    //접근 권한 및 갤러리,카메라 선택 수정 필요
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
                    {/* 뒤로가기 버튼 Ionicons 이 렌더링이 늦는다*/}
                    <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>실종 신고</Text>
            </View>

            {/* 컨텐츠 스크롤 뷰 */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 상단 이미지와 입력 필드 부분*/}
                <View style={styles.topSection}>
                    {/* 이미지 부분 */}
                    <View style={styles.imageSection}>
                        {imageUri ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: imageUri }} style={styles.imagePreview} />

                                {/* 카메라 선택 ,갤러리 선택 react-native-gallery 로 수정 필요*/}
                                <TouchableOpacity style={styles.changeImageButton} onPress={handleCameraPress}>
                                    <Text style={styles.changeImageText}>이미지 변경</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <ImageSelectButton onPress={handleCameraPress} />
                        )}
                    </View>
                    {/* 기본 정보 입력 */}
                    <View style={styles.basicInfoSection}>
                        <View style={styles.basicInfoInputRow}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>이름</Text>
                            </View>
                            <TextInput
                                style={styles.basicInfoInput}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        <View style={styles.basicInfoInputRow}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>품종</Text>
                            </View>
                            <TextInput
                                style={styles.basicInfoInput}
                                value={formData.breed}
                                onChangeText={(text) => setFormData({ ...formData, breed: text })}
                            />
                        </View>

                        <View style={styles.basicInfoInputRow}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>등록번호</Text>
                            </View>
                            <TextInput
                                style={styles.basicInfoInput}
                                value={formData.registrationNumber}
                                onChangeText={(text) => setFormData({ ...formData, registrationNumber: text })}
                            />
                        </View>

                        <View style={styles.basicInfoInputRow}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>성별</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setIsGenderOpen(!isGenderOpen)}
                            >
                                <Text style={styles.dropdownButtonText}>{formData.gender}</Text>
                                {/* 성별 드롭다운 버튼 Ionicons 이 렌더링이 늦는다*/}
                                <Ionicons
                                    name={isGenderOpen ? "chevron-up" : "chevron-down"}
                                    size={normalize(20)}
                                    color="#666"
                                />
                            </TouchableOpacity>
                            {isGenderOpen && (
                                <View style={styles.dropdownList}>
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, gender: "암" });
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        <Text>암</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, gender: "수" });
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        <Text>수</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/*나머지 입력 폼 */}
                <View style={styles.formContainer}>
                    <View style={styles.dateTimeRow}>
                        <View style={[styles.inputRow, styles.halfInput]}>
                            <Text style={styles.label}>실종 날짜</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ex) 2025.01.23"
                                value={formData.missingDate}
                                onChangeText={(text) => setFormData({ ...formData, missingDate: text })}
                            />
                        </View>
                        <View style={[styles.inputRow, styles.halfInput]}>
                            <Text style={styles.label}>실종 시간</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="ex) 24 : 00"
                                value={formData.missingTime}
                                onChangeText={(text) => setFormData({ ...formData, missingTime: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.label}>실종 장소</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                        />
                    </View>

                    {/* 정적 지도 영역 */}
                    <View style={styles.mapContainer} />

                    <View style={styles.inputRow}>
                        <Text style={styles.label}>연락처</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.contact}
                            onChangeText={(text) => setFormData({ ...formData, contact: text })}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <Text style={styles.label}>사례금</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.reward}
                            onChangeText={(text) => setFormData({ ...formData, reward: text })}
                        />
                    </View>

                    <View style={styles.inputRow}>
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
    //커스텀 헤더
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
    //컨텐츠 스크롤 뷰
    scrollContent: {
        flexGrow: 1,
        backgroundColor: "white",
        padding: SCREEN_WIDTH * 0.053,
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SCREEN_HEIGHT * 0.006,
        gap: SCREEN_WIDTH * 0.053,
        height: "18%",
    },
    imageSection: {
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.4,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: SCREEN_WIDTH * 0.027,
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
    basicInfoSection: {
        flex: 1,
        height: "100%",
        justifyContent: "space-around",
    },
    basicInfoInputRow: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        marginVertical: SCREEN_HEIGHT * 0.004,
    },
    labelContainer: {
        width: SCREEN_WIDTH * 0.187,
        marginRight: SCREEN_WIDTH * 0.027,
    },
    label: {
        fontSize: SCREEN_WIDTH * 0.037,
        color: "#333",
        fontWeight: "bold",
        marginBottom: SCREEN_WIDTH * 0.013,
    },
    basicInfoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        paddingLeft: SCREEN_WIDTH * 0.015,
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.05,
        backgroundColor: "white",
    },
    dateTimeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: SCREEN_WIDTH * 0.04,
        marginTop: SCREEN_WIDTH * 0.053,
    },
    halfInput: {
        flex: 1,
    },
    inputRow: {
        marginBottom: SCREEN_WIDTH * 0.053,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        paddingLeft: SCREEN_WIDTH * 0.015,
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
    },
    dropdownButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: SCREEN_HEIGHT * 0.05,
        paddingHorizontal: SCREEN_WIDTH * 0.027,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        backgroundColor: "white",
    },
    dropdownButtonText: {
        fontSize: SCREEN_WIDTH * 0.037,
        color: "#333",
    },
    dropdownList: {
        position: "absolute",
        top: "100%",
        left: SCREEN_WIDTH * 0.187,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        zIndex: 1000,
        elevation: 5,
    },
    dropdownItem: {
        padding: SCREEN_WIDTH * 0.027,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
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
