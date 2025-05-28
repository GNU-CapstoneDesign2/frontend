import React, { useState, useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utils/normalize";

const DatePicker = ({ value, onConfirm, style }) => {
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const onDismiss = useCallback(() => {
        setDatePickerVisible(false);
    }, []);

    const handleConfirm = useCallback(
        (params) => {
            const { date } = params;
            if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const formattedDate = `${year}년 ${month}월 ${day}일`;
                onConfirm(formattedDate);
            }
            setDatePickerVisible(false);
        },
        [onConfirm]
    );

    return (
        <>
            <TouchableOpacity style={[styles.touchable, style]} onPress={() => setDatePickerVisible(true)}>
                <TextInput
                    style={styles.input}
                    value={value}
                    mode="outlined"
                    activeOutlineColor="grey"
                    cursorColor="black"
                    editable={false}
                />
            </TouchableOpacity>
            <DatePickerModal
                mode="single"
                locale="ko"
                visible={datePickerVisible}
                onDismiss={onDismiss}
                date={new Date()}
                onConfirm={handleConfirm}
            />
        </>
    );
};

const styles = StyleSheet.create({
    touchable: {
        width: "50%",
    },
    input: {
        fontSize: SCREEN_WIDTH * 0.037,
        height: SCREEN_HEIGHT * 0.06,
        backgroundColor: "white",
    },
});

export default DatePicker;
