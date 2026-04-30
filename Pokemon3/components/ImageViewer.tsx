import { StyleSheet, StyleProp } from "react-native";
import { Image, ImageStyle, type ImageSource } from "expo-image";

type Props = {
    imgSource: ImageSource;
    style?: StyleProp<ImageStyle>;
};

export default function ImageViewer({ imgSource, style }: Props) {
    return (
        <Image 
         source={imgSource} 
         contentFit="contain"
         style={styles.image}
        />
    ) 
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 320,
        // borderWidth: 15,
        // borderColor: "white"
    },
});