import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/Button'; 
import { LinearGradient } from 'expo-linear-gradient';

export default function ImageTest() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para escolher uma imagem.");
      return;
    }

    // Criamos o objeto de opções separadamente
    const options = {
      mediaTypes: ['images'], 
      allowsEditing: true,    
      aspect: [1, 1],         
      quality: 1,  
      theme: 'dark', // Isso melhora a visibilidade das cores nativas
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN, // Força tela cheia (ajuda no contraste)
    };

    // Usamos 'as any' para o TypeScript ignorar a trava de tipo e aceitar a propriedade 'theme'
    const result = await ImagePicker.launchImageLibraryAsync(options as any);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
      </View>

      <Button 
        label="Escolher Foto da Galeria" 
        onPress={pickImage} 
      />

      {selectedImage && (
        <Button 
          label="Remover Foto" 
          onPress={() => setSelectedImage(null)} 
          style={{ backgroundColor: '#ff4444', marginTop: 10 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholder: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#aaa',
  },
});