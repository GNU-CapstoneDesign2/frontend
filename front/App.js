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

//게시글 작성/상세보기
import MissingDetailPage from "./pages/MissingDetailPage";
import WitnessDetailPage from "./pages/WitnessDetailPage";
import MissingReportPage from "./pages/MissingReportPage";
import WitnessReportPage from "./pages/WitnessReportPage";

//공공 데이터 상세보기
import AdoptNoticeDetailPage from "./pages/AdoptNoticeDetailPage";

//채팅방
import ChatPage from "./pages/ChatPage";
import ChatRoomPage from "./pages/ChatRoomPage";

//마이페이지
import MyPage from "./pages/MyPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyPostListPage from "./pages/MyPostListPage";

//유사도 조회 페이지
import SimilarPostsPage from "./pages/SimilarPostsPage";
//게시글 수정 페이지
import EditMissingReportPage from "./pages/EditMissingReportPage";
import EditWitnessReportPage from "./pages/EditWitnessReportPage";

import { LocationProvider } from "./contexts/LocationContext";
import { enableScreens } from "react-native-screens";
enableScreens();
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

                    <Stack.Screen name="AdoptNoticeDetailPage" component={AdoptNoticeDetailPage} />

                    <Stack.Screen name="ChatPage" component={ChatPage} />
                    <Stack.Screen name="ChatRoomPage" component={ChatRoomPage} />

                    <Stack.Screen name="MyPage" component={MyPage} />
                    <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
                    <Stack.Screen name="MyPostListPage" component={MyPostListPage} />
                    <Stack.Screen name="EditMissingReportPage" component={EditMissingReportPage} />
                    <Stack.Screen name="EditWitnessReportPage" component={EditWitnessReportPage} />

                    <Stack.Screen name="SimilarPostsPage" component={SimilarPostsPage} />
                </Stack.Navigator>
            </NavigationContainer>
        </LocationProvider>
    );
}
