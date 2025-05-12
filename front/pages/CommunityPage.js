import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
import { SafeAreaProvider } from "react-native-safe-area-context";
//
import { Modal, Portal, Button, PaperProvider } from "react-native-paper";

export default function CommunityPage() {
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: "white", padding: 20 };

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <View style={{ flex: 1 }}>
                    {/* 커스텀 헤더 */}
                    <View style={styles.header}>
                        <Text style={styles.title}>커뮤니티</Text>
                    </View>

                    {/* 페이지 내용 */}
                    <View style={styles.content}>
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                                <Text>Example Modal. Click outside this area to dismiss.</Text>
                            </Modal>
                        </Portal>
                        <Button style={{ marginTop: 30 }} onPress={showModal}>
                            Show
                        </Button>
                    </View>

                    <NavigationBar />
                </View>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: SCREEN_WIDTH * 0.038,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
