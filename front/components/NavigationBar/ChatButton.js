import React from "react";
import { TouchableOpacity, Image, StyleSheet, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChatButton = () => {
    const navigation = useNavigation();
    const { width: windowWidth } = useWindowDimensions();
    const buttonSize = windowWidth * 0.12;

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Chat")} style={styles.button}>
            <Image
                source={require("../../assets/chat.png")}
                style={[styles.image, { width: buttonSize, height: buttonSize }]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        resizeMode: "contain",
    },
});

export default ChatButton;
