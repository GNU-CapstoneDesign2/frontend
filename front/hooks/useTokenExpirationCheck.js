import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function useTokenExpirationCheck() {
    const navigation = useNavigation();
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("accessToken");
            const expiredAt = await AsyncStorage.getItem("tokenExpiredAt");
            if (token && expiredAt) {
                const now = Date.now();
                // if (now - parseInt(expiredAt, 10) > 60 * 60 * 1000) {
                if (now - parseInt(expiredAt, 10) > 60) {
                    // 1시간
                    await AsyncStorage.clear();
                    navigation.replace("LoginPage");
                }
            }
        };
        checkToken();
    }, []);
}
