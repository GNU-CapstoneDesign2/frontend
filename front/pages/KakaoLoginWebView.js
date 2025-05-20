import React from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

export default function KakaoLoginWebView() {
    const navigation = useNavigation();

    const clientId = "3b3fdda7b0c5f45bc81cf54408606a17";
    const redirectUri = "https://auth.expo.io/@minijeans/pet-finder";

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

    const handleShouldStartLoadWithRequest = (event) => {
        const decodedUrl = decodeURIComponent(event.url);

        if (decodedUrl.startsWith(redirectUri)) {
            const codeMatch = decodedUrl.match(/code=([^&]+)/);
            const code = codeMatch?.[1];

            if (code) {
                console.log("카카오 인가 코드:", code);
                navigation.navigate("Main");
            } else {
                console.log("인가코드 없음");
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
