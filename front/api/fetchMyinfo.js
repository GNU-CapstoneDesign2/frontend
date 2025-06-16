//내 정보 가져오기
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchMyInfo = async () => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get("https://petfinderapp.duckdns.org/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const result = response.data.data;
            return result;
        } else {
            console.log("유저 정보 가져오기 실패");
        }
    } catch (error) {
        console.log("API 호출 오류:", error);
    }
};
