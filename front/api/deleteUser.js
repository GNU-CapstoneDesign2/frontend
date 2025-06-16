// 회원탈퇴
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default deleteUser = async (navigation) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        await axios.delete("https://petfinderapp.duckdns.org/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        await AsyncStorage.removeItem("accessToken");
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "LoginPage" }],
            })
        );
    } catch (error) {
        Alert.alert("탈퇴 실패", "잠시 후 다시 시도해주세요.");
    }
};
