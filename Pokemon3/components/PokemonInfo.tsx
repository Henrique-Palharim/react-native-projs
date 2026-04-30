import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Type from "@/components/Type";
import { PokemonData } from "@/hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";

type PokemonInfoProps = {
  pokemon: PokemonData;
  onMoveChange: (index: number) => void;
  children?: React.ReactNode;
};

export default function PokemonInfo({ pokemon, onMoveChange, children }: PokemonInfoProps) {
  return (
    <View style={styles.contentSection}>
      <Text style={styles.title}>{pokemon.name}</Text>
      
      <View style={styles.typeRow}>
        <Text style={styles.infoLabel}>Type: </Text>
        {pokemon.types.map((type) => (
          <Type key={type} theme={type as any} label={type} />
        ))}
      </View>
      
      <Text style={[styles.infoLabel, { fontSize: 20, marginBottom: 15 }]}>Moves:</Text>
      
      {pokemon.moves.map((moveObj, index) => {
        const isEmpty = moveObj.name === "Select move..." || moveObj.name === "-";

        return (
            <View key={index} style={styles.moveContainer}>
            <Text style={styles.slotLabel}>Move {index + 1}:</Text>
            
            <TouchableOpacity 
                style={[styles.infoRow, isEmpty && { opacity: 0.9 }]} // Fica mais clarinho se estiver vazio
                onPress={() => onMoveChange(index)}
            >
                <Text style={[styles.text, isEmpty ? { color: '#a3a3a3ff' } : styles.textBlue]}>
                {moveObj.name.replace(/-/g, ' ')}
                </Text>
                
                {/* Só exibe o Type se ele existir no objeto */}
                {!isEmpty && moveObj.type && (
                <Type 
                    theme={moveObj.type as any} 
                    label={moveObj.type} 
                    style={styles.typeScale} 
                />
                )}

                {/* Se estiver vazio, podemos colocar um ícone de "+" bem discreto */}
                {isEmpty && <Ionicons name="add" size={20} color="#bbb" />}
            </TouchableOpacity>
            </View>
        );
        })}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contentSection: { alignItems: "flex-start", minWidth: 300 },
  title: { fontWeight: "bold", fontSize: 42, color: "#ffffff", marginBottom: 10 },
  text: { fontWeight: "bold", fontSize: 20, color: "#ffffff", textTransform: 'capitalize' },
  textBlue: { color: "#2E78D6" },
  
  // Container para agrupar o Label e o Bloco
  moveContainer: { 
    width: '100%', 
    marginBottom: 15 
  },
  
  // Estilo do Slot X (agora fora)
  slotLabel: { 
    fontWeight: "bold", 
    fontSize: 18, 
    color: "#ffffff", 
    marginBottom: 5,
    opacity: 0.8 // Um pouco mais discreto
  },
  
  // O Bloco clicável
  infoRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", // Nome na esquerda, Tipo na direita
    backgroundColor: 'rgba(255,255,255,0.15)', 
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8, 
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },

  infoLabel: { fontWeight: "bold", fontSize: 20, color: "#ffffff", marginRight: 10 },
  typeRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  
  // Ajuste para a tag de tipo não ficar gigante no slot
  typeScale: { 
    transform: [{ scale: 0.85 }],
    marginHorizontal: 0 
  }
});