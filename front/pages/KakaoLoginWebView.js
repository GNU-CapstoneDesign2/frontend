// import React from "react";
// import { WebView } from "react-native-webview";
// import { useNavigation } from "@react-navigation/native";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function KakaoLoginWebView() {
//     const navigation = useNavigation();

//     const clientId = "28bce61bd872f01f4d04a43752c6c4a5";
//     const redirectUri = "https://auth.expo.io/@minijeans/pet-finder";

//     const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

//     const handleShouldStartLoadWithRequest = (event) => {
//         const decodedUrl = decodeURIComponent(event.url);

//         if (decodedUrl.startsWith(redirectUri)) {
//             const codeMatch = decodedUrl.match(/code=([^&]+)/);
//             const code = codeMatch?.[1];

//             if (code) {
//                 setTimeout(async () => {
//                     try {
//                         const response = await fetch(`https://petfinderapp.duckdns.org/auth/login/kakao?code=${code}`, {
//                             method: "GET",
//                         });
//                         if (response.status === 200) {
//                             const result = await response.json();
//                             //asyncStorage에 accessToken 저장
//                             await AsyncStorage.setItem("accessToken", result.data.accessToken);
//                             navigation.navigate("Main");
//                         } else {
//                             //실패 시 처리 코드
//                             console.log("API 호출 실패");
//                         }
//                     } catch (error) {
//                         console.log("API 호출 중 오류:", error);
//                     }
//                 }, 0);
//             } else {
//                 console.log("인가코드 없음");
//             }

//             return false;
//         }

//         return true;
//     };

//     return (
//         <WebView
//             source={{ uri: kakaoAuthUrl }}
//             onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
//             javaScriptEnabled
//             domStorageEnabled
//             startInLoadingState
//         />
//     );
// }
import React from "react";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function KakaoLoginWebView() {
  const navigation = useNavigation();

    const clientId = "28bce61bd872f01f4d04a43752c6c4a5";
    const redirectUri = "https://auth.expo.io/@minijeans/pet-finder";

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;

  const handleShouldStartLoadWithRequest = async (event) => {
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
                            navigation.replace("Main");
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
            return false; // 반드시 boolean 반환
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
