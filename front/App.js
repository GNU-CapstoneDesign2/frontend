import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 페이지 컴포넌트 import
import MainPage from "./pages/MainPage"; // 메인 홈
import MissingReportPage from "./pages/MissingReportPage"; // 실종 신고 페이지
import WitnessReportPage from "./pages/WitnessReportPage"; // 목격 제보 페이지
import MyPage from "./pages/MyPage"; // 마이페이지
import Community from "./pages/CommunityPage"; // 커뮤니티 페이지
import ChatPage from "./pages/ChatPage"; //채팅 페이지

import { ko, registerTranslation } from "react-native-paper-dates";
registerTranslation("ko", ko);

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        //네비게이션 트리의 루트. 앱 전체에 라우팅 기능을 적용하려면 반드시 필요
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Main"
                screenOptions={{
                    animation: "none",
                }}
            >
                <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }} />
                <Stack.Screen name="Community" component={Community} options={{ headerShown: false }} />
                <Stack.Screen name="MissingReport" component={MissingReportPage} options={{ headerShown: false }} />
                <Stack.Screen name="Chat" component={ChatPage} options={{ headerShown: false }} />
                <Stack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }} />
                <Stack.Screen name="WitnessReport" component={WitnessReportPage} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
