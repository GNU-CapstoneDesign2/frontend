import React, { useState } from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text, Modal, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WriteButton = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const { width: windowWidth } = useWindowDimensions();

    const buttonSize = windowWidth * 0.12;
    const modalWidth = windowWidth * 0.35;

    return (
        <View style={styles.container}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View
                        style={[
                            styles.modalView,
                            {
                                width: modalWidth,
                                marginLeft: -(modalWidth / 2),
                                bottom: windowWidth * 0.25,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={[styles.modalButton, { padding: windowWidth * 0.025 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("MissingReport");
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontSize: windowWidth * 0.035 }]}>실종 신고</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { padding: windowWidth * 0.025 }]}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("WitnessReport");
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontSize: windowWidth * 0.035 }]}>목격 제보</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
                <Image
                    source={require("../../assets/write.png")}
                    style={[styles.image, { width: buttonSize, height: buttonSize }]}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        resizeMode: "contain",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    modalView: {
        position: "absolute",
        left: "50%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalButton: {
        width: "100%",
        borderRadius: 5,
    },
    modalButtonText: {
        textAlign: "center",
        color: "#333",
    },
});

export default WriteButton;
