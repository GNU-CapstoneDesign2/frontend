import React, { useState, useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

const TimePicker = ({ value, onConfirm, style }) => {
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const onDismiss = useCallback(() => {
        setTimePickerVisible(false);
    }, []);

    const handleConfirm = useCallback(
        ({ hours, minutes }) => {
            const formattedHours = String(hours).padStart(2, "0");
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedTime = `${formattedHours}:${formattedMinutes}:00`; // ISO 8601 포맷, timePicker에서 초는 지원x 형식만 갖춤
            onConfirm(formattedTime);
            setTimePickerVisible(false);
        },
        [onConfirm]
    );

    return (
        <>
            <TouchableOpacity style={[styles.touchable, style]} onPress={() => setTimePickerVisible(true)}>
                <TextInput
                    style={styles.input}
                    value={value}
                    mode="outlined"
                    activeOutlineColor="grey"
                    cursorColor="black"
                    editable={false}
                />
            </TouchableOpacity>
            <TimePickerModal
                locale="ko"
                visible={timePickerVisible}
                onDismiss={onDismiss}
                onConfirm={handleConfirm}
                hours={new Date().getHours()}
                minutes={new Date().getMinutes()}
                defaultInputType="keyboard"
                label="시간 선택"
                cancelLabel="취소"
                confirmLabel="확인"
            />
        </>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: "48%",
    },
    input: {
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
    },
});

export default TimePicker;
