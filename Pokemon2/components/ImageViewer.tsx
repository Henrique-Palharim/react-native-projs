import { StyleSheet, StyleProp } from "react-native";
import { Image, ImageStyle, type ImageSource } from 'expo-image';

type Props = {
    imgSource: ImageSource;
    style?: StyleProp<ImageStyle>;
};

export default function ImageViewer({ imgSource, style }: Props) {
    return (
        <Image 
         source={imgSource} 
         style={styles.image}
        />
    ) 
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderWidth: 15,
        borderColor: "white"
    },
});