import React, { useRef, useMemo, useState, useEffect } from "react";
import {
    TextInput,
    StyleSheet,
    SafeAreaView,
    View,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    PixelRatio,
    Image,
    useWindowDimensions,
} from "react-native";
/*webview */
import { WebView } from "react-native-webview";
/*navigationBar */
import NavigationBar from "../components/NavigationBar/NavigationBar";
/*bottomSheet */
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
/*gpsButton */
import GpsButton from "../components/GpsButton";
/*alarmButton */
import AlarmButton from "../components/AlarmButton";

import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import { Ionicons } from "@expo/vector-icons";

export default function MainPage() {
    // 검색 타입 드롭박스
    const [searchType, setSearchType] = useState("주소");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    // 검색창
    const [searchText, setSearchText] = useState("");
    // 바텀시트
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

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#f8f8ff" />

                <View style={styles.header}>
                    <Text style={styles.title}>홈</Text>
                    <AlarmButton />
                </View>

                {/* 검색창 */}
                <View style={[styles.SearchBarContainer, { top: SCREEN_HEIGHT * 0.09 }]}>
                    <View style={[styles.searchRow, { paddingHorizontal: SCREEN_WIDTH * 0.021 }]}>
                        {/* 드롭다운 버튼 */}
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setDropdownVisible(!dropdownVisible)}
                        >
                            <Text style={styles.dropdownText}>▼ {searchType}</Text>
                        </TouchableOpacity>

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
                            d
                            placeholder={`${searchType}를 입력하세요`}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    {/* 드롭다운 리스트 */}
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
                                    }}
                                    style={[styles.dropdownItem, { padding: SCREEN_WIDTH * 0.021 }]}
                                >
                                    <Text style={{ fontSize: SCREEN_WIDTH * 0.032 }}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* 필터 버튼 */}
                <View style={styles.filterRowContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {["전체", "실종", "목격", "공고중", "입양대기"].map((item) => (
                            <TouchableOpacity key={item} style={styles.filterButton}>
                                <Text style={styles.filterButtonText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* WebView (카카오 지도) */}
                <View style={styles.webviewContainer}>
                    <WebView
                        source={{
                            uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html",
                        }}
                        style={styles.webview}
                    />
                </View>

                {/* BottomSheet */}
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
        zIndex: 20,
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

    gpsButtonContainer: {
        position: "absolute",
        left: 10,
        bottom: 10,
        zIndex: 5,
    },

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

    bottomSheetContainer: {
        flex: 1,
        alignItems: "center",
    },
});
