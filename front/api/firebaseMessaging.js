import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, ToastAndroid } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerForPushNotificationsAsync() {
    let fcmToken;

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            if (Platform.OS === "android") {
                ToastAndroid.show("알림 권한을 허용해주세요.", ToastAndroid.SHORT);
            } else {
                // iOS , ios 는 빌드 불가여서 제외
            }
            return;
        }

        // AsyncStorage 에 토큰이 없거나 기존에 저장된 토큰과 다를 때 FCM 토큰 서버에 저장
        const tokenResponse = await Notifications.getDevicePushTokenAsync();
        fcmToken = tokenResponse.data;

        const storedFcmToken = await AsyncStorage.getItem("storedFcmToken");

        if (!storedFcmToken || fcmToken !== storedFcmToken) {
            try {
                const token = await AsyncStorage.getItem("accessToken");
                const response = await axios.post(
                    "https://petfinderapp.duckdns.org/notice/token",
                    {
                        token: fcmToken,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    console.log("fcm 토큰 저장 완료 ");
                    await AsyncStorage.setItem("storedFcmToken", fcmToken);
                    return;
                } else {
                    console.log("서버 응답 오류:", response.data);
                    return;
                }
            } catch (error) {
                console.log("fcm 토큰 저장 에러:", error);
            }
        }
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
            });
        }
    }
}
