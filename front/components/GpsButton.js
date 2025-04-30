import React from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";

const GpsButton = () => {
    return (
        <View style={styles.gpsButtonContainer}>
            <View style={styles.backgroundCircle}>
                <TouchableOpacity style={styles.button}>
                    <Image source={require("../assets/gps.png")} style={styles.image} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gpsButtonContainer: {
        position: "absolute",
        top: 120,
        left: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        width: 25,
        height: 25,
        backgroundColor: "transparent",
        zIndex: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
});

export default GpsButton;
