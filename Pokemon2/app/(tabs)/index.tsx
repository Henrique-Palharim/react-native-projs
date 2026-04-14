import { Text, View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';

import Button from "../../components/Button";
import ImageViewer from "@/components/ImageViewer";

const PlaceholderImage = require('../../assets/images/pokemons/mimikyu.jpg');

// Centralizamos os dados para fácil edição
const POKEMON_DATA = {
  name: "Mimikyu",
  types: ["Ghost", "Fairy"],
  tier: "RU",
  moves: ["Shadow Claw", "Play Rough", "Shadow Sneak", "Swords Dance"]
};

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      console.log(result);
    } else {
      alert('Você não selecionou nenhuma imagem.');
    }
  };

  // Definimos uma "interface" para as propriedades do componente
  interface InfoRowProps {
    label: string;
    value: string;
    isMove?: boolean; // O '?' indica que é opcional
  }

  // Subcomponente para evitar repetição de View + Text + Text
  const InfoRow = ({ label, value, isMove = false }: InfoRowProps) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.text, styles.textBlue, isMove && { marginBottom: 5 }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#FAE6C9", "#D1AD72", "#72514A"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.layoutWrapper, { flexDirection: isMobile ? 'column' : 'row' }]}>
          
          {/* Coluna da Imagem */}
          <View style={[styles.imageSection, { marginBottom: isMobile ? 40 : 0 }]}>
            <ImageViewer 
              imgSource={PlaceholderImage} 
              style={styles.image}
            />
            <View style={styles.footerContainer}>
              <Button theme="primary" label="Choose a picture" onPress={pickImageAsync} />
              <Button label="Use this picture" />
            </View>
          </View>

          {/* Coluna de Conteúdo */}
          <View style={styles.contentSection}>
            <Text style={styles.title}>{POKEMON_DATA.name}</Text>

            <View style={styles.typeRow}>
              <Text style={styles.infoLabel}>Type: </Text>
              {POKEMON_DATA.types.map((type, index) => (
                <Button 
                  key={type} 
                  theme={type.toLowerCase() as "ghost" | "fairy" | "primary"}
                  label={type} 
                  style={index === 0 ? { marginRight: -5 } : {}}
                />
              ))}
            </View>

            <InfoRow label="Tier" value={POKEMON_DATA.tier} />

            {POKEMON_DATA.moves.map((move, index) => (
              <InfoRow key={move} label={`Move${index + 1}`} value={move} isMove />
            ))}
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  layoutWrapper: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 1000,
  },
  imageSection: {
    alignItems: "center",
    marginRight: 50,
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 10,
    marginBottom: 10
  },
  contentSection: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#ffffff",
    marginBottom: 15,
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ffffff",
  },
  textBlue: {
    color: "#2E78D6",
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ffffff",
    marginRight: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  footerContainer: {
    marginTop: 10,
    gap: 10, // Se o seu componente Button aceitar gap no pai
  }
});