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
