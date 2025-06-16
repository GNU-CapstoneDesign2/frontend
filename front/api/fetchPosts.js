// 지도 범위 내 게시글 조회
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchPosts = async ({ bounds, filterQuery }) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.get(
            `https://petfinderapp.duckdns.org/map/posts?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLng=${bounds.minLng}&maxLng=${bounds.maxLng}&${filterQuery}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data.data.content;
        } else {
            console.error("게시글 조회 실패:", response.statusText);
        }
    } catch (error) {
        console.error("게시글 조회 실패:", error);
    }
};
