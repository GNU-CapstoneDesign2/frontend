import React, { useState, useRef, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, TextInput } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { WebView } from "react-native-webview";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import AddressSearchModal from "./AddressSearchModal";
import { LocationContext } from "../contexts/LocationContext";
import GpsButton from "./GpsButton";

const AddressPicker = ({ value, onChange }) => {
    const [isWebviewModalVisible, setIsWebviewModalVisible] = React.useState(false);
    const webViewRef = useRef(null);
    const [missingAddress, setMissingAddress] = useState("");

    const [isAddressSearchModalVisible, setIsAddressSearchModalVisible] = useState(false);

    //웹뷰 메세지 수신
    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "LOCATION") {
                const { lat, lng, address } = data.payload;
                setMissingAddress(address); // 주소를 TextInput에 설정
                onChange(lat, lng, address); // 부모 컴포넌트에 주소 전달
            }
            setIsWebviewModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

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
    return (
        <View>
            <TouchableOpacity onPress={() => setIsWebviewModalVisible(true)}>
                <TextInput
                    value={value ? value : missingAddress}
                    style={styles.input}
                    cursorColor="black"
                    editable={false}
                />
            </TouchableOpacity>
            <Modal visible={isWebviewModalVisible} onRequestClose={() => setIsWebviewModalVisible(false)}>
                <View style={{ flex: 1 }}>
                    <Appbar.Header
                        style={{
                            marginTop: 0,
                            paddingTop: 0,
                            backgroundColor: "white",
                            borderBottomWidth: 1,
                            borderBottomColor: "#ddd",
                        }}
                        statusBarHeight={0}
                    >
                        <Appbar.BackAction
                            iconColor="black"
                            onPress={() => {
                                setIsWebviewModalVisible(false);
                            }}
                        />
                        <Appbar.Content title="지도에서 위치 설정" titleStyle={styles.title} />
                        <Appbar.Action
                            icon="magnify"
                            iconColor="black"
                            onPress={() => {
                                setIsAddressSearchModalVisible(true);
                            }}
                        />
                    </Appbar.Header>
                    <View style={styles.gpsButton}>
                        <GpsButton onPress={moveToGpsLocation} />
                    </View>
                    <WebView
                        ref={webViewRef}
                        source={{
                            uri: "https://psm1109.github.io/kakaomap-webview-hosting/kakao_map.html?mode=writePost",
                        }}
                        javaScriptEnabled={true}
                        originWhitelist={["*"]}
                        onMessage={handleWebViewMessage}
                    />
                    <View style={styles.selectButtonContainer}>
                        <Button
                            style={styles.selectButton}
                            buttonColor="skyblue"
                            textColor="black"
                            mode="contained"
                            labelStyle={{ fontSize: SCREEN_WIDTH * 0.04 }}
                            onPress={() => {
                                webViewRef.current.postMessage(
                                    JSON.stringify({
                                        type: "getAddress",
                                        payload: {},
                                    })
                                );
                            }}
                        >
                            이 위치로 설정
                        </Button>
                    </View>
                    <AddressSearchModal
                        modalVisible={isAddressSearchModalVisible}
                        setModalVisible={setIsAddressSearchModalVisible}
                        webViewRef={webViewRef}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        width: "100%",
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        backgroundColor: "white",
    },
    title: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },
    selectButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: SCREEN_WIDTH * 0.22,
        paddingVertical: SCREEN_WIDTH * 0.02,
    },
    selectButton: {
        borderRadius: 10,
        width: SCREEN_WIDTH * 0.8,
        alignSelf: "center",
    },
    gpsButton: {
        position: "absolute",
        top: SCREEN_HEIGHT * 0.1,
        right: SCREEN_WIDTH * 0.02,
        zIndex: 10,
    },
});

export default AddressPicker;
