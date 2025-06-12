// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from "react-native";
// import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function MyPostListPage() {
//     const navigation = useNavigation();
//     const [posts, setPosts] = useState([]);
//     const [filter, setFilter] = useState(null);

//     const fetchPosts = async () => {
//         try {
//             const token = await AsyncStorage.getItem("accessToken");
//             if (!token) return;

//             const response = await axios.get("https://petfinderapp.duckdns.org/users/me/posts", {
//                 headers: { Authorization: `Bearer ${token}` },
//                 params: { page: 0, size: 10 },
//             });

//             setPosts(response.data.data.content);
//         } catch (error) {
//             console.log("Error:", error.response?.data || error.message);
//             Alert.alert("오류", "게시물 불러오기 실패");
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const toggleFilter = (type) => {
//         setFilter((prev) => (prev === type ? null : type));
//     };

//     const filteredPosts = filter ? posts.filter((post) => post.state === filter) : posts;

//     const getRouteName = (state) => {
//         switch (state) {
//             case "LOST":
//                 return "MissingDetailPage";
//             case "SIGHT":
//                 return "WitnessDetailPage";
//             default:
//                 return "DefaultDetailPage";
//         }
//     };

//     const renderPostItem = ({ item }) => (
//         <TouchableOpacity
//             style={styles.card}
//             onPress={() => {
//                 navigation.navigate(getRouteName(item.state), { postId: item.postId });
//             }}
//             activeOpacity={0.8}
//         >
//             <Image source={{ uri: item.imageUrl }} style={styles.image} />

//             <View style={styles.details}>
//                 <View style={styles.stateBadge(item.state)}>
//                     <Text style={styles.stateText}>{item.state === "LOST" ? "실종" : "목격"}</Text>
//                 </View>
//                 <Text>시간: {new Date(item.date).toLocaleString()}</Text>
//                 <Text>장소: {item.address}</Text>
//                 <Text>설명: {item.description}</Text>
//                 <View style={styles.similarityWrapper}>
//                     {item.state === "LOST" ? (
//                         <TouchableOpacity style={styles.similarityButton}>
//                             <Ionicons name="search" size={16} color="#000" />
//                             <Text style={styles.similarityText}>유사도 매칭 결과</Text>
//                         </TouchableOpacity>
//                     ) : (
//                         <View style={{ height: 28 }} />
//                     )}
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     const insets = useSafeAreaInsets();
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Ionicons name="chevron-back" size={24} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>내 게시물 목록</Text>
//                 <View style={{ width: 24 }} />
//             </View>

//             <View style={styles.filterWrapper}>
//                 <TouchableOpacity
//                     style={[styles.fullWidthButton, filter === "LOST" && styles.activeButton]}
//                     onPress={() => toggleFilter("LOST")}
//                 >
//                     <Text>실종</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[styles.fullWidthButton, filter === "SIGHT" && styles.activeButton]}
//                     onPress={() => toggleFilter("SIGHT")}
//                 >
//                     <Text>목격</Text>
//                 </TouchableOpacity>
//             </View>

//             <FlatList
//                 data={filteredPosts}
//                 keyExtractor={(item) => item.postId.toString()}
//                 renderItem={renderPostItem}
//                 contentContainerStyle={{ paddingBottom: 20 }}
//             />
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#fff" },
//     header: {
//         height: 56,
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ccc",
//         justifyContent: "space-between",
//     },
//     headerTitle: { fontSize: SCREEN_WIDTH * 0.038, fontWeight: "bold" },
//     filterWrapper: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         paddingHorizontal: 16,
//         marginVertical: 10,
//     },
//     fullWidthButton: {
//         flex: 1,
//         marginHorizontal: 4,
//         backgroundColor: "#eee",
//         borderRadius: 20,
//         paddingVertical: 12,
//         alignItems: "center",
//     },
//     activeButton: {
//         backgroundColor: "#ccc",
//     },
//     card: {
//         flexDirection: "row",
//         backgroundColor: "#fff",
//         marginVertical: 3,
//         padding: 10,
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 4,
//         alignItems: "center",
//         position: "relative",
//     },
//     image: {
//         width: 100,
//         height: 100,
//         borderRadius: 8,
//     },
//     details: {
//         flex: 1,
//         padding: 8,
//         justifyContent: "space-between",
//     },
//     stateBadge: (type) => ({
//         alignSelf: "flex-end",
//         backgroundColor: type === "LOST" ? "#ff3b30" : "#0057ff",
//         borderRadius: 12,
//         paddingHorizontal: 10,
//         paddingVertical: 2,
//         marginBottom: 5,
//         alignItems: "center",
//         justifyContent: "center",
//     }),
//     stateText: {
//         color: "#fff",
//         fontWeight: "bold",
//         fontSize: 14,
//         textAlign: "center",
//     },
//     similarityWrapper: {
//         marginTop: 8,
//         alignItems: "flex-end",
//     },
//     similarityButton: {
//         flexDirection: "row",
//         backgroundColor: "#f1f1f1",
//         borderWidth: 1,
//         borderColor: "#888",
//         borderRadius: 10,
//         paddingVertical: 4,
//         paddingHorizontal: 8,
//         alignItems: "center",
//         height: 28,
//     },
//     similarityText: {
//         marginLeft: 4,
//         fontSize: 11,
//         fontWeight: "500",
//     },
// });
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import { SCREEN_WIDTH } from "../utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function MyPostListPage() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState(null);
    const insets = useSafeAreaInsets();

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (!token) return;

            const response = await axios.get("https://petfinderapp.duckdns.org/users/me/posts", {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: 0, size: 10 },
            });

            setPosts(response.data.data.content);
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            Alert.alert("오류", "게시물 불러오기 실패");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const toggleFilter = (type) => {
        setFilter((prev) => (prev === type ? null : type));
    };

    const filteredPosts = filter ? posts.filter((post) => post.state === filter) : posts;

    const getRouteName = (state) => {
        switch (state) {
            case "LOST":
                return "MissingDetailPage";
            case "SIGHT":
                return "WitnessDetailPage";
            default:
                return "DefaultDetailPage";
        }
    };

    const renderPostItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(getRouteName(item.state), { postId: item.postId })}
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />

            <View style={styles.details}>
                <View style={styles.stateBadge(item.state)}>
                    <Text style={styles.stateText}>{item.state === "LOST" ? "실종" : "목격"}</Text>
                </View>
                <Text>시간: {new Date(item.date).toLocaleString()}</Text>
                <Text>장소: {item.address}</Text>
                <Text>설명: {item.description}</Text>
                <View style={styles.similarityWrapper}>
                    {item.state === "LOST" ? (
                        <TouchableOpacity style={styles.similarityButton}>
                            <Ionicons name="search" size={16} color="#000" />
                            <Text style={styles.similarityText}>유사도 매칭 결과</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={{ height: 28 }} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>내 게시물 목록</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.filterWrapper}>
                <TouchableOpacity
                    style={[styles.fullWidthButton, filter === "LOST" && styles.activeButton]}
                    onPress={() => toggleFilter("LOST")}
                >
                    <Text>실종</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.fullWidthButton, filter === "SIGHT" && styles.activeButton]}
                    onPress={() => toggleFilter("SIGHT")}
                >
                    <Text>목격</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.postId.toString()}
                renderItem={renderPostItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        justifyContent: "space-between",
    },
    headerTitle: { fontSize: SCREEN_WIDTH * 0.038, fontWeight: "bold" },
    filterWrapper: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    fullWidthButton: {
        flex: 1,
        marginHorizontal: 4,
        backgroundColor: "#eee",
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeButton: {
        backgroundColor: "#ccc",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginVertical: 3,
        padding: 10,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        alignItems: "center",
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        padding: 8,
        justifyContent: "space-between",
    },
    stateBadge: (type) => ({
        alignSelf: "flex-end",
        backgroundColor: type === "LOST" ? "#ff3b30" : "#0057ff",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "center",
    }),
    stateText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    similarityWrapper: {
        marginTop: 8,
        alignItems: "flex-end",
    },
    similarityButton: {
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: "center",
        height: 28,
    },
    similarityText: {
        marginLeft: 4,
        fontSize: 11,
        fontWeight: "500",
    },
});
