//지도 범위 내 마커 조회
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default fetchMarkers = async ({ bounds, filterQuery }) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
        const response = await axios.get(
            `https://petfinderapp.duckdns.org/map/markers?minLat=${bounds.minLat}&maxLat=${bounds.maxLat}&minLng=${bounds.minLng}&maxLng=${bounds.maxLng}&${filterQuery}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return response.data.data.markers;
        } else {
            console.error("마커 조회 실패:", response.statusText);
        }
    } catch (error) {
        console.error("마커 조회 실패:", error);
    }
};
