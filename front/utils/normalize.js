import { Dimensions, PixelRatio } from "react-native";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 기준 사이즈
const STANDARD_WIDTH = 375;
const STANDARD_HEIGHT = 812;

export const normalize = (size) => {
    const scale = Math.min(SCREEN_WIDTH / STANDARD_WIDTH, SCREEN_HEIGHT / STANDARD_HEIGHT);
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
