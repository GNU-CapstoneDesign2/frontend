//목격 제보 페이지
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Platform,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import ImageSelectButton from "../components/ImageSelectButton";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { normalize, SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import AddressPicker from "../components/AddressPicker";
import { WebView } from "react-native-webview";
import { Provider as PaperProvider } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import { formatDate, formatTime } from "../utils/formatters";

import fetchSightDetail from "../api/fetchSightDetail";
import editSightPage from "../api/editSightPage";

export default function WitnessReportPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const [focusedField, setFocusedField] = useState(null);
    const [formData, setFormData] = useState({
        date: "",
        address: "", //목격 장소
        coordinates: {
            latitude: null, // 위도
            longitude: null, // 경도
        },
        content: "", //설명
        petType: "",
        images: [],
    });

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
    //기존 정보 불러오기
    useEffect(() => {
        const getSightDetail = async () => {
            const result = await fetchSightDetail(route.params.postId);
            setFormData((prev) => ({
                ...prev,
                date: result.date,
                address: result.address,
                coordinates: result.coordinates,
                content: result.content,
                petType: result.petType,
                images: result.images,
            }));
        };
        getSightDetail();
    }, []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleSelectImagePress = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                selectionLimit: 5, //최대 5장 선택
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImages = result.assets.map((asset) => asset.uri);
                setFormData({
                    ...formData,
                    images: selectedImages,
                });
            }
        } catch (error) {
            Alert.alert("오류", "사진을 불러오는 중 문제가 발생했습니다.");
        }
    };

    const handleOpenCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImages = result.assets.map((asset) => asset.uri);
                setFormData({
                    ...formData,
                    images: selectedImages,
                });
            }
        } catch (error) {
            Alert.alert("오류", "카메라를 여는 중 문제가 발생했습니다.");
        }
    };

    const handleSubmit = async () => {
        const jsonData = {
            address: formData.address,
            petType: formData.petType,
            content: formData.content,
            coordinates: {
                latitude: parseFloat(formData.coordinates.latitude),
                longitude: parseFloat(formData.coordinates.longitude),
            },
        };
        // 서버에서 @RequestPart("json")으로 JSON을 받고 있을 때 Expo에서는 JSON을 파일처럼 보내는 위장 방식 필요
        // 1. JSON을 파일로 저장
        const jsonString = JSON.stringify(jsonData);
        const fileUri = FileSystem.documentDirectory + "data.json";
        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        // 2. FormData 구성
        const formBody = new FormData();
        formBody.append("json", {
            uri: fileUri,
            name: "data.json",
            type: "application/json",
        });

        // 3. 이미지가 있다면 FormData에 추가
        if (formData.images && formData.images.length > 0) {
            formData.images.forEach((image, index) => {
                let imageUri = "";

                if (typeof image === "string") {
                    imageUri = image;
                } else if (typeof image === "object" && image.fileURL) {
                    imageUri = image.fileURL;
                } else {
                    return;
                }

                const fileName = imageUri.split("/").pop();
                const ext = fileName.split(".").pop().toLowerCase();

                let type = "image/jpeg";
                if (ext === "png") type = "image/png";
                else if (ext === "webp") type = "image/webp";

                formBody.append("image", {
                    uri: imageUri,
                    name: fileName,
                    type,
                });
            });
        }
        console.log(formBody);
        // 4. 목격 글 수정 api호출
        const result = await editSightPage(formBody, route.params.postId);
        if (result) {
            navigation.goBack();
        }
    };

    return (
        <PaperProvider>
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <View style={styles.container}>
                    {/* 커스텀 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                        </TouchableOpacity>
                        <Text style={styles.title}>목격 제보</Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* 이미지 선택 컨테이너 */}
                        <View style={styles.imageSection}>
                            {formData.images ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image
                                        source={{
                                            uri:
                                                formData.images.length > 0
                                                    ? typeof formData.images[0] === "string"
                                                        ? formData.images[0]
                                                        : formData.images[0].fileURL
                                                    : null,
                                        }}
                                        style={styles.imagePreview}
                                    />

                                    <TouchableOpacity
                                        style={styles.changeImageButton}
                                        onPress={() => setIsModalVisible(true)}
                                    >
                                        <Text style={styles.changeImageText}>이미지 변경</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <ImageSelectButton onPress={() => setIsModalVisible(true)} />
                            )}
                        </View>
                        {/* 카메라 ,갤러리 선택 모달 */}
                        <Modal
                            visible={isModalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setIsModalVisible(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                                <View style={styles.modalOverlay} />
                            </TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setIsModalVisible(false);
                                        handleOpenCamera();
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>카메라로 촬영</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setIsModalVisible(false);
                                        handleSelectImagePress();
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>갤러리에서 선택</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                        {/* 입력 폼 */}
                        <View style={styles.formContainer}>
                            <Text style={styles.label}>목격 날짜/시간</Text>
                            <View style={styles.inputDateTime}>
                                <DatePicker
                                    value={formatDate(formData.date.split("T")[0])}
                                    onConfirm={(formattedDate) =>
                                        setFormData({ ...formData, witnessDate: formattedDate })
                                    }
                                    disabled={true}
                                />
                                <TimePicker
                                    value={formatTime(formData.date.split("T")[1])}
                                    onConfirm={(formattedTime) =>
                                        setFormData({ ...formData, witnessTime: formattedTime })
                                    }
                                    disabled={true}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>목격 장소</Text>

                                <AddressPicker
                                    value={formData.address}
                                    onChange={(lat, lng, address) =>
                                        setFormData({
                                            ...formData,
                                            address,
                                            coordinates: { latitude: lat, longitude: lng },
                                        })
                                    }
                                />
                            </View>

                            {/* 정적 지도 */}
                            <View style={styles.mapContainer}>
                                {formData.coordinates.latitude !== null && formData.coordinates.longitude !== null && (
                                    <WebView
                                        key={`${formData.coordinates.latitude}-${formData.coordinates.longitude}`} //위치 재설정 동적 렌더링
                                        source={{
                                            uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html?mode=staticMap",
                                        }}
                                        javaScriptEnabled={true}
                                        originWhitelist={["*"]}
                                        injectedJavaScript={`
                                            window.staticMaplatlng = {
                                                lat: ${formData.coordinates.latitude},
                                                lng: ${formData.coordinates.longitude}
                                                };
                                                true;
                                            `}
                                    ></WebView>
                                )}
                            </View>
                            {/* 설명 */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>설명</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.descriptionInput,
                                        { borderWidth: focusedField === "content" ? 1.5 : 1 },
                                    ]}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="특징을 적어주세요."
                                    value={formData.content}
                                    cursorColor="black"
                                    onChangeText={(text) => setFormData({ ...formData, content: text })}
                                    onFocus={() => {
                                        setFocusedField("content");
                                    }}
                                    onBlur={() => {
                                        setFocusedField(null);
                                    }}
                                />
                            </View>

                            {/* 제출 버튼 */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>작성완료</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </PaperProvider>
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
        fontSize: SCREEN_WIDTH * 0.038,
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
        marginBottom: SCREEN_WIDTH * 0.053,
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
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
        borderColor: "black",
        borderRadius: 4,
        paddingVertical: 5,
        paddingLeft: 8,
        textAlign: "left",
        textAlignVertical: "center",
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
    // 이미지 선택 모달 버튼
    openModalButton: {
        backgroundColor: "#f0f0f0",
        padding: SCREEN_WIDTH * 0.04,
        borderRadius: SCREEN_WIDTH * 0.013,
        alignItems: "center",
        marginTop: SCREEN_WIDTH * 0.027,
        marginBottom: SCREEN_WIDTH * 0.053,
    },
    openModalButtonText: {
        color: "#333",
        fontSize: SCREEN_WIDTH * 0.043,
        fontWeight: "bold",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: SCREEN_WIDTH * 0.053,
        borderTopLeftRadius: SCREEN_WIDTH * 0.027,
        borderTopRightRadius: SCREEN_WIDTH * 0.027,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalButton: {
        backgroundColor: "#f0f0f0",
        padding: SCREEN_WIDTH * 0.04,
        borderRadius: SCREEN_WIDTH * 0.013,
        alignItems: "center",
        marginBottom: SCREEN_WIDTH * 0.027,
    },
    modalButtonText: {
        color: "#333",
        fontSize: SCREEN_WIDTH * 0.043,
        fontWeight: "bold",
    },
});
