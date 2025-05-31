import React, { useRef, useMemo, useState, useEffect } from "react";
import { TextInput, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image } from "react-native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
// 네비게이션바
import NavigationBar from "../components/NavigationBar/NavigationBar";

import { useNavigation } from "@react-navigation/native";
// 바텀시트
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";

// 컴포넌트
import AlarmButton from "../components/AlarmButton";
import AddressSearcher from "../components/AddressSearchModal";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

function stateBadgeColor(state) {
    switch (state) {
        case "실종":
            return { backgroundColor: "#ff3b30" };
        case "공고중":
            return { backgroundColor: "#0057ff" };
        case "목격":
            return { backgroundColor: "#1abc54" };
        case "입양대기":
            return { backgroundColor: "#ffd600" };
        default:
            return { backgroundColor: "#ccc" };
    }
}

export default function MainPage() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
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
            SCREEN_HEIGHT / SCREEN_WIDTH > 1.8 ? SCREEN_HEIGHT * 0.11 : SCREEN_HEIGHT * 0.13,
            SCREEN_HEIGHT * 0.35,
            // SCREEN_HEIGHT / SCREEN_WIDTH > 1.8 ? SCREEN_HEIGHT * 0.78 : SCREEN_HEIGHT * 0.75,
            SCREEN_HEIGHT * 0.75,
        ],
        [SCREEN_HEIGHT, SCREEN_WIDTH]
    );

    //검색창 모달 변수
    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        if (searchType === "주소") {
            setModalVisible(true);
        }
    };

    //웹뷰 통신
    const webViewRef = useRef(null);

    // 필터 버튼 상태 관리
    const speciesFilterList = ["개", "고양이"];
    const stateFilterList = ["실종", "목격", "공고중", "입양대기"];
    const [speciesFilter, setSpeciesFilter] = useState(
        speciesFilterList.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );
    const [stateFilter, setStateFilter] = useState(
        stateFilterList.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );

    // 필터 버튼 클릭 핸들러
    const handleFilterPress = (item) => {
        if (speciesFilterList.includes(item)) {
            setSpeciesFilter((prev) => {
                const updated = { ...prev, [item]: !prev[item] };
                return updated;
            });
        } else if (stateFilterList.includes(item)) {
            setStateFilter((prev) => {
                const updated = { ...prev, [item]: !prev[item] };
                return updated;
            });
        }
    };

    // filterStates가 바뀔 때마다 API 호출 실행
    useEffect(() => {
        // speciesFilter와 stateFilter를 각각 문자열로 추출
        const selectedSpecies = Object.entries(speciesFilter)
            .filter(([key, value]) => value)
            .map(([key]) => key)
            .join(",");
        const selectedStates = Object.entries(stateFilter)
            .filter(([key, value]) => value)
            .map(([key]) => key)
            .join(",");
        // 예시: API 호출 시 species와 state를 각각 전달
        let filterQuery = "";
        if (selectedSpecies === "" && selectedStates !== "") {
            filterQuery = `state=${selectedStates}`;
        } else if (selectedSpecies !== "" && selectedStates === "") {
            filterQuery = `species=${selectedSpecies}`;
        } else if (selectedSpecies !== "" && selectedStates !== "") {
            filterQuery = `species=${selectedSpecies}&state=${selectedStates}`;
        } else {
            filterQuery = "species=개,고양이&state=실종,목격,공고중,입양대기"; // 기본값
        }
        console.log(filterQuery);
        // 필터값이 변경되는것을 useEffect로 감지하여 게시글,마커 찾기 api 호출
    }, [speciesFilter, stateFilter]);

    //임시 게시글 데이터
    const posts = [
        {
            postId: 101,
            state: "실종",
            date: "2025-04-08T15:30:00Z",
            address: "서울 강남구",
            description: "실종 대상에 대한 상세 설명",
            imageUrl: "https://cdn.pixabay.com/photo/2025/05/12/11/43/golden-retriever-amber-blue-9595177_640.jpg",
        },
        {
            postId: 102,
            state: "목격",
            date: "2025-04-07T12:00:00Z",
            address: "부산 해운대구",
            description: "목격 대상에 대한 간략한 설명",
            imageUrl: "https://cdn.pixabay.com/photo/2022/10/24/14/21/puppy-7543571_640.jpg",
        },
        {
            postId: 103,
            state: "공고중",
            date: "2025-04-08T15:30:00Z",
            address: "서울 강남구",
            description: "실종 대상에 대한 상세 설명",
            imageUrl: "https://cdn.pixabay.com/photo/2014/03/05/19/23/dog-280332_640.jpg",
        },
        {
            postId: 104,
            state: "입양대기",
            date: "2025-04-07T12:00:00Z",
            address: "부산 해운대구",
            description: "목격 대상에 대한 간략한 설명",
            imageUrl: "https://cdn.pixabay.com/photo/2017/10/04/02/24/puppy-2814858_640.jpg",
        },
    ];

    // useEffect(async () => {
    //     const accessToken = await AsyncStorage.getItem("accessToken");
    //     console.log(accessToken);
    // }, []);
    return (
        <GestureHandlerRootView>
            <PaperProvider>
                <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                    <StatusBar barStyle="dark-content" backgroundColor="#f8f8ff" />
                    {/*헤더 타이틀*/}
                    <View style={styles.header}>
                        <Text style={styles.title}>홈</Text>
                        <AlarmButton />
                    </View>

                    {/* 검색창 */}
                    <View style={[styles.SearchBarContainer, { paddingTop: insets.top }]}>
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

                    {/* 주소 검색 모달 */}
                    <AddressSearcher
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        webViewRef={webViewRef}
                    />

                    {/* 필터 버튼*/}
                    <View style={[styles.filterRowContainer, { paddingTop: insets.top }]}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {[...speciesFilterList, ...stateFilterList].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.filterButton,
                                        (speciesFilter[item] || stateFilter[item]) && { backgroundColor: "#d3d3d3" },
                                    ]}
                                    onPress={() => handleFilterPress(item)}
                                >
                                    <Text style={styles.filterButtonText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* WebView (카카오) */}
                    <View style={styles.webviewContainer}>
                        <WebView
                            ref={webViewRef}
                            originWhitelist={["*"]}
                            source={{
                                uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html?mode=main",
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
                            enableOverDrag={false}
                            maxDynamicContentSize={snapPoints[2]}
                            bottomInset={insets.bottom}
                        >
                            <BottomSheetView style={{ backgroundColor: "white" }}>
                                <ScrollView
                                    style={{ width: "100%" }}
                                    contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 100 }}
                                    showsVerticalScrollIndicator={true}
                                    nestedScrollEnabled={true}
                                    keyboardShouldPersistTaps="handled"
                                    bounces={true}
                                >
                                    {/* 게시글 목록 */}
                                    {posts.map((post) => (
                                        <TouchableOpacity
                                            key={post.postId}
                                            style={styles.postCard}
                                            activeOpacity={0.8}
                                            onPress={() => {
                                                console.log(`게시글 ${post.postId}로 이동`);

                                                // 상태별로 이동할 페이지 결정
                                                let routeName = "";
                                                switch (post.state) {
                                                    case "실종":
                                                        routeName = "MissingDetailPage";
                                                        break;
                                                    case "목격":
                                                        routeName = "WitnessDetailPage";
                                                        break;
                                                    case "공고중":
                                                        routeName = "NoticeDetailPage";
                                                        break;
                                                    case "입양대기":
                                                        routeName = "AdoptDetailPage";
                                                        break;
                                                    default:
                                                        routeName = "DefaultDetailPage";
                                                }
                                                navigation.navigate(routeName, { postId: post.postId });

                                                //페이지로 이동해서 postId와 페이지 상태값을 이용해서 상세보기 api호출
                                            }}
                                        >
                                            <View style={styles.postImageWrapper}>
                                                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                                            </View>
                                            <View style={styles.postInfoWrapper}>
                                                <View style={[styles.stateBadge, stateBadgeColor(post.state)]}>
                                                    <Text style={styles.stateBadgeText}>{post.state}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.postInfoText}>시간: {post.date}</Text>
                                                    <Text style={styles.postInfoText}>장소: {post.address}</Text>
                                                    <Text style={styles.postInfoText}>설명: {post.description}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </BottomSheetView>
                        </BottomSheet>
                    )}

                    {/* 하단바 */}
                    <NavigationBar />
                </SafeAreaView>
            </PaperProvider>
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
    filterRowContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: SCREEN_HEIGHT * 0.16,
        paddingLeft: SCREEN_WIDTH * 0.027,
        paddingRight: SCREEN_WIDTH * 0.027,
        zIndex: 4,
    },
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
    postCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginVertical: 3,
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        alignItems: "center",
        position: "relative",
    },
    postImageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: "#eee",
    },
    postImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    postInfoWrapper: {
        flex: 1,
    },
    stateBadge: {
        minWidth: 0,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginBottom: 5,
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
    },
    stateBadgeText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    postInfoText: {
        fontSize: 13,
        color: "#222",
        marginBottom: 2,
    },
});
