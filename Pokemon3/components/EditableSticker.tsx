import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// ADICIONADO: Importação do runOnJS na linha abaixo
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

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

  const [isDoubleSized, setIsDoubleSized] = useState(false);

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

  // gesto de zoom manual
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

  // gesto de double tap CORRIGIDO para não travar o Expo Go
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (isDoubleSized) {
        scale.value = withTiming(scale.value / 2);
        savedScale.value = savedScale.value / 2;
        // CORREÇÃO: Envolvendo a função no runOnJS
        runOnJS(setIsDoubleSized)(false);
      } else {
        scale.value = withTiming(scale.value * 2);
        savedScale.value = savedScale.value * 2;
        // CORREÇÃO: Envolvendo a função no runOnJS
        runOnJS(setIsDoubleSized)(true);
      }
    });

  const composedGesture = Gesture.Simultaneous(
    dragGesture, 
    Gesture.Simultaneous(pinchGesture, rotationGesture),
    doubleTapGesture
  );

  // Estilos aplicados no Sticker via Reanimated
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
      <Animated.View 
        style={[styles.stickerContainer, { width: size, height: size }, animatedStyle]}
      >
        <View style={styles.hitSlopWrapper}>
          <Image source={source} style={styles.stickerImage} contentFit="contain" />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  stickerContainer: {
    position: 'absolute',
    top: '35%',
    left: '35%',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitSlopWrapper: {
    width: '100%',
    height: '100%',
    padding: 15,
  },
  stickerImage: {
    width: '100%',
    height: '100%',
  },
});