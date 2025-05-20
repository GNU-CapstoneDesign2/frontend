import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//로그인
import LoginPage from "./pages/LoginPage";
import KakaoLoginWebView from "./pages/KakaoLoginWebView";
import NaverLoginWebView from "./pages/NaverLoginWebView";
import Home from "./pages/Home";

//
import MainPage from "./pages/MainPage";
import CommunityPage from "./pages/CommunityPage";
import ChatPage from "./pages/ChatPage";
import MyPage from "./pages/MyPage";
//게시글 작성/상세
import MissingDetailPage from "./pages/MissingDetailPage";
import WitnessDetailPage from "./pages/WitnessDetailPage";
import MissingReportPage from "./pages/MissingReportPage";
import WitnessReportPage from "./pages/WitnessReportPage";

import AdoptDetailPage from "./pages/AdoptDetailPage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ animation: "none", headerShown: false }}>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="KakaoLoginWebView" component={KakaoLoginWebView} />
                <Stack.Screen name="NaverLoginWebView" component={NaverLoginWebView} />
                <Stack.Screen name="Home" component={Home} />

                <Stack.Screen name="Main" component={MainPage} />
                <Stack.Screen name="Community" component={CommunityPage} />
                <Stack.Screen name="Chat" component={ChatPage} />
                <Stack.Screen name="MyPage" component={MyPage} />

                <Stack.Screen name="MissingReport" component={MissingReportPage} />
                <Stack.Screen name="WitnessReport" component={WitnessReportPage} />
                <Stack.Screen name="MissingDetailPage" component={MissingDetailPage} />
                <Stack.Screen name="WitnessDetailPage" component={WitnessDetailPage} />

                <Stack.Screen name="AdoptDetailPage" component={AdoptDetailPage} />
                <Stack.Screen name="NoticeDetailPage" component={NoticeDetailPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
