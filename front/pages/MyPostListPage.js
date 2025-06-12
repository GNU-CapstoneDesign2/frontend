import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert, Modal } from "react-native";
import { SCREEN_WIDTH } from "../utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDate, formatTime } from "../utils/formatters";

import deletePost from "../api/deletePost";
import fetchMyPosts from "../api/fetchMyPosts";

export default function MyPostListPage() {
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        const getMyPosts = async () => {
            const result = await fetchMyPosts();
            setPosts(result);
        };
        getMyPosts();
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

    const [modalInfo, setModalInfo] = useState({ visible: false, postId: null });
    const handleDeleteButton = async (postId) => {
        const success = await deletePost(postId);
        if (success) {
            Alert.alert("삭제 완료", "게시글이 삭제되었습니다.", [{ text: "확인" }]);
        } else {
            Alert.alert("삭제 실패", "게시글 삭제에 실패했습니다.", [{ text: "확인" }]);
        }
    };

    const renderPostItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                navigation.navigate(getRouteName(item.state), { postId: item.postId });
                console.log(item.postId);
            }}
            activeOpacity={0.8}
        >
            {/* 이미지와 게시글 텍스트 컨테이너 */}
            <View style={{ flex: 1, flexDirection: "row", marginTop: 3, marginLeft: 3 }}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <View style={styles.details}>
                    {/* 상태 뱃지 */}
                    <View style={styles.stateBadge(item.state)}>
                        <Text style={styles.stateText}>{item.state === "LOST" ? "실종" : "목격"}</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text>
                            시간: {formatDate(item.date.split("T")[0]) + " " + formatTime(item.date.split("T")[1])}
                        </Text>

                        <Text>장소: {item.address}</Text>
                        <Text>설명: {item.description}</Text>
                    </View>
                </View>
            </View>

            {/* button wrapper */}
            <View style={styles.ButtonsWrapper}>
                {/* 수정버튼 */}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        Alert.alert("수정 페이지로 이동하는 코드");
                    }}
                >
                    <Ionicons name="pencil" size={16} color="#000" />
                    <Text style={styles.similarityText}>수정</Text>
                </TouchableOpacity>
                {/* 삭제버튼 */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => setModalInfo({ visible: true, postId: item.postId })}
                >
                    <Ionicons name="trash" size={16} color="#000" />
                    <Text style={styles.similarityText}>삭제</Text>
                </TouchableOpacity>
                {/* 유사글 조회 버튼 */}
                <TouchableOpacity
                    style={styles.similarityButton}
                    onPress={() => {
                        navigation.navigate("SimilarPostsPage", { postId: item.postId });
                    }}
                >
                    <Ionicons name="search" size={16} color="#000" />
                    <Text style={styles.similarityText}>유사도 매칭 결과</Text>
                </TouchableOpacity>
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

            {/* 탈퇴 확인 모달 */}
            <Modal
                visible={modalInfo.visible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalInfo({ visible: false, postId: null })}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>정말 삭제하시겠어요?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setModalInfo({ visible: false, postId: null })}
                                style={styles.cancelButton}
                            >
                                <Text style={styles.cancelText}>취소</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    handleDeleteButton(modalInfo.postId);
                                    setModalInfo({ visible: false, postId: null });
                                }}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        flexDirection: "column",
        backgroundColor: "#fff",
        marginVertical: 3,
        padding: 5,
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
        justifyContent: "space-between",
    },
    stateBadge: (type) => ({
        backgroundColor: type === "LOST" ? "#ff3b30" : "#0057ff",
        alignSelf: "flex-end",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    }),
    stateText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        textAlign: "center",
    },
    ButtonsWrapper: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    editButton: {
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: "center",
        height: 28,
        marginLeft: 8,
    },
    deleteButton: {
        flexDirection: "row",
        backgroundColor: "#f1f1f1",
        borderWidth: 1,
        borderColor: "#888",
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: "center",
        height: 28,
        marginLeft: 8,
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
        marginLeft: 8,
    },
    similarityText: {
        marginLeft: 4,
        fontSize: 11,
        fontWeight: "700",
    },

    // 모달
    modalOverlay: {
        flex: 1,
        backgroundColor: "#00000088",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginRight: 12,
    },
    cancelText: {
        fontWeight: "500",
    },
    confirmButton: {
        backgroundColor: "#f66",
        padding: 10,
        borderRadius: 8,
    },
    confirmText: {
        fontWeight: "500",
        color: "#fff",
    },
});
