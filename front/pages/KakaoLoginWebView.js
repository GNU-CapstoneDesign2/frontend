import React from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

export default function KakaoLoginWebView() {
    const navigation = useNavigation();

    const clientId = "28bce61bd872f01f4d04a43752c6c4a5";
    const redirectUri = "https://auth.expo.io/@minijeans/pet-finder";

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    const handleShouldStartLoadWithRequest = (event) => {
        const decodedUrl = decodeURIComponent(event.url);

        if (decodedUrl.startsWith(redirectUri)) {
            const codeMatch = decodedUrl.match(/code=([^&]+)/);
            const code = codeMatch?.[1];
            if (code) {
                setTimeout(async () => {
                    try {
                        const response = await axios.get(
                            `https://petfinderapp.duckdns.org/auth/login/kakao?code=${code}`
                        );
                        const accessToken = response.data.data.accessToken;
                        if (accessToken) {
                            await AsyncStorage.setItem("accessToken", accessToken);
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: "Main" }],
                                })
                            );
                        } else {
                            console.error("accessToken이 응답에 없습니다.", response.data);
                        }
                    } catch (error) {
                        if (error.response) {
                            console.error("서버 응답 에러:", error.response.data);
                        } else if (error.request) {
                            console.error("요청은 갔으나 응답 없음:", error.request);
                        } else {
                            console.error("기타 에러:", error.message);
                        }
                    }
                }, 0);
            }
            return false;
        }
        return true;
    };

    return (
        <WebView
            source={{ uri: kakaoAuthUrl }}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
        />
    );
}
