import React, { useState, useRef, useMemo, useEffect } from "react";
import { Modal, View, TextInput, TouchableOpacity, ScrollView, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import debounce from "lodash.debounce";

const AddressSearchModal = ({ modalVisible, setModalVisible, webViewRef }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const searchInputRef = useRef(null);

    const closeModal = () => {
        setModalVisible(false);
        setSearchResult([]);
        setSearchQuery("");
    };
    useEffect(() => {
        if (modalVisible) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [modalVisible]);
    const kakaoKeywordSearch = async (query) => {
        if (!query.trim()) {
            setSearchResult([]);
            return;
        }

        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: "KakaoAK 28e9379e441b1df3a42a71c481b40210",
                },
            });

            const data = await response.json();
            setSearchResult(data.documents || []);
        } catch (error) {
            console.error(error);
        }
    };

    const debouncedKakaoSearch = useMemo(() => debounce(kakaoKeywordSearch, 400), []);

    return (
        <Modal visible={modalVisible} animationType="none" transparent={true} onRequestClose={closeModal}>
            <View style={styles.modalContent}>
                <View style={styles.SearchBarContainerModal}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity onPress={closeModal} style={{ paddingRight: 20 }}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            ref={searchInputRef}
                            style={[
                                styles.searchBar,
                                {
                                    width: "80%",
                                },
                            ]}
                            contextMenuHidden={true}
                            placeholder={`주소를 입력하세요`}
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                debouncedKakaoSearch(text);
                            }}
                        />
                    </View>
                </View>
                {/* webviewRef 수정필요 */}
                <ScrollView style={styles.searchResultContainer}>
                    {searchResult.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.searchResultItem}
                            onPress={() => {
                                webViewRef.current.postMessage(
                                    JSON.stringify({
                                        type: "setCenter",
                                        payload: { lat: item.y, lng: item.x },
                                    })
                                );
                                closeModal();
                            }}
                        >
                            <Text style={styles.placeName}>{item.place_name}</Text>
                            <Text style={styles.roadAddress}>{item.road_address_name || item.address_name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    SearchBarContainerModal: {
        width: "100%",
        backgroundColor: "#f0f0f0",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.1,
        borderBottomColor: "rgba(194, 194, 194, 0.05)",
    },
    searchBar: {
        backgroundColor: "#ffffff",
        borderRadius: 10,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    searchResultContainer: {
        flex: 1,
        width: "100%",
    },
    searchResultItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: "#e0e0e0",
    },
    placeName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    roadAddress: {
        fontSize: 12,
        color: "#666",
    },
});

export default AddressSearchModal;
