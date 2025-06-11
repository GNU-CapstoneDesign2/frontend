import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ko, registerTranslation } from "react-native-paper-dates";

//로그인
import LoginPage from "./pages/LoginPage";
import KakaoLoginWebView from "./pages/KakaoLoginWebView";
import NaverLoginWebView from "./pages/NaverLoginWebView";

import MainPage from "./pages/MainPage";
import CommunityPage from "./pages/CommunityPage";

//게시글 작성/상세
import MissingDetailPage from "./pages/MissingDetailPage";
import WitnessDetailPage from "./pages/WitnessDetailPage";
import MissingReportPage from "./pages/MissingReportPage";
import WitnessReportPage from "./pages/WitnessReportPage";

import AdoptDetailPage from "./pages/AdoptDetailPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";

//채팅방
import ChatPage from "./pages/ChatPage";
import ChatRoomPage from "./pages/ChatRoomPage";

//마이페이지
import MyPage from "./pages/MyPage";
import EditProfilePage from "./pages/EditProfilePage";

//유사도 조회 페이지
import SimilarPostsPage from "./pages/SimilarPostsPage";

import { LocationProvider } from "./contexts/LocationContext";
registerTranslation("ko", ko);
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <LocationProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ animation: "none", headerShown: false }}>
                    <Stack.Screen name="LoginPage" component={LoginPage} />
                    <Stack.Screen name="KakaoLoginWebView" component={KakaoLoginWebView} />
                    <Stack.Screen name="NaverLoginWebView" component={NaverLoginWebView} />

                    <Stack.Screen name="Main" component={MainPage} />
                    <Stack.Screen name="Community" component={CommunityPage} />

                    <Stack.Screen name="MissingReportPage" component={MissingReportPage} />
                    <Stack.Screen name="WitnessReportPage" component={WitnessReportPage} />
                    <Stack.Screen name="MissingDetailPage" component={MissingDetailPage} />
                    <Stack.Screen name="WitnessDetailPage" component={WitnessDetailPage} />

                    <Stack.Screen name="AdoptDetailPage" component={AdoptDetailPage} />
                    <Stack.Screen name="NoticeDetailPage" component={NoticeDetailPage} />

                    <Stack.Screen name="ChatPage" component={ChatPage} />
                    <Stack.Screen name="ChatRoomPage" component={ChatRoomPage} />

                    <Stack.Screen name="MyPage" component={MyPage} />
                    <Stack.Screen name="EditProfilePage" component={EditProfilePage} />

                    <Stack.Screen name="SimilarPostsPage" component={SimilarPostsPage} />
                </Stack.Navigator>
            </NavigationContainer>
        </LocationProvider>
    );
}
