import React, { useState } from "react";
import { TouchableOpacity, Image, StyleSheet, View, Text, Modal, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WriteButton = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [petTypeModalVisible, setPetTypeModalVisible] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState(null); // 'MissingReport' or 'WitnessReport'
    const { width: windowWidth } = useWindowDimensions();

    const buttonSize = windowWidth * 0.12;
    const modalWidth = windowWidth * 0.35;

    // petType 선택 후 이동
    const handlePetTypeSelect = (petType) => {
        setPetTypeModalVisible(false);
        if (selectedReportType) {
            navigation.navigate(selectedReportType, { petType });
        }
    };

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
                                setSelectedReportType("MissingReportPage");
                                setModalVisible(false);
                                setPetTypeModalVisible(true);
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontSize: windowWidth * 0.035 }]}>실종 신고</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { padding: windowWidth * 0.025 }]}
                            onPress={() => {
                                setSelectedReportType("WitnessReportPage");
                                setModalVisible(false);
                                setPetTypeModalVisible(true);
                            }}
                        >
                            <Text style={[styles.modalButtonText, { fontSize: windowWidth * 0.035 }]}>목격 제보</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* PetType 선택 모달 */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={petTypeModalVisible}
                onRequestClose={() => setPetTypeModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setPetTypeModalVisible(false)}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/* <Text
                            style={{
                                textAlign: "center",
                                marginBottom: 24,
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#222",
                            }}
                        >
                            동물 종류를 선택하세요
                        </Text> */}
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity
                                style={[
                                    styles.petTypeButton,
                                    { marginRight: 24, backgroundColor: "#f5f5f5", borderColor: "#ffb347" },
                                ]}
                                onPress={() => handlePetTypeSelect("개")}
                                activeOpacity={0.8}
                            >
                                <Image source={require("../../assets/dog_petType.png")} style={styles.petTypeImage} />
                                <Text style={styles.petTypeText}>개</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.petTypeButton, { backgroundColor: "#f5f5f5", borderColor: "#b0a4e3" }]}
                                onPress={() => handlePetTypeSelect("고양이")}
                                activeOpacity={0.8}
                            >
                                <Image source={require("../../assets/cat_petType.png")} style={styles.petTypeImage} />
                                <Text style={styles.petTypeText}>고양이</Text>
                            </TouchableOpacity>
                        </View>
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
    petTypeButton: {
        width: 120,
        height: 160,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 8,
    },
    petTypeImage: {
        width: 80,
        height: 80,
    },
    petTypeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
});

export default WriteButton;
