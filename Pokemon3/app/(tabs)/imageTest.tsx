import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

// Importando o seu componente de botão
import Button from '@/components/Button'; 
import { LinearGradient } from 'expo-linear-gradient';

export default function Teste() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para escolher uma imagem.");
      return;
    }

    // Abre a galeria de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Apenas imagens
      allowsEditing: true,    // Permite cortar a imagem
      aspect: [1, 1],         // Força um quadrado (bom para o estilo de Pokémon)
      quality: 1,             // Qualidade máxima
    });

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
    backgroundColor: '#FAE6C9',
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // Deixa redondo igual à party
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