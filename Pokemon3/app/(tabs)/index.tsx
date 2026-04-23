import { Text, View, StyleSheet, useWindowDimensions, ScrollView, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import Type from "@/components/Type"; 
import ImageViewer from "@/components/ImageViewer";
import Party from "@/components/Party"; 
import Button from "@/components/Button";

const PlaceholderImage = require("../../assets/images/pokemons/mimikyu.jpg");

// ─── Dados ─────────────────────────────────────────────────
const POKEMON_DADOS = {
  name: "Mimikyu",
  types: ["Ghost", "Fairy"],
  tier: "RU",
  moves: ["Shadow Claw", "Play Rough", "Shadow Sneak", "Swords Dance"]
};

interface InfoLinhasPropriedades {
  label: string;
  value: string;
  isMove?: boolean;
}

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Subcomponente interno para as linhas de informação
  const LinhasPropriedades = ({ label, value, isMove = false }: InfoLinhasPropriedades) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.text, styles.textBlue, isMove && { marginBottom: 2 }]}>
        {value}
      </Text>
    </View>
  );

  // ─── Party & States ─────────────────────────────────────────────────
  const [party, setParty] = useState([
    { id: '1', image: null },
    { id: '2', image: null },
    { id: '3', image: null },
    { id: '4', image: null },
    { id: '5', image: null },
    { id: '6', image: null },
  ]);

  // NOVO: Estado para rastrear qual Pokémon da party está selecionado
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [selectedPokemon, setSelectedPokemon] = useState({
    name: "Mimikyu",
    types: ["Ghost", "Fairy"],
    tier: "RU",
    moves: ["Shadow Claw", "Play Rough", "Shadow Sneak", "Swords Dance"],
    image: PlaceholderImage,
  });

  function addToParty(pokemonImage: any) {
    setParty((prev) => {
      const next = [...prev];
      const emptyIndex = next.findIndex((slot) => slot.image === null);
      
      if (emptyIndex !== -1) {
        next[emptyIndex] = { ...next[emptyIndex], image: pokemonImage };
      } else {
        next[0] = { ...next[0], image: pokemonImage };
      }
      return next;
    });
  }

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SEARCH BAR */}
        <View style={[styles.searchWrapper, { width: isMobile ? "100%" : "100%" }]}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />

          <TextInput
            placeholder="Search Pokémon..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>

        {/* o 'gap' é para que o espaço entre os itens não os desloque do centro */}
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
              imgSource={selectedPokemon.image} // CORREÇÃO: Mostrar a imagem do pokémon selecionado
              style={styles.image}
            />
          </View>

          {/* Coluna de Conteúdo */}
          <View style={styles.contentSection}>
            <Text style={styles.title}>{selectedPokemon.name}</Text>

            <View style={styles.typeRow}>
              <Text style={styles.infoLabel}>Type: </Text>
              {selectedPokemon.types.map((type, index) => (
                <Type 
                  key={type} 
                  theme={type.toLowerCase() as "ghost" | "fairy"}
                  label={type} 
                  style={index === 0 ? { marginRight: -5 } : {}}
                />
              ))}
            </View>
              
            {selectedPokemon.moves.map((move, index) => (
              <LinhasPropriedades key={move} label={`Move${index + 1}`} value={move} isMove />
            ))}

            <Button
              label="Add to Party"
              onPress={() => addToParty(selectedPokemon.image)}
            />
          </View>     

        </View>

        <View style={styles.partyWrapper}>
          <Party
            team={party}
            onSetTeam={setParty} // Agora o Party pode atualizar a ordem do estado
            selectedIndex={selectedIndex}
            onSelect={(pokemon, index) => {
              setSelectedIndex(index);
              setSelectedPokemon(prev => ({ ...prev, image: pokemon }));
            }}
          />
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  searchWrapper: { maxWidth: 680, width: "100%", marginBottom: 20, position: "relative", justifyContent: "center" },
  searchIcon: { position: "absolute", left: 12, zIndex: 1 },
  searchInput: { backgroundColor: "#fff", paddingLeft: 40, paddingVertical: 8, paddingRight: 16, borderRadius: 2, fontSize: 18, width: "100%", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  layoutWrapper: { alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 1100 },
  imageSection: { alignItems: "center", justifyContent: "center" },
  image: { width: 250, height: 350, borderRadius: 15 },
  contentSection: { alignItems: "flex-start", minWidth: 300 },
  title: { fontWeight: "bold", fontSize: 42, color: "#ffffff", marginBottom: 20 },
  text: { fontWeight: "bold", fontSize: 24, color: "#ffffff" },
  textBlue: { color: "#2E78D6" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoLabel: { fontWeight: "bold", fontSize: 24, color: "#ffffff", marginRight: 10 },
  typeRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  partyWrapper: { marginTop: 20, alignItems: "center", width: "100%" },
});