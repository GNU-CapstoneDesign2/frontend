import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchAlarmList = async () => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get("https://petfinderapp.duckdns.org/notices", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status == 200) return response.data.data;
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        Alert.alert("오류", "게시물 불러오기 실패");
    }
};
