// 회원탈퇴
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default deleteUser = async (navigation) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
        await axios.delete("https://petfinderapp.duckdns.org/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        //storage와 화면 stack을 비우고 로그인 페이지로 이동함
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
