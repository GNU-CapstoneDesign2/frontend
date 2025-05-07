import React, { useRef, useMemo, useState } from "react";
import {
    TextInput,
    StyleSheet,
    SafeAreaView,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    Animated,
    Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_WIDTH, SCREEN_HEIGHT, normalize } from "../utils/normalize";

/*webview */
import { WebView } from "react-native-webview";
/*navigationBar */
import NavigationBar from "../components/NavigationBar/NavigationBar";
/*bottomSheet */
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
/*Buttons*/
// import GpsButton from "../components/GpsButton";
import AlarmButton from "../components/AlarmButton";

export default function MainPage() {
    // 검색 타입 드롭박스 상태 변수
    const [searchType, setSearchType] = useState("주소");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // 검색창 변수
    const [searchText, setSearchText] = useState("");

    // 바텀시트 변수
    const bottomSheetRef = useRef(null);
    const [sheetIndex, setSheetIndex] = useState(1);
    const snapPoints = useMemo(
        () => [
            SCREEN_HEIGHT / SCREEN_WIDTH > 1.8
                ? SCREEN_HEIGHT * 0.11 // 일반화면
                : SCREEN_HEIGHT * 0.13, // width가 넓은화면
            SCREEN_HEIGHT * 0.5,
            SCREEN_HEIGHT / SCREEN_WIDTH > 1.8
                ? SCREEN_HEIGHT * 0.78 // 일반화면
                : SCREEN_HEIGHT * 0.75, // width가 넓은화면
        ],
        [SCREEN_HEIGHT, SCREEN_WIDTH]
    );

    //검색창 모달 변수
    const [modalVisible, setModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // 모달 애니메이션
    const openModal = () => {
        if (searchType === "주소") {
            setModalVisible(true);
            fadeAnim.setValue(1);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start();
        }
    };
    const closeModal = () => {
        fadeAnim.setValue(0);
        setModalVisible(false);

        //모달이 닫힐 때 검색 결과가 저장된 배열 초기화
        setSearchResult([]);
        setSearchQuery("");
    };

    //검색 모달 검색 카카오 api 호출
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const KakaoKeywordSearch = async () => {
        // 빈문자열, 공백일 때는 api 횟수 낭비하지않기 위해 함수 종료
        if (!searchQuery.trim()) {
            setSearchResult([]);
            setSearchQuery("");
            return;
        }

        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(searchQuery)}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: "KakaoAK 28e9379e441b1df3a42a71c481b40210",
                },
            });

            const data = await response.json();
            setSearchResult(data);
        } catch (error) {
            //에러발생 예외처리 수정필요
            console.log(error);
        }
    };

    //웹뷰 통신
    const webViewRef = useRef(null);

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f8ff" />

                {/*헤더 타이틀*/}
                <View style={styles.header}>
                    <Text style={styles.title}>홈</Text>
                    <AlarmButton />
                </View>

                {/* 검색창 */}
                <View style={styles.SearchBarContainer}>
                    <View style={styles.searchRow}>
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <Text style={styles.dropdownText}>▼ {searchType}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={openModal}>
                            <TextInput
                                style={[
                                    styles.searchBar,
                                    {
                                        width:
                                            searchType === "주소"
                                                ? SCREEN_WIDTH - SCREEN_WIDTH * 0.253
                                                : SCREEN_WIDTH - SCREEN_WIDTH * 0.32,
                                    },
                                ]}
                                placeholder={`${searchType}를 입력하세요`}
                                value={searchText}
                                onChangeText={setSearchText}
                                editable={searchType !== "주소"}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                    </View>
                    {dropdownVisible && (
                        <View
                            style={[
                                styles.dropdownMenu,
                                {
                                    width: SCREEN_WIDTH * 0.261,
                                    marginTop: SCREEN_HEIGHT * 0.004,
                                    marginLeft: SCREEN_WIDTH * 0.021,
                                },
                            ]}
                        >
                            {["주소", "등록번호"].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                        setSearchType(item);
                                        setDropdownVisible(false);
                                        setSearchText("");
                                    }}
                                    style={[styles.dropdownItem, { padding: SCREEN_WIDTH * 0.021 }]}
                                >
                                    <Text style={{ fontSize: SCREEN_WIDTH * 0.032 }}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* 검색 모달*/}
                <Modal visible={modalVisible} animationType="none" transparent onRequestClose={closeModal}>
                    <Animated.View
                        style={[
                            styles.modalOverlayWrap,
                            {
                                opacity: fadeAnim,
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal} />
                        <View style={styles.modalContent}>
                            {/* 모달 내부 검색바*/}
                            <View style={styles.SearchBarContainerModal}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <TouchableOpacity onPress={closeModal} style={{ paddingRight: 20 }}>
                                        <Ionicons name="arrow-back" size={normalize(24)} color="black" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[
                                            styles.searchBar,
                                            {
                                                width: SCREEN_WIDTH - SCREEN_WIDTH * 0.253,
                                            },
                                        ]}
                                        contextMenuHidden={true}
                                        placeholder={`주소를 입력하세요`}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        onSubmitEditing={KakaoKeywordSearch}
                                    />
                                </View>
                            </View>
                            <ScrollView style={styles.searchResultContainer}>
                                {searchResult.documents &&
                                    searchResult.documents.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.searchResultItem}
                                            onPress={() => {
                                                closeModal();
                                                if (webViewRef.current) {
                                                    webViewRef.current.postMessage(
                                                        JSON.stringify({ x: item.x, y: item.y })
                                                    );
                                                }
                                            }}
                                        >
                                            <Text style={styles.placeName}>{item.place_name}</Text>
                                            <Text style={styles.roadAddress}>
                                                {item.road_address_name || item.address_name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>
                        </View>
                    </Animated.View>
                </Modal>

                {/* 필터 버튼*/}
                <View style={styles.filterRowContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {["전체", "실종", "목격", "공고중", "입양대기"].map((item) => (
                            <TouchableOpacity key={item} style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* WebView (카카오) */}
                <View style={styles.webviewContainer}>
                    <WebView
                        ref={webViewRef}
                        source={{
                            uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html",
                        }}
                        style={styles.webview}
                        javaScriptEnabled={true}
                    />
                </View>

                {/* 바텀시트 */}
                {!modalVisible && (
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        onChange={(index) => {
                            setSheetIndex(index);
                        }}
                        enableOverDrag={sheetIndex !== 0}
                    >
                        <BottomSheetView style={styles.bottomSheetContainer}>{/* 바텀시트 내용 */}</BottomSheetView>
                    </BottomSheet>
                )}

                {/* 하단바 */}
                <NavigationBar />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginLeft: SCREEN_WIDTH * 0.093,
    },

    //검색바 컨테이너
    SearchBarContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: SCREEN_HEIGHT * 0.09,
        zIndex: 5,
    },
    searchRow: {
        left: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SCREEN_WIDTH * 0.021,
    },
    //검색바
    searchBar: {
        backgroundColor: "#ffffff",
        borderRadius: SCREEN_WIDTH * 0.02,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        height: SCREEN_HEIGHT * 0.06,
        paddingHorizontal: SCREEN_WIDTH * 0.035,
        fontSize: SCREEN_WIDTH * 0.037,
    },
    //드롭다운 버튼
    dropdownButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: SCREEN_WIDTH * 0.02,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        paddingVertical: SCREEN_HEIGHT * 0.015,
        paddingHorizontal: SCREEN_WIDTH * 0.035,
        marginRight: SCREEN_WIDTH * 0.027,
    },
    dropdownText: {
        color: "#333",
        fontSize: SCREEN_WIDTH * 0.032,
    },
    dropdownMenu: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        alignSelf: "flex-start",
        zIndex: 15,
    },
    dropdownItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    //카카오 맵 웹뷰
    webviewContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 0,
    },
    webview: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    // gpsButtonContainer: {
    //     position: "absolute",
    //     left: 10,
    //     bottom: 10,
    //     zIndex: 5,
    // },

    // 필터 버튼 행
    filterRowContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: SCREEN_HEIGHT * 0.16,
        paddingLeft: SCREEN_WIDTH * 0.027,
        paddingRight: SCREEN_WIDTH * 0.027,
        zIndex: 4,
    },

    //필터 버튼
    filterButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
        elevation: 3,
        borderWidth: 0.3,
        borderColor: "#ccc",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        paddingHorizontal: SCREEN_WIDTH * 0.04,
        paddingVertical: SCREEN_HEIGHT * 0.008,
        marginRight: SCREEN_WIDTH * 0.027,
        borderRadius: SCREEN_WIDTH * 0.067,
    },

    filterButtonText: {
        color: "#333",
        fontSize: SCREEN_WIDTH * 0.04,
    },

    //바텀 시트 내부
    bottomSheetContainer: {
        flex: 1,
        alignItems: "center",
    },

    //검색바 모달
    SearchBarContainerModal: {
        width: "100%",
        backgroundColor: "#f0f0f0",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.1,
        borderBottomColor: "rgba(194, 194, 194, 0.05)",
    },
    searchResultContainer: {
        flex: 1,
        width: "100%",
    },
    searchResultItem: {
        paddingVertical: SCREEN_HEIGHT * 0.015,
        paddingHorizontal: SCREEN_WIDTH * 0.04,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e0e0e0",
    },
    placeName: {
        fontSize: normalize(16),
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    roadAddress: {
        fontSize: normalize(12),
        color: "#666",
    },
    modalOverlayWrap: {
        flex: 1,
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%",
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    modalContent: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});
