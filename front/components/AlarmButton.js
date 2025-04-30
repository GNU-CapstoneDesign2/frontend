import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { normalize } from "../utils/normalize";

const GpsButton = () => {
    return (
        <TouchableOpacity style={styles.alarmButton}>
            <Image source={require("../assets/alarm.png")} style={styles.alarmIcon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    alarmButton: {},
    alarmIcon: {
        width: normalize(35),
        height: normalize(35),
    },
});

export default GpsButton;
