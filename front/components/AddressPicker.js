import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native";
import { TextInput, Appbar, Button } from "react-native-paper";
import { WebView } from "react-native-webview";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import AddressSearchModal from "./AddressSearchModal";

const AddressPicker = ({ onChange }) => {
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

    return (
        <View>
            <TouchableOpacity onPress={() => setIsWebviewModalVisible(true)}>
                <TextInput
                    value={missingAddress}
                    style={styles.input}
                    mode="outlined"
                    activeOutlineColor="grey"
                    cursorColor="black"
                    editable={false}
                />
            </TouchableOpacity>
            <Modal visible={isWebviewModalVisible} onRequestClose={() => setIsWebviewModalVisible(false)}>
                <View style={{ paddingTop: 0, backgroundColor: "#fff", flex: 1 }}>
                    <View style={{ height: 0, backgroundColor: "#fff" }} />
                    <Appbar.Header style={{ marginTop: 0, paddingTop: 0 }} statusBarHeight={0}>
                        <Appbar.BackAction
                            onPress={() => {
                                setIsWebviewModalVisible(false);
                            }}
                        />
                        <Appbar.Content title="지도에서 위치 설정" titleStyle={styles.title} />
                        <Appbar.Action
                            icon="magnify"
                            onPress={() => {
                                setIsAddressSearchModalVisible(true);
                            }}
                        />
                    </Appbar.Header>
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
        backgroundColor: "white",
    },
    title: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontWeight: "bold",
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
});

export default AddressPicker;
