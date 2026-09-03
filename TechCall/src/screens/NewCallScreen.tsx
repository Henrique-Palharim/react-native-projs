import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function NewCallScreen({ navigation }: any) {
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos da câmera para o chamado.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos acessar suas fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleGetLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão negada', 'Precisamos da localização para o check-in.');
      return;
    }
    setLoadingLocation(true);
    try {
      const gpsAtivo = await Location.hasServicesEnabledAsync();
      if (!gpsAtivo) {
        Alert.alert('GPS desligado', 'Ative a localização do aparelho e tente novamente.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [local] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (local) {
        const enderecoFormatado = `${local.street ?? 'Endereço não identificado'}, ${local.city ?? ''} - ${local.region ?? ''}`;
        setAddress(enderecoFormatado);
      } else {
        setAddress('Endereço não encontrado para esta coordenada.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
      setLoadingLocation(false);
    }
  }

  // GRAVAÇÃO NO FIRESTORE
  async function handleCreateCall() {
    if (!description.trim()) {
      Alert.alert('Atenção', 'Preencha a descrição do problema.');
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, 'chamados'), {
        description,
        photoUri,
        address,
        status: 'pendente',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Sucesso', 'Chamado registrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar o chamado no banco.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Novo Chamado</Text>

      <Text style={styles.label}>Descrição do problema</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Notebook não liga..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Foto do equipamento</Text>
      {photoUri ? (
        <View>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <TouchableOpacity onPress={() => setPhotoUri(null)} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remover foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Nenhuma foto anexada</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>Câmera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={handlePickFromGallery}>
          <Text style={styles.buttonText}>Galeria</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Localização do chamado</Text>
      {loadingLocation ? (
        <Text style={styles.placeholderText}>Buscando localização...</Text>
      ) : address ? (
        <Text style={styles.addressText}>{address}</Text>
      ) : (
        <Text style={styles.placeholderText}>Nenhuma localização registrada</Text>
      )}

      <TouchableOpacity
        style={[styles.button, styles.locationButton]}
        onPress={handleGetLocation}
        disabled={loadingLocation}
      >
        <Text style={styles.buttonText}>{loadingLocation ? 'Buscando...' : 'Registrar localização'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.confirmButton, (!description || saving) && styles.disabledButton]}
        disabled={!description || saving}
        onPress={handleCreateCall}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar Chamado</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#fff', padding: 12, minHeight: 80, textAlignVertical: 'top' },
  placeholder: { height: 160, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#999', marginVertical: 4 },
  addressText: { fontSize: 14, color: '#333', marginBottom: 8 },
  photo: { width: '100%', height: 200, borderRadius: 8 },
  removeButton: { marginTop: 8, alignItems: 'center' },
  removeButtonText: { color: '#d32f2f', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  button: { flex: 1, borderRadius: 8, padding: 14, alignItems: 'center' },
  cameraButton: { backgroundColor: '#1565c0' },
  galleryButton: { backgroundColor: '#6a1b9a' },
  locationButton: { backgroundColor: '#00695c', marginBottom: 16 },
  confirmButton: { backgroundColor: '#2e7d32', marginTop: 24 },
  disabledButton: { backgroundColor: '#a5d6a7' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});