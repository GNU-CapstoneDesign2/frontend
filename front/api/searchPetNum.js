import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default searchPetNum = async (searchText) => {
    const token = await AsyncStorage.getItem("accessToken");

    try {
        const response = await axios.get(`https://petfinderapp.duckdns.org/map/search?query=${searchText}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status == 200) {
            return response.data.data.content[0];
        } else {
            console.error("등록번호 조회 실패:", response.statusText);
            return 0;
        }
    } catch (error) {
        console.error("등록번호 조회 실패:", error);
    }
};
