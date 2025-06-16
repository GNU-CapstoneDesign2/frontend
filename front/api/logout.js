import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default logout = async (navigation) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.post(
            "https://petfinderapp.duckdns.org/auth/logout",
            {}, //POST 의 두번째 인자는 body 이므로 {}을 채워줘야함
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status == 200) {
            await AsyncStorage.removeItem("accessToken");
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "LoginPage" }],
                })
            );
        }
    } catch {
        console.error("로그아웃 실패:", error.response?.data || error.message);
    }
};
