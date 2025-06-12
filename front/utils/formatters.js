//010-0000-0000 변환
export const formatPhoneNumber = (phoneNumber) => {
    const numericText = phoneNumber.replace(/[^0-9]/g, "");

    let formattedText = numericText;
    if (numericText.length > 3 && numericText.length <= 7) {
        formattedText = `${numericText.slice(0, 3)}-${numericText.slice(3)}`;
    } else if (numericText.length > 7) {
        formattedText = `${numericText.slice(0, 3)}-${numericText.slice(3, 7)}-${numericText.slice(7, 11)}`;
    }

    return formattedText;
};

//ISO 8601 포맷의 날짜를 'yyyy년 mm월 dd일' 형태로 변환
export const formatDate = (date) => {
    // date: 'yyyy-mm-dd' 형태
    if (!date) return "";
    const [year, month, day] = date.split("-");
    const formattedDate = `${year}년 ${month}월 ${day}일`;
    return formattedDate;
};

//ISO 8601 포맷의 시간을 '오후 00시 00분' 형태로 변환
export const formatTime = (time) => {
    // time: 'HH:mm:ss' 형태
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    let hour = hourStr;
    const minute = minuteStr;
    let period = "오전";
    let formattedHours = hour;
    if (hour === 0) {
        formattedHours = 12;
    } else if (hour === 12) {
        period = "오후";
        formattedHours = 12;
    } else if (hour > 12) {
        period = "오후";
        formattedHours = hour - 12;
    }
    formattedHours = String(formattedHours).padStart(2, "0");
    return `${period} ${formattedHours}시 ${minute}분`;
};
