//목격 게시글 상세보기
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchSightDetail = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(`https://petfinderapp.duckdns.org/posts/found/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const result = response.data;
            return result;
        } else {
            console.error("게시글을 불러오는 데 실패했습니다 :", response.status);
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
};
