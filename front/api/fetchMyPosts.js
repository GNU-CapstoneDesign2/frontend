//내 게시글 조회
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchMyPosts = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
        const response = await axios.get("https://petfinderapp.duckdns.org/users/me/posts", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 0, size: 30 },
        });

        return response.data.data.content;
    } catch (error) {
        console.log("Error:", error.response?.data || error.message);
        Alert.alert("오류", "게시물 불러오기 실패");
    }
};
