import { View, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

// Componentes customizados
import { usePokemon } from "@/hooks/usePokemon";
import SearchBar from "@/components/SearchBar";
import PokemonInfo from "@/components/PokemonInfo";
import ImageViewer from "@/components/ImageViewer";
import Party from "@/components/Party";
import MovePickerModal from "@/components/MovePickerModal";
import Button from "@/components/Button";

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // --- 1. AQUI: Adicionamos o 'setSelectedPokemon' na extração do Hook ---
  const { 
    loading, 
    searchQuery, 
    suggestions, 
    selectedPokemon, 
    handleSearch, 
    onTypeSearch, 
    openMovePicker,    
    isModalVisible, 
    setIsModalVisible, 
    allPossibleMoves, 
    selectMove,
    setSelectedPokemon // <--- ESSA LINHA É NOVA
  } = usePokemon();

  // --- 2. AQUI: Inicializamos a party com o campo 'pokemon' nulo ---
  const [party, setParty] = useState(
    Array(6).fill(null).map((_, i) => ({ 
      id: `${i + 1}`, 
      image: null, 
      pokemon: null // <--- IMPORTANTE: inicializar como null
    }))
  );
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // --- 3. AQUI: A função que salva o "pacote completo" do Pokémon ---
  function addToParty(fullPokemon: any) {
    if (!fullPokemon.image || fullPokemon.name === "Pesquise um Pokémon") return;
    
    setParty((prev) => {
      const next = [...prev];
      const emptyIndex = next.findIndex((slot) => slot.pokemon === null);
      const indexToUpdate = emptyIndex !== -1 ? emptyIndex : 0;
      
      next[indexToUpdate] = { 
        ...next[indexToUpdate], 
        image: fullPokemon.image,
        pokemon: { ...fullPokemon } // <--- SALVA A MEMÓRIA AQUI
      };
      return next;
    });
  }

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        <SearchBar 
          searchQuery={searchQuery}
          onTypeSearch={onTypeSearch}
          handleSearch={handleSearch}
          suggestions={suggestions}
          loading={loading}
        />

        <View style={[styles.layoutWrapper, { flexDirection: isMobile ? "column" : "row", gap: isMobile ? 40 : 60 }]}>
          
          <View style={styles.imageSection}>
            {selectedPokemon.image ? (
               <ImageViewer imgSource={selectedPokemon.image} style={styles.image} />
            ) : (
               <View style={[styles.image, styles.placeholderImage]}>
                 <Ionicons name="help-circle-outline" size={100} color="#fff" />
               </View>
            )}
          </View>

          {/* Passamos o pokemon atual para o componente de info */}
          <PokemonInfo pokemon={selectedPokemon} onMoveChange={openMovePicker}>
            <Button label="Add to Party" onPress={() => addToParty(selectedPokemon)} />
          </PokemonInfo>

        </View>

        <View style={styles.partyWrapper}>
          <Party
            team={party}
            onSetTeam={setParty}
            selectedIndex={selectedIndex}
            // --- 4. AQUI: Quando clicar na party, devolve os dados para a tela principal ---
            onSelect={(item, index) => {
              setSelectedIndex(index);
              if (item.pokemon) {
                setSelectedPokemon(item.pokemon); // <--- RESTAURA A MEMÓRIA
              }
            }}
          />
        </View>
      </ScrollView>

      <MovePickerModal 
        visible={isModalVisible}
        moves={allPossibleMoves}
        onClose={() => setIsModalVisible(false)}
        onSelect={selectMove}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  layoutWrapper: { alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 1100 },
  imageSection: { alignItems: "center" },
  image: { width: 280, height: 280, borderRadius: 15 },
  placeholderImage: { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  partyWrapper: { marginTop: 40, alignItems: "center", width: "100%" },
});