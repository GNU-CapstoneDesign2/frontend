//회원정보 수정
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export default updateMyInfo = async (requestBody, navigation) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
        const response = await axios.put("https://petfinderapp.duckdns.org/users/me", requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            Alert.alert("완료", "수정이 완료되었습니다.");
            navigation.replace("MyPage");
        }
    } catch (error) {
        Alert.alert("수정 실패", error.response?.data?.message || "오류가 발생했습니다.");
    }
};
