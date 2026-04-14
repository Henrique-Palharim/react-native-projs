import { Text, View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Button from "../../components/Button";
import ImageViewer from "@/components/ImageViewer";

const PlaceholderImage = require("../../assets/images/pokemons/mimikyu.jpg");

// ─── Dados ─────────────────────────────────────────────────
const POKEMON_DATA = {
  name: "Mimikyu",
  types: ["Ghost", "Fairy"],
  tier: "RU",
  moves: ["Shadow Claw", "Play Rough", "Shadow Sneak", "Swords Dance"]
};

interface InfoRowProps {
  label: string;
  value: string;
  isMove?: boolean;
}

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Subcomponente interno para as linhas de informação
  const InfoRow = ({ label, value, isMove = false }: InfoRowProps) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.text, styles.textBlue, isMove && { marginBottom: 2 }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* O 'gap' é para que o espaço entre os itens não os desloque do centro */}
        <View style={[
          styles.layoutWrapper, 
          { 
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 40 : 60 
          }
          ]}>
          
          {/* Coluna da Imagem */}
          <View style={styles.imageSection}>
            <ImageViewer 
              imgSource={PlaceholderImage} 
              style={styles.image}
            />
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

            {/* Renderização dinâmica dos moves */}
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 1100,
  },
  imageSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 250, // Aumentei um pouco para aproveitar o espaço do PC
    height: 350,
    borderRadius: 15,
  },
  contentSection: {
    alignItems: "flex-start",
    minWidth: 300,
  },
  title: {
    fontWeight: "bold",
    fontSize: 42,
    color: "#ffffff",
    marginBottom: 20,
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ffffff",
    marginRight: 10,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});