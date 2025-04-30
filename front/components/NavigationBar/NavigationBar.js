import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import HomeButton from "./HomeButton";
import CommunityButton from "./CommunityButton";
import ChatButton from "./ChatButton";
import WriteButton from "./WriteButton";
import MyPageButton from "./MyPageButton";
import { SCREEN_WIDTH } from "../../utils/normalize";

const NavigationBar = () => {
    return (
        <View style={styles.navigationBar}>
            <HomeButton />
            <CommunityButton />
            <WriteButton />
            <ChatButton />
            <MyPageButton />
        </View>
    );
};

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: SCREEN_WIDTH * 0.15,
        paddingVertical: SCREEN_WIDTH * 0.02,
    },
});
export default NavigationBar;
