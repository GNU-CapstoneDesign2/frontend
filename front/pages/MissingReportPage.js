//실종 신고 페이지
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { TextInput } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import ImageSelectButton from "../components/ImageSelectButton";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { normalize, SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { PaperProvider } from "react-native-paper";

import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";
import { formatPhoneNumber, formatDate, formatTime } from "../utils/formatters";

import AddressPicker from "../components/AddressPicker";
import WebView from "react-native-webview";

import * as FileSystem from "expo-file-system";

import addLostPost from "../api/addLostPost";

export default function MissingReportPage() {
    const route = useRoute();
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        //필수
        date: "",
        address: "",
        coordinates: {
            latitude: null, // 위도
            longitude: null, // 경도
        },
        //선택
        description: "", // 글 설명
        images: null, // 이미지
        name: "", // 동물 이름
        gender: "암", // 성별
        animalNum: "", // 등록번호 , 반려견만 존재하며 고양이는 등록번호 제도가 존재하지 않음
        breed: "", // 품종
        phone: "", // 연락처
        reward: null, // 사례금(Number)
    });

    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isSelectModalVisible, setIsSelectModalVisible] = useState(false); //이미지 선택 모달

    //권한 요청
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("권한 요청", "사진 접근 권한이 필요합니다.");
            }
        })();
    }, []);

    //이미지 선택
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

    //카메라 촬영
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

    //게시글 작성
    const handleSubmit = async () => {
        formData.date = formData.missingDate + "T" + formData.missingTime; //DB에서 받는 데이터 형식을 string이 아닌 dateTime ISO 8601 형식으로 설정해놓아서 KST이지만 형식만 UTC로 맞춰서 보냄
        const jsonData = {
            common: {
                state: "LOST",
                date: formData.date,
                address: formData.address,
                petType: route.params.petType,
                content: formData.description,
                coordinates: {
                    latitude: parseFloat(formData.coordinates.latitude),
                    longitude: parseFloat(formData.coordinates.longitude),
                },
            },
            lost: {
                name: formData.name,
                gender: formData.gender,
                petNum: formData.animalNum,
                breed: formData.breed,
                phone: formData.phone,
                reward: formData.reward || null,
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
        // 이미지가 있을 때 이미지 추가 코드 작성
        formData.images &&
            formData.images.forEach((imageUri, index) => {
                const fileName = imageUri.split("/").pop(); //파일 이름
                const ext = fileName.split(".").pop().toLowerCase(); //확장자
                // 확장자에 따라 타입 설정
                let type = "image/jpeg";
                if (ext === "png") type = "image/png";
                else if (ext === "webp") type = "image/webp";

                console.timeLog(imageUri, fileName, type);
                formBody.append("image", {
                    uri: imageUri,
                    name: fileName,
                    type,
                });
            });
        // 4. 실종 글 작성 api호출
        const result = await addLostPost(formBody);
        if (result) {
            navigation.navigate("SimilarPostsPage", { postId: result });
        }
    };
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                    {/* 커스텀 헤더 */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
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
                                {formData.images ? (
                                    <View style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: formData.images[0] }} style={styles.imagePreview} />

                                        <TouchableOpacity
                                            style={styles.changeImageButton}
                                            onPress={() => setIsSelectModalVisible(true)}
                                        >
                                            <Text style={styles.changeImageText}>이미지 변경</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <ImageSelectButton onPress={() => setIsSelectModalVisible(true)} />
                                )}
                            </View>
                            <Modal
                                visible={isSelectModalVisible}
                                transparent={true}
                                animationType="slide"
                                onRequestClose={() => setIsSelectModalVisible(false)}
                            >
                                <TouchableWithoutFeedback onPress={() => setIsSelectModalVisible(false)}>
                                    <View style={styles.modalOverlay} />
                                </TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => {
                                            setIsSelectModalVisible(false);
                                            handleOpenCamera();
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>카메라로 촬영</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modalButton}
                                        onPress={() => {
                                            setIsSelectModalVisible(false);
                                            handleSelectImagePress();
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>갤러리에서 선택</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                            {/* 기본 정보 입력 */}
                            <View style={styles.basicInfoSection}>
                                <View style={styles.basicInfoInputRow}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.label}>이름</Text>
                                    </View>
                                    <TextInput
                                        style={styles.basicInfoInput}
                                        value={formData.name}
                                        mode="outlined"
                                        activeOutlineColor="grey"
                                        cursorColor="black"
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
                                        mode="outlined"
                                        activeOutlineColor="grey"
                                        cursorColor="black"
                                        onChangeText={(text) => setFormData({ ...formData, breed: text })}
                                    />
                                </View>
                                <View style={styles.basicInfoInputRow}>
                                    <View style={styles.labelContainer}>
                                        <Text style={styles.label}>등록번호</Text>
                                    </View>
                                    <TextInput
                                        style={styles.basicInfoInput}
                                        value={formData.animalNum}
                                        mode="outlined"
                                        activeOutlineColor="grey"
                                        cursorColor="black"
                                        keyboardType="phone-pad"
                                        onChangeText={(text) => {
                                            const formattedText = text.replace(/[^0-9]/g, "").slice(0, 15);
                                            setFormData({ ...formData, animalNum: formattedText });
                                        }}
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
                                                <Text style={{ fontSize: SCREEN_WIDTH * 0.037 }}>암</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setFormData({ ...formData, gender: "수" });
                                                    setIsGenderOpen(false);
                                                }}
                                            >
                                                <Text style={{ fontSize: SCREEN_WIDTH * 0.037 }}>수</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/*나머지 입력 폼 */}
                        <View style={styles.formContainer}>
                            {/* 실종 날짜/ 시간 */}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>실종 날짜/시간</Text>
                                <View style={styles.dateTimeRow}>
                                    <DatePicker
                                        value={formatDate(formData.missingDate)}
                                        onConfirm={(formattedDate) =>
                                            setFormData({ ...formData, missingDate: formattedDate })
                                        }
                                    />
                                    <TimePicker
                                        value={formatTime(formData.missingTime)}
                                        onConfirm={(formattedTime) =>
                                            setFormData({ ...formData, missingTime: formattedTime })
                                        }
                                    />
                                </View>
                            </View>

                            {/* 실종 장소 선택*/}
                            <View style={styles.inputRow}>
                                <Text style={styles.label}>실종 장소</Text>
                                <AddressPicker
                                    onChange={(lat, lng, address) => {
                                        setFormData({
                                            ...formData,
                                            address,
                                            coordinates: { latitude: lat, longitude: lng },
                                        });
                                    }}
                                />
                            </View>

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

                            <View style={styles.inputRow}>
                                <Text style={styles.label}>연락처</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.phone}
                                    placeholder="010-0000-0000"
                                    mode="outlined"
                                    activeOutlineColor="grey"
                                    cursorColor="black"
                                    keyboardType="phone-pad" // 숫자 키패드 활성화
                                    onChangeText={(text) => {
                                        const formattedText = formatPhoneNumber(text);
                                        setFormData({ ...formData, phone: formattedText });
                                    }}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <Text style={styles.label}>사례금</Text>
                                <TextInput
                                    style={styles.input}
                                    value={formData.reward}
                                    mode="outlined"
                                    activeOutlineColor="grey"
                                    cursorColor="black"
                                    onChangeText={(text) => setFormData({ ...formData, reward: parseInt(text) })}
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
                                    mode="outlined"
                                    activeOutlineColor="grey"
                                    cursorColor="black"
                                    onChangeText={(text) => setFormData({ ...formData, description: text })}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>작성완료</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </PaperProvider>
        </SafeAreaProvider>
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
        fontSize: SCREEN_WIDTH * 0.038,
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
    //사진 선택
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
        marginVertical: SCREEN_HEIGHT * 0.003,
    },
    basicInfoInput: {
        flex: 1,
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.05,
        backgroundColor: "white",
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
    dateTimeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    inputRow: {
        width: "100%",
        marginBottom: SCREEN_WIDTH * 0.035,
    },
    input: {
        flex: 1,
        width: "100%",
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
    },
    //성별
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
        left: SCREEN_WIDTH * 0.21,
        right: 0,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: SCREEN_WIDTH * 0.013,
        zIndex: 1,
        elevation: 5,
    },
    dropdownItem: {
        padding: SCREEN_WIDTH * 0.027,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    //지도
    mapContainer: {
        width: "100%",
        height: SCREEN_HEIGHT * 0.25,
        backgroundColor: "#f0f0f0",
        marginBottom: SCREEN_WIDTH * 0.053,
        borderRadius: SCREEN_WIDTH * 0.013,
    },
    //설명
    descriptionInput: {
        height: SCREEN_HEIGHT * 0.2,
        textAlignVertical: "top",
    },

    //제출 버튼
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
