import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

const TimePicker = ({ value, onConfirm, disabled = false, style }) => {
    const [timePickerVisible, setTimePickerVisible] = useState(false);

    const onDismiss = () => setTimePickerVisible(false);

    const handleConfirm = ({ hours, minutes }) => {
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        onConfirm(formattedTime);
        setTimePickerVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.touchable, style]}
                onPress={() => !disabled && setTimePickerVisible(true)}
                activeOpacity={disabled ? 1 : 0.3}
            >
                <TextInput
                    style={[styles.input, disabled && styles.disabledInput]}
                    value={value}
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
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        backgroundColor: "white",
    },
});

export default TimePicker;
