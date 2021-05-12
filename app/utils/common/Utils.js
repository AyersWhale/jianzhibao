import {
    Dimensions,
    PixelRatio,
    StatusBar,
    Image,
} from "react-native";


// 获取设备屏幕的宽高
const { height, width } = Dimensions.get("window");
const Utils = {
    // 像素密度
    ratio: PixelRatio.get(),
    // 1 个像素
    pixel: 1 / PixelRatio.get(),
    size: {
        width: width,
        height: height
    },
    // 状态栏高度
    statusBarHeight: StatusBar.currentHeight,
    // 标题栏高度
    stackNavigatorHeight: 48,
    // 选择栏高度
    tabNavigatorHeight: 48,
    //宽等比例求高
    widthToHeight: (currentWidth, currentHeight) => {
        return currentHeight / currentWidth * width;
    },
    //高等比例求宽
    heightToWidth: (currentWidth, currentHeight) => {
        return currentWidth / currentHeight * height;
    },

    // 网络图片，通过URL获取宽高
    imageSize(url) {
        Image.getSize(url,
            (width, height) => {
                return { 'width': width, 'heigth': height }
            },
            (error) => {
                console.warn(error);
            })
    }
};

export default Utils;
