import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

const PetNumSearchWarningModal = ({ visible, onDismiss, message, duration = 2000 }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <Pressable style={styles.overlay} onPress={onDismiss}>
                <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
                    <Text style={{ marginRight: 10 }}>❕</Text>
                    <Text style={styles.message}>{message}</Text>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(184, 184, 184, 0.3)",
    },
    modal: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 15,
        alignItems: "center",
        elevation: 5,
    },
    message: {
        fontSize: 15,
        textAlign: "center",
    },
});

export default PetNumSearchWarningModal;
