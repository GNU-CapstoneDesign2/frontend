import React, { useRef, useMemo, useState, useEffect, useContext } from "react";
import { TextInput, StyleSheet, View, StatusBar, Text, TouchableOpacity, Dimensions } from "react-native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { LocationContext } from "../contexts/LocationContext";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debounce from "lodash.debounce";
// 네비게이션바
import NavigationBar from "../components/NavigationBar/NavigationBar";

// 바텀시트
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";

// component
import AlarmButton from "../components/AlarmButton";
import AddressSearcher from "../components/AddressSearchModal";
import GpsButton from "../components/GpsButton";
//utils
import { formatTime, formatDate } from "../utils/formatters";
//api
import fetchPosts from "../api/fetchPosts";
import fetchMarkers from "../api/fetchMarkers";

export default function MainPage() {
    const screenHeight = Dimensions.get("window").height;
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const [posts, setPosts] = useState([]);

    //웹뷰 통신
    const webViewRef = useRef(null);

    // 검색 타입 드롭박스 상태 변수
    const [searchType, setSearchType] = useState("주소");
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // 검색창 변수
    const [searchText, setSearchText] = useState("");

    //검색창 모달 변수
    const [modalVisible, setModalVisible] = useState(false);
    const openModal = () => {
        if (searchType === "주소") {
            setModalVisible(true);
        }
    };

    // 바텀시트 변수
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(
        () => [SCREEN_HEIGHT * 0.11, SCREEN_HEIGHT * 0.35, SCREEN_HEIGHT * 0.65],
        [SCREEN_HEIGHT]
    );
    const [sheetIndex, setSheetIndex] = useState(1);

    // 바텀시트 애니메이션 위치 추적
    const animatedPosition = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        const isVisible = animatedPosition.value > screenHeight * 0.4;
        return {
            opacity: isVisible ? 1 : 0,
            transform: [{ translateY: animatedPosition.value }],
        };
    });

    // GPS 위치로 이동하는 함수
    const { lastPosition } = useContext(LocationContext);
    const moveToGpsLocation = () => {
        if (!lastPosition) {
            return;
        }
        webViewRef.current?.postMessage(
            JSON.stringify({
                type: "setCenter",
                payload: {
                    lat: lastPosition.latitude,
                    lng: lastPosition.longitude,
                },
            })
        );
    };

    // 필터 버튼 상태 관리
    const petTypeFilterList = ["개", "고양이"];
    const petTypeMap = {
        개: "DOG",
        고양이: "CAT",
    };
    const stateFilterList = ["실종", "목격", "공고중", "입양대기"];
    const stateMap = {
        실종: "LOST",
        목격: "SIGHT",
        공고중: "NOTICE",
        입양대기: "ADOPT",
    };
    const reverseStateMap = Object.fromEntries(Object.entries(stateMap).map(([key, value]) => [value, key]));

    const [petTypeFilter, setPetTypeFilter] = useState(
        petTypeFilterList.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );
    const [stateFilter, setStateFilter] = useState(
        stateFilterList.reduce((acc, cur) => ({ ...acc, [cur]: false }), {})
    );

    // 필터 버튼 클릭 핸들러
    const handleFilterPress = (item) => {
        if (petTypeFilterList.includes(item)) {
            setPetTypeFilter((prev) => {
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
    // 필터버튼이 클릭될 때 마다 필터쿼리 업데이트
    const [filterQuery, setFilterQuery] = useState("states=LOST,SIGHT,NOTICE,ADOPT&petTypes=DOG,CAT");
    useEffect(() => {
        const selectedPetType = Object.entries(petTypeFilter)
            .filter(([key, value]) => value)
            .map(([key]) => petTypeMap[key])
            .join(",");
        const selectedStates = Object.entries(stateFilter)
            .filter(([key, value]) => value)
            .map(([key]) => stateMap[key])
            .join(",");

        if (selectedPetType === "" && selectedStates !== "") {
            setFilterQuery(`states=${selectedStates}&petTypes=DOG,CAT`);
        } else if (selectedPetType !== "" && selectedStates === "") {
            setFilterQuery(`states=LOST,SIGHT,NOTICE,ADOPT&petTypes=${selectedPetType}`);
        } else if (selectedPetType !== "" && selectedStates !== "") {
            setFilterQuery(`states=${selectedStates}&petTypes=${selectedPetType}`);
        } else {
            setFilterQuery("states=LOST,SIGHT,NOTICE,ADOPT&petTypes=DOG,CAT");
        }
    }, [petTypeFilter, stateFilter]);

    const [bounds, setBounds] = useState({
        minLat: null,
        maxLat: null,
        minLng: null,
        maxLng: null,
    });
    // 지도의 중심 위치 변경
    const changed_center = debounce(async (minLat, maxLat, minLng, maxLng) => {
        setBounds({ minLat, maxLat, minLng, maxLng });
    }, 500);

    //지도 중심좌표 변경 또는 필터쿼리 변경 시 게시글,마커 조회 API 호출
    useEffect(() => {
        if (bounds.minLat === null || bounds.maxLat === null || bounds.minLng === null || bounds.maxLng === null)
            return;
        const loadPosts = async () => {
            const postsData = await fetchPosts({ bounds, filterQuery });
            setPosts(postsData);
        };
        loadPosts();
        const loadMarkers = async () => {
            const markersData = await fetchMarkers({ bounds, filterQuery });
            webViewRef.current?.postMessage(
                JSON.stringify({
                    type: "markerData",
                    payload: {
                        markers: markersData || [],
                    },
                })
            );
        };
        loadMarkers();
    }, [bounds, filterQuery]);

    //accessToken 확인용 코드
    useEffect(() => {
        const fetchToken = async () => {
            const accessToken = await AsyncStorage.getItem("accessToken");
            console.log(accessToken);
        };
        fetchToken();
    }, []);

    function stateBadgeColor(state) {
        switch (state) {
            case "LOST":
                return { backgroundColor: "#ff3b30" };
            case "SIGHT":
                return { backgroundColor: "#0057ff" };
            case "NOTICE":
                return { backgroundColor: "#1abc54" };
            case "ADOPT":
                return { backgroundColor: "#ffd600" };
            default:
                return { backgroundColor: "#ccc" };
        }
    }

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
                            {[...petTypeFilterList, ...stateFilterList].map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.filterButton,
                                        (petTypeFilter[item] || stateFilter[item]) && { backgroundColor: "#d3d3d3" },
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
                            onMessage={(event) => {
                                try {
                                    const data = JSON.parse(event.nativeEvent.data);
                                    if (data.type === "BOUNDS") {
                                        const { sw_bounds, ne_bounds } = data.payload;
                                        changed_center(sw_bounds.lat, ne_bounds.lat, sw_bounds.lng, ne_bounds.lng);
                                    }
                                } catch (error) {
                                    console.error(error);
                                }
                            }}
                        />
                    </View>

                    {/* 바텀시트 */}
                    {!modalVisible && (
                        <>
                            <Animated.View style={[styles.floatingButton, animatedStyle]}>
                                <GpsButton onPress={moveToGpsLocation} />
                            </Animated.View>

                            <BottomSheet
                                ref={bottomSheetRef}
                                handleStyle={{ height: 30, backgroundColor: "transparent" }}
                                index={1}
                                snapPoints={snapPoints}
                                onChange={(index) => {
                                    setSheetIndex(index);
                                }}
                                enableOverDrag={false}
                                animatedPosition={animatedPosition}
                                bottomInset={insets.bottom}
                            >
                                <BottomSheetView>
                                    <ScrollView
                                        style={{ maxHeight: snapPoints[sheetIndex] }}
                                        contentContainerStyle={{
                                            alignItems: "center",
                                            paddingBottom: 100,
                                        }}
                                        showsVerticalScrollIndicator={true}
                                        nestedScrollEnabled={true}
                                        bounces={true}
                                    >
                                        {posts.length !== 0 ? (
                                            posts.map((post) => (
                                                <TouchableOpacity
                                                    key={post.postId}
                                                    style={styles.postCard}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        let routeName = "";
                                                        switch (post.state) {
                                                            case "LOST":
                                                                routeName = "MissingDetailPage";
                                                                break;
                                                            case "SIGHT":
                                                                routeName = "WitnessDetailPage";
                                                                break;
                                                            case "NOTICE":
                                                                routeName = "AdoptNoticeDetailPage";
                                                                break;
                                                            case "ADOPT":
                                                                routeName = "AdoptNoticeDetailPage";
                                                                break;
                                                            default:
                                                                routeName = "DefaultDetailPage";
                                                        }
                                                        navigation.navigate(routeName, { postId: post.postId });
                                                        console.log("게시글 ID :", post.postId);
                                                    }}
                                                >
                                                    <View style={styles.postImageWrapper}>
                                                        <Image
                                                            source={
                                                                post.imageUrl
                                                                    ? { uri: post.imageUrl }
                                                                    : require("../assets/image_not_found.jpg")
                                                            }
                                                            style={styles.postImage}
                                                        />
                                                    </View>
                                                    <View style={styles.postInfoWrapper}>
                                                        <View style={[styles.stateBadge, stateBadgeColor(post.state)]}>
                                                            <Text style={styles.stateBadgeText}>
                                                                {reverseStateMap[post.state]}
                                                            </Text>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.postInfoText}>
                                                                시간:{" "}
                                                                {formatDate(post.date.split("T")[0]) +
                                                                    " " +
                                                                    formatTime(post.date.split("T")[1])}
                                                            </Text>
                                                            <Text style={styles.postInfoText}>
                                                                장소: {post.address}
                                                            </Text>
                                                            <Text style={styles.postInfoText}>
                                                                설명: {post.description}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <View style={{ flex: 1, alignItems: "center" }}>
                                                <Image
                                                    source={require("../assets/not_found.png")}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                    }}
                                                ></Image>
                                                <Text
                                                    style={{
                                                        marginTop: 20,
                                                        fontSize: 16,
                                                        color: "black",
                                                    }}
                                                >
                                                    게시글이 없습니다.
                                                </Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                </BottomSheetView>
                            </BottomSheet>
                        </>
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
        marginRight: 10,
        borderRadius: 25,
    },
    filterButtonText: {
        color: "#333",
        fontSize: SCREEN_HEIGHT * 0.02,
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
    floatingButton: {
        position: "absolute",
        top: -45,
        right: 10,
        zIndex: 10,
    },
});
