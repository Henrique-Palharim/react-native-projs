import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type StickerProps = {
  source: ImageSource;
  size?: number;
};

export default function EditableSticker({ source, size = 100 }: StickerProps) {
  
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  // gesto de arrastar
  const dragGesture = Gesture.Pan()
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
    });

  // gesto de zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // gesto de rotação
  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composedGesture = Gesture.Simultaneous(dragGesture, Gesture.Simultaneous(pinchGesture, rotationGesture));

  // estilos aplicados no Sticker
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        { rotate: `${(rotation.value * 180) / Math.PI}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[styles.stickerContainer, { width: size, height: size }, animatedStyle]}>
        <Image source={source} style={styles.stickerImage} contentFit="contain" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  stickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerImage: {
    width: '100%',
    height: '100%',
  },
});