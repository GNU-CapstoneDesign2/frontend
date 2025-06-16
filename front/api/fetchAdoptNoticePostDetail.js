//공고/입양대기 게시글 상세보기
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchAdoptNoticePostDetail = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(`https://petfinderapp.duckdns.org/posts/adopt/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const result = response.data.data;
            return result;
        } else {
            console.error("게시글을 불러오는 데 실패했습니다 :", response.status);
            return 0;
        }
    } catch (error) {
        console.error("게시글을 불러오는 중 에러가 발생했습니다 :", error);
        return 0;
    }
};
