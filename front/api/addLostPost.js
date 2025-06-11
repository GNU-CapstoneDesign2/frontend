import AsyncStorage from "@react-native-async-storage/async-storage";

export default addLostPost = async (formData, navigation) => {
    const token = await AsyncStorage.getItem("accessToken");
    try {
        const response = await fetch("https://petfinderapp.duckdns.org/posts/lost", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json(); // JSON 파싱 완료
            console.log("게시글 등록 성공, postId : ", result);
            navigation.navigate("SimilarPostsPage");
        } else {
            const errorData = await response.text();
            console.log("서버 응답 오류:", errorData);
            Alert.alert("오류", "게시글 등록에 실패했습니다.");
        }
    } catch (error) {
        console.log("게시글 등록 에러:", error);
        Alert.alert("에러", "게시글 등록 중 문제가 발생했습니다.");
    }
};
