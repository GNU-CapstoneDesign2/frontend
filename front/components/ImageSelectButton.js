import React, { useState } from "react";
import { Button, Image, Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { normalize } from "../utils/normalize";

const ImageSelectButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Image source={require("../assets/camera.png")} style={styles.image} />
            <Text style={styles.text}>카메라/갤러리</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: normalize(10),
    },
    image: {
        width: normalize(40),
        height: normalize(40),
        marginBottom: normalize(8),
        tintColor: "#666",
    },
    text: {
        fontSize: normalize(12),
        color: "#666",
    },
});

export default ImageSelectButton;
