import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
const GpsButton = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Image source={require("../assets/gps.png")} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 35,
        height: 35,
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 5,
        elevation: 2,
        opacity: 0.8,
    },
    image: {
        width: 25,
        height: 25,
    },
});

export default GpsButton;
