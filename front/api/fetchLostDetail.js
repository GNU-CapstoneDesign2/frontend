//실종 게시글 데이터 가져오기
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchLostDetail = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(`https://petfinderapp.duckdns.org/posts/lost/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const result = response.data;
            return result;
        } else {
            console.error("게시글을 불러오는 데 실패했습니다 :", response.status);
            Alert.Alert("오류", "게시글을 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        Alert.alert("에러", "게시글을 불러오는 중 에러가 발생했습니다.");
    }
};
