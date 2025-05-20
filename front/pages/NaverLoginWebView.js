import React from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

export default function NaverLoginWebView() {
    const navigation = useNavigation();

    const clientId = "VY5rt5OHGGnarPwjTawA";
    const redirectUri = "https://auth.expo.io/@minijeans/pet-finder";
    const state = Math.random().toString(36).substring(2); // CSRF 방지용 랜덤 문자열

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

    const handleNavigationStateChange = (event) => {
        console.log("현재 URL:", event.url);

        if (event.url.startsWith(redirectUri)) {
            const codeMatch = event.url.match(/code=([^&]+)/);
            const code = codeMatch?.[1];

            if (code) {
                console.log("네이버 인가 코드:", code);
                // 여기서 code를 백엔드로 보내야 토큰 발급 가능
                //Something went wrong trying to finish signing in. Please close this screen to go back to the app. 네이버 개발자 센터에서 URL 설정? 필요

                navigation.navigate("Main");
            } else {
                console.log("인가코드 없음");
            }
        }
    };

    return (
        <WebView
            source={{ uri: naverAuthUrl }}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
        />
    );
}
