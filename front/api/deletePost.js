//게시글 삭제
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default deletePost = async (postId) => {
    try {
        const token = await AsyncStorage.getItem("accessToken");
        const response = await axios.delete(`https://petfinderapp.duckdns.org/posts/${postId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return 1;
        } else {
            Alert.alert("권한이 없습니다.");
            return 0;
        }
    } catch (error) {
        console.error("deletePosts 실패:", error);
        throw error;
    }
};
