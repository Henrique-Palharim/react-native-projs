import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, Alert, Text, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons'; 

import Button from '@/components/Button'; 
import EditableSticker from '@/components/EditableSticker'; 
import { LinearGradient } from 'expo-linear-gradient';

export const LOCAL_STICKERS = [
  { id: 'stk_1', source: require('../../assets/images/stickers/bullbasaur.png'), label: 'Bulbasaur' },
  { id: 'stk_2', source: require('../../assets/images/stickers/pikachu.png'), label: 'Pikachu' },
  { id: 'stk_3', source: require('../../assets/images/stickers/pokebola.png'), label: 'Pokébola' },
  { id: 'stk_4', source: require('../../assets/images/stickers/psyduck.png'), label: 'Psyduck' },
  { id: 'stk_5', source: require('../../assets/images/stickers/snorlax.png'), label: 'Snorlax' },
  { id: 'stk_6', source: require('../../assets/images/stickers/squirtle.png'), label: 'Squirtle' },
];

export default function ImageTest() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [tempImage, setTempImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [confirmedImage, setConfirmedImage] = useState<string | null>(null);

  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [activeStickers, setActiveStickers] = useState<{ id: string; source: any }[]>([]);

  const scrollOffset = useRef({ x: 0, y: 0 });
  const currentZoom = useRef(1);
  const CROP_WINDOW_SIZE = screenWidth * 0.85;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: false, 
      quality: 1,  
    });

    if (!result.canceled) {
      setRotation(0);
      setFlipX(false);
      setFlipY(false);
      setActiveStickers([]); 
      setTempImage(result.assets[0]);
    }
  };

  const handleConfirm = async () => {
    if (!tempImage) return;
    setLoading(true);

    try {
      const displayWidth = CROP_WINDOW_SIZE * 2;
      const displayHeight = CROP_WINDOW_SIZE * 2;
      const scaleX = tempImage.width / displayWidth;
      const scaleY = tempImage.height / displayHeight;

      const cropX = (scrollOffset.current.x * scaleX) / currentZoom.current;
      const cropY = (scrollOffset.current.y * scaleY) / currentZoom.current;
      const cropWidth = (CROP_WINDOW_SIZE * scaleX) / currentZoom.current;
      const cropHeight = (CROP_WINDOW_SIZE * scaleY) / currentZoom.current;

      const actions: ImageManipulator.Action[] = [];
      if (rotation !== 0) actions.push({ rotate: rotation });
      if (flipX) actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      if (flipY) actions.push({ flip: ImageManipulator.FlipType.Vertical });
      
      actions.push({
        crop: { originX: cropX, originY: cropY, width: cropWidth, height: cropHeight },
      });

      const manipResult = await ImageManipulator.manipulateAsync(
        tempImage.uri,
        actions,
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setConfirmedImage(manipResult.uri);
      setTempImage(null); 
    } catch (e) {
      Alert.alert("Erro", "Não foi possível processar a imagem.");
    } finally {
      setLoading(false);
    }
  };

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
      
      {tempImage ? (
        <View style={[styles.editContainer, { width: screenWidth, height: screenHeight }]}>
          <Text style={styles.previewTitle}>Personalize sua Foto</Text>
          
          <View style={[styles.cropWindow, { width: CROP_WINDOW_SIZE, height: CROP_WINDOW_SIZE }]}>
            
            {/* MUDANÇA 3: Passamos a propriedade source direto (sem o { uri }) para as imagens locais */}
            {activeStickers.map((sticker) => (
              <EditableSticker key={sticker.id} source={sticker.source} size={75} />
            ))}

            <ScrollView
              horizontal
              maximumZoomScale={4}
              minimumZoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onScroll={(e) => {
                scrollOffset.current = { x: e.nativeEvent.contentOffset.x, y: e.nativeEvent.contentOffset.y };
                currentZoom.current = e.nativeEvent.zoomScale || 1;
              }}
              scrollEventThrottle={16}
              contentContainerStyle={styles.centerScroll}
            >
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.centerScroll}
              >
                <Image 
                  source={{ uri: tempImage.uri }} 
                  style={{ 
                    width: CROP_WINDOW_SIZE * 2, 
                    height: CROP_WINDOW_SIZE * 2,
                    transform: [{ rotate: `${rotation}deg` }, { scaleX: flipX ? -1 : 1 }, { scaleY: flipY ? -1 : 1 }] 
                  }} 
                  resizeMode="contain"
                />
              </ScrollView>
            </ScrollView>
            
            <View style={styles.gridOverlay} pointerEvents="none" />
          </View>

          <Text style={styles.instructions}>Arraste e use 2 dedos para ajustar os stickers</Text>

          {/* GAVETA DE STICKERS DISPONÍVEIS */}
          <Text style={styles.sectionTitle}>Toque para adicionar um Sticker:</Text>
          <View style={styles.stickerDrawer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
              {/* MUDANÇA 4: Trocamos o AVAILABLE_STICKERS por LOCAL_STICKERS e removemos a chave uri do Image */}
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
      ) : (
        <View style={styles.mainBox}>
          <View style={styles.imageContainer}>
            {confirmedImage ? (
              <Image source={{ uri: confirmedImage }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]} />
            )}
          </View>
          <Button label="Escolher Foto da Galeria" onPress={pickImage} />
          {confirmedImage && (
            <Button label="Remover Foto" onPress={() => setConfirmedImage(null)} style={{ backgroundColor: '#ff4444', marginTop: 10 }} />
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainBox: { alignItems: 'center' },
  editContainer: { backgroundColor: '#1a1a1a', paddingTop: 40, alignItems: 'center' },
  previewTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#fff' },
  instructions: { fontSize: 11, color: '#aaa', marginTop: 8, textAlign: 'center' },
  centerScroll: { alignItems: 'center', justifyContent: 'center' },
  cropWindow: { borderRadius: 8, overflow: 'hidden', backgroundColor: '#000', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', position: 'relative' },
  gridOverlay: { ...StyleSheet.absoluteFillObject, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  sectionTitle: { color: '#ccc', fontSize: 13, marginTop: 20, alignSelf: 'flex-start', marginLeft: '8%', fontWeight: '600' },
  stickerDrawer: { width: '85%', height: 75, marginTop: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 10, justifyContent: 'center' },
  stickerThumbContainer: { width: 55, height: 55, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  stickerThumb: { width: '85%', height: '85%' },
  toolbar: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', paddingVertical: 10, marginTop: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  toolButton: { alignItems: 'center', width: 75 },
  toolLabel: { fontSize: 10, color: '#ccc', marginTop: 4 },
  actionButtons: { flexDirection: 'row', marginTop: 'auto', marginBottom: 35, width: '100%', justifyContent: 'center' },
  imageContainer: { marginBottom: 20 },
  image: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: '#fff' },
  placeholder: { backgroundColor: 'rgba(0,0,0,0.1)', borderStyle: 'dashed', borderWidth: 2, borderColor: '#aaa' },
});