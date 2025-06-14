import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import { SCREEN_WIDTH } from "../utils/normalize";
import { Card, Provider as PaperProvider } from "react-native-paper";
import { FlatList } from "react-native";

export default function CommunityPage() {
    const sample = [
        {
            id: 1,
            title: "강아지에게 초콜릿이 위험한 이유",
            summary: "강아지에게 초콜릿을 먹이는 것은 치명적인 결과를 초래할 수 있습니다.",
            category: "주의사항",
            created_at: "2025-06-13",
            keywords: ["초콜릿", "테오브로민 중독", "강아지 금지 음식", "반려견 건강"],
            content:
                "초콜릿에는 테오브로민이라는 성분이 포함되어 있습니다. 이는 사람에게는 비교적 안전하지만, 강아지의 대사 시스템은 이를 처리하는 속도가 매우 느립니다. 테오브로민은 중추신경계와 심장에 영향을 미치며, 과다 섭취 시 구토, 설사, 발작, 심장마비까지 유발할 수 있습니다. 특히 다크 초콜릿은 함량이 높아 더 위험합니다. 소량이라도 반려견에게는 독이 될 수 있으므로 절대 주지 마세요.",
            tip: "만약 강아지가 실수로 초콜릿을 먹었다면, 즉시 동물병원에 연락하고 섭취한 양과 종류를 알려주는 것이 중요합니다.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample1.png"),
        },
        {
            id: 2,
            title: "고양이가 갑자기 화장실을 실수한다면?",
            summary: "화장실 외에 실수를 하는 고양이의 행동에는 건강 문제나 스트레스 요인이 숨어 있을 수 있습니다.",
            category: "건강",
            created_at: "2025-06-13",
            keywords: ["고양이 실수", "방광염", "스트레스", "화장실 문제"],
            content:
                "고양이는 보통 매우 청결한 동물로, 정해진 곳에서만 배변을 합니다. 그런데 갑자기 다른 곳에 소변이나 대변을 본다면 이는 단순한 반항이 아니라, 방광염, 요로결석, 스트레스 또는 환경 변화에 따른 신호일 수 있습니다. 특히 방광염의 경우 소변에 피가 섞이거나 자주 화장실에 가는 등의 증상이 동반되므로 조기에 확인이 필요합니다. 또한 화장실 모래의 종류가 바뀌었거나 위치가 달라졌을 때도 거부 반응을 보일 수 있습니다.",
            tip: "고양이가 갑자기 이상 행동을 보일 경우, 환경 변화나 건강 이상을 의심하고 수의사 상담을 받아보는 것이 좋습니다.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample2.jpg"),
        },
        {
            id: 3,
            title: "강아지에게 양파는 절대 금지!",
            summary: "강아지가 양파를 먹으면 적혈구가 파괴돼 빈혈이나 신장 손상으로 이어질 수 있습니다.",
            category: "주의사항",
            created_at: "2025-06-14",
            keywords: ["양파", "강아지 금지 음식", "빈혈", "신장 손상"],
            content:
                "강아지가 양파를 섭취하면 적혈구가 파괴되어 빈혈 증상이 나타날 수 있으며, 심한 경우 신장 손상까지 발생할 수 있습니다. 익힌 양파도 마찬가지로 독성이 있으므로 반려견 음식에 절대 포함시키지 않아야 합니다. 양파뿐 아니라 양파가 포함된 음식물도 주의해야 합니다.",
            tip: "만약 강아지가 양파를 먹었다면 즉시 동물병원에 방문해 적절한 치료를 받도록 하세요.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample3.jpg"),
        },
        {
            id: 4,
            title: "고양이는 물 마시는 위치를 민감하게 느낀다",
            summary: "고양이는 사료 옆에 놓인 물을 꺼리는 습성이 있어 물그릇 위치에 신경 써야 합니다.",
            category: "행동습성",
            created_at: "2025-06-14",
            keywords: ["고양이 습성", "수분 보충", "물그릇 위치", "반려묘 건강"],
            content:
                "고양이는 본능적으로 사료 옆에 놓인 물을 꺼리는 경향이 있습니다. 따라서 물그릇은 사료와 떨어진 곳에 놓아야 하며, 여러 장소에 물그릇을 두는 것이 수분 섭취를 증가시키는 데 효과적입니다. 충분한 수분 섭취는 신장 건강에도 매우 중요합니다.",
            tip: "고양이에게 깨끗한 물을 자주 갈아주고 여러 군데에 물그릇을 배치해 주세요.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample4.jpg"),
        },
        {
            id: 5,
            title: "강아지 산책은 아침 저녁이 좋아요",
            summary: "여름철 아스팔트가 뜨거울 때는 강아지 발바닥 화상을 예방하기 위해 산책 시간을 조절해야 합니다.",
            category: "일상관리",
            created_at: "2025-06-14",
            keywords: ["강아지 산책", "여름 산책", "발바닥 화상", "반려견 관리"],
            content:
                "여름철 아스팔트 온도는 매우 높아져 강아지 발바닥이 쉽게 화상을 입을 수 있습니다. 특히 한낮 시간대 산책은 피하고, 아침 일찍이나 해질 무렵에 산책하는 것이 강아지 건강에 안전합니다. 또한 산책 후 발을 깨끗이 닦아주는 것이 좋습니다.",
            tip: "산책 전 아스팔트 온도를 손으로 확인하거나, 강아지 신발을 신기는 것도 방법입니다.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample5.jpg"),
        },
        {
            id: 6,
            title: "고양이의 그루밍, 너무 잦으면 스트레스 신호",
            summary: "고양이가 하루 종일 계속 털을 핥는다면 스트레스나 피부 질환일 수 있습니다.",
            category: "건강",
            created_at: "2025-06-14",
            keywords: ["고양이 행동", "그루밍", "스트레스 신호", "피부 질환"],
            content:
                "고양이는 자신을 깨끗이 하기 위해 그루밍을 하지만, 지나치게 자주 털을 핥으면 스트레스 또는 피부 질환을 의심해야 합니다. 과도한 그루밍으로 인해 털이 빠지거나 피부에 상처가 생길 수 있으므로 주의 깊게 관찰하는 것이 필요합니다.",
            tip: "이상이 느껴지면 수의사에게 진료를 받도록 하세요.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample6.jpg"),
        },
        {
            id: 7,
            title: "반려동물에게도 예방접종은 필수!",
            summary: "강아지와 고양이 모두 기본 예방접종을 통해 감염병을 예방해야 합니다.",
            category: "건강관리",
            created_at: "2025-06-14",
            keywords: ["예방접종", "강아지", "고양이", "감염병 예방"],
            content:
                "반려견과 반려묘는 생후 몇 주부터 필수 예방접종을 시작해야 합니다. 파보, 코로나, 광견병 등 심각한 감염병을 예방할 수 있으므로 예방접종 계획을 반드시 수의사와 상의해 철저히 관리해야 합니다. 주기적인 추가 접종도 중요합니다.",
            tip: "예방접종 기록을 꼼꼼히 관리하고 정기적인 건강검진도 병행하세요.",
            source: "AI 생성 예시 콘텐츠",
            image: require("../assets/sample/sample7.jpg"),
        },
    ];

    const renderItem = ({ item }) => (
        <Card style={styles.card} mode="elevated">
            <Card.Content>
                <Card.Cover source={item.image ? item.image : require("../assets/image_not_found.jpg")} />

                <Text variant="titleLarge" style={styles.cardTitle}>
                    {item.title}
                </Text>
                <Text variant="bodyMedium" numberOfLines={2}>
                    {item.summary}
                </Text>
                <Text style={styles.cardDate}>{item.created_at}</Text>
            </Card.Content>
        </Card>
    );
    return (
        <PaperProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <Text style={styles.title}>커뮤니티</Text>
                    </View>

                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={sample}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />

                    <NavigationBar />
                </View>
            </SafeAreaView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#fff",
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: SCREEN_WIDTH * 0.038,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    //
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    card: {
        marginBottom: 16,
        elevation: 2,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 5,
    },
    cardDate: {
        marginTop: 8,
        fontSize: 12,
        color: "#888",
    },
});
