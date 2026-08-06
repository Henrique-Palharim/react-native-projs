import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, Text, useWindowDimensions, TouchableOpacity, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons'; 
import ViewShot from 'react-native-view-shot'; 
import { useNavigation } from 'expo-router'; 
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

import Button from '@/components/Button'; 
import EditableSticker from '@/components/EditableSticker';

export const LOCAL_STICKERS = [
  { id: 'stk_1', source: require('../../assets/images/stickers/bullbasaur.png'), label: 'Bulbasaur' },
  { id: 'stk_2', source: require('../../assets/images/stickers/pikachu.png'), label: 'Pikachu' },
  { id: 'stk_3', source: require('../../assets/images/stickers/pokebola.png'), label: 'Pokébola' },
  { id: 'stk_4', source: require('../../assets/images/stickers/psyduck.png'), label: 'Psyduck' },
  { id: 'stk_5', source: require('../../assets/images/stickers/snorlax.png'), label: 'Snorlax' },
  { id: 'stk_6', source: require('../../assets/images/stickers/squirtle.png'), label: 'Squirtle' },
];

export default function ImageTest() {
  const navigation = useNavigation(); 
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [tempImage, setTempImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [confirmedImage, setConfirmedImage] = useState<string | null>(null);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [activeStickers, setActiveStickers] = useState<{ id: string; source: any }[]>([]);
  const CROP_WINDOW_SIZE = screenWidth * 0.85;

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const viewShotRef = useRef<any>(null);

  const imageScale = useSharedValue(1);
  const savedImageScale = useSharedValue(1);
  const imageOffset = useSharedValue({ x: 0, y: 0 });
  const startImageOffset = useSharedValue({ x: 0, y: 0 });

  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    navigation.setOptions({
      headerShown: !tempImage, 
    });
  }, [tempImage, navigation]);

  // função para processar a imagem escolhida/tirada
  const processCapturedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    const imageRatio = asset.width / asset.height;
    let displayWidth = CROP_WINDOW_SIZE;
    let displayHeight = CROP_WINDOW_SIZE;

    if (imageRatio > 1) {
      displayWidth = CROP_WINDOW_SIZE * imageRatio;
    } else {
      displayHeight = CROP_WINDOW_SIZE / imageRatio;
    }

    setImageDimensions({ width: displayWidth, height: displayHeight });

    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setActiveStickers([]); 
    
    imageScale.value = 1;
    savedImageScale.value = 1;
    imageOffset.value = { x: 0, y: 0 };
    startImageOffset.value = { x: 0, y: 0 };

    setTempImage(asset);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria para escolher uma foto.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: false, 
      quality: 1,  
    });

    if (!result.canceled) {
      processCapturedAsset(result.assets[0]);
    }
  };

  // função para tirar foto com a câmera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera para tirar uma foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      processCapturedAsset(result.assets[0]);
    }
  };

  const handleConfirm = async () => {
    if (!tempImage || !viewShotRef.current) return;
    setLoading(true);

    try {
      const mergedImageUri = await viewShotRef.current?.capture();

      if (!mergedImageUri) {
        Alert.alert("Erro", "Não foi possível capturar a imagem da tela.");
        setLoading(false);
        return;
      }

      const manipResult = await ImageManipulator.manipulateAsync(
        mergedImageUri,
        [], 
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setConfirmedImage(manipResult.uri);
      setTempImage(null); 
    } catch (e) {
      Alert.alert("Erro", "Não foi possível processar os stickers na imagem.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!confirmedImage) return;

    try {
      const filename = `pokemon_sticker_${Date.now()}.jpg`;
      
      const baseDir = FileSystem.documentDirectory;
      const safeUri = `${baseDir}${filename}`;

      await FileSystem.copyAsync({
        from: confirmedImage,
        to: safeUri
      });

      await MediaLibrary.saveToLibraryAsync(safeUri);
      
      Alert.alert("Sucesso!", "A imagem com os stickers foi salva na sua galeria!");
    } catch (error) {
      console.error("Erro completo ao salvar:", error);
      Alert.alert(
        "Erro ao Salvar", 
        "Não foi possível gravar a imagem na galeria."
      );
    }
  };

  const imageDragGesture = Gesture.Pan()
    .onUpdate((e) => {
      imageOffset.value = {
        x: e.translationX + startImageOffset.value.x,
        y: e.translationY + startImageOffset.value.y,
      };
    })
    .onEnd(() => {
      startImageOffset.value = { x: imageOffset.value.x, y: imageOffset.value.y };
    });

  const imagePinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      imageScale.value = Math.max(1, savedImageScale.value * e.scale);
    })
    .onEnd(() => {
      savedImageScale.value = imageScale.value;
    });

  const imageGestureCombined = Gesture.Simultaneous(imageDragGesture, imagePinchGesture);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: imageOffset.value.x },
        { translateY: imageOffset.value.y },
        { scale: imageScale.value },
        { rotate: `${rotation}deg` },
        { scaleX: flipX ? -1 : 1 },
        { scaleY: flipY ? -1 : 1 },
      ],
    };
  });

  const addStickerToPhoto = (source: any) => {
    setActiveStickers((prev) => [...prev, { id: String(Date.now()), source }]);
  };

  const ToolButton = ({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap, label: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.toolButton} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#fff" />
      <Text style={styles.toolLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      
      <Modal
        visible={!!tempImage}
        animationType="slide"
        transparent={false}
      >
        {tempImage && (
          <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[styles.editContainer, { width: screenWidth, height: screenHeight }]}>
              <Text style={styles.previewTitle}>Personalize sua Foto</Text>
              
              <ViewShot 
                ref={viewShotRef} 
                options={{ format: 'jpg', quality: 0.9 }}
                style={[styles.cropWindow, { width: CROP_WINDOW_SIZE, height: CROP_WINDOW_SIZE }]}
              >
                <View style={styles.centerImageContainer}>
                  <GestureDetector gesture={imageGestureCombined}>
                    <Animated.Image 
                      source={{ uri: tempImage.uri }} 
                      style={[
                        { 
                          width: imageDimensions.width,
                          height: imageDimensions.height,
                        },
                        animatedImageStyle
                      ]} 
                      resizeMode="contain" 
                    />
                  </GestureDetector>
                </View>

                {activeStickers.map((sticker) => (
                  <EditableSticker key={sticker.id} source={sticker.source} size={75} />
                ))}
              </ViewShot>

              <Text style={styles.instructions}>Use dois dedos para zoom na imagem / Arraste os stickers</Text>

              <Text style={styles.sectionTitle}>Toque para adicionar um Sticker:</Text>
              <View style={styles.stickerDrawer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                  {LOCAL_STICKERS.map((stk) => (
                    <TouchableOpacity key={stk.id} style={styles.stickerThumbContainer} onPress={() => addStickerToPhoto(stk.source)}>
                      <Image source={stk.source} style={styles.stickerThumb} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.toolbar}>
                <ToolButton icon="reload" label="Girar 90°" onPress={() => setRotation((p) => (p + 90) % 360)} />
                <ToolButton icon="swap-horizontal" label="Inverter H" onPress={() => setFlipX(!flipX)} />
                <ToolButton icon="swap-vertical" label="Inverter V" onPress={() => setFlipY(!flipY)} />
                <ToolButton icon="trash-outline" label="Limpar" onPress={() => setActiveStickers([])} />
              </View>

              <View style={styles.actionButtons}>
                <Button label={loading ? "Salvando..." : "Confirmar"} onPress={handleConfirm} style={{ backgroundColor: '#2E78D6', width: screenWidth * 0.4 }} />
                <Button label="Cancelar" onPress={() => setTempImage(null)} style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: screenWidth * 0.4, marginLeft: 15 }} />
              </View>
            </View>
          </GestureHandlerRootView>
        )}
      </Modal>

      <View style={styles.mainBox}>
        <View style={styles.imageContainer}>
          {confirmedImage ? (
            <Image source={{ uri: confirmedImage }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholder]} />
          )}
        </View>
        
        {/* boões lado a lado */}
        <View style={styles.pickerButtonsRow}>
          <Button 
            label="Galeria" 
            onPress={pickImage} 
            style={styles.halfButton} 
          />
          <Button 
            label="Tirar Foto" 
            onPress={takePhoto} 
            style={[styles.halfButton, { backgroundColor: '#2E78D6' }]} 
          />
        </View>
        
        {confirmedImage && (
          <View style={styles.actionGroup}>
            <Button label="Salvar na Galeria" onPress={handleSaveToGallery} style={{ backgroundColor: '#28a745', marginTop: 10 }} />
            <Button label="Remover Foto" onPress={() => setConfirmedImage(null)} style={{ backgroundColor: '#ff4444', marginTop: 10 }} />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainBox: { alignItems: 'center', width: '100%', paddingHorizontal: 20 },
  pickerButtonsRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, width: 350 },
  halfButton: { flex: 1 },
  actionGroup: { width: 350 },
  editContainer: { backgroundColor: '#1a1a1a', paddingTop: 50, alignItems: 'center', flex: 1 }, 
  previewTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#fff' },
  instructions: { fontSize: 11, color: '#aaa', marginTop: 8, textAlign: 'center' },
  cropWindow: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', position: 'relative' },
  centerImageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { color: '#ccc', fontSize: 13, marginTop: 20, alignSelf: 'flex-start', marginLeft: '8%', fontWeight: '600' },
  stickerDrawer: { width: '85%', height: 75, marginTop: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, justifyContent: 'center' },
  stickerThumbContainer: { width: 55, height: 55, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  stickerThumb: { width: '85%', height: '85%' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 10, marginTop: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  toolButton: { alignItems: 'center', width: 75 },
  toolLabel: { fontSize: 10, color: '#ccc', marginTop: 4 },
  actionButtons: { flexDirection: 'row', marginTop: 'auto', marginBottom: 35, width: '100%', justifyContent: 'center' },
  imageContainer: { marginBottom: 20 },
  image: { width: 350, height: 350, borderRadius: 12, borderWidth: 3, borderColor: '#fff' },
  placeholder: { backgroundColor: 'rgba(0,0,0,0.1)', borderStyle: 'solid', borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 12 },
});