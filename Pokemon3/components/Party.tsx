import React from "react";
import { StyleSheet, Image, View, Pressable, useWindowDimensions } from "react-native";

export type PartySlot = { 
  id: string; 
  image: any | null;
  pokemon: any | null;
};

type Props = {
  team: PartySlot[];
  onSetTeam: (newTeam: PartySlot[]) => void;
  onSelect: (item: PartySlot, index: number) => void; 
  selectedIndex: number | null;
};

export default function Party({ team, onSelect, selectedIndex }: Props) {
  const { width } = useWindowDimensions();
  
  // Cálculo dinâmico para as bolinhas ocuparem bem o espaço
  // Pegamos a largura da tela, tiramos o padding e dividimos por 3
  const PADDING = 40;
  const GAP = 15;
  const SLOT_SIZE = (width - PADDING - (GAP * 2)) / 3;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {team.map((item, index) => {
          const isSelected = selectedIndex === index;

          return (
            <Pressable
              key={item.id}
              onPress={() => item.image && onSelect(item, index)} 
              style={[
                styles.slot,
                { width: SLOT_SIZE, height: SLOT_SIZE, borderRadius: SLOT_SIZE / 2 },
                isSelected && styles.selectedSlot,
              ]}
            >
              {item.image ? (
                <Image source={item.image} style={styles.image} />
              ) : (
                <View style={styles.empty} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap", // <--- O SEGREDO: Isso faz as bolinhas "caírem" para a linha de baixo
    justifyContent: "center",
    gap: 15,
  },
  slot: {
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: "85%",
    height: "85%",
    resizeMode: 'contain'
  },
  empty: {
    flex: 1,
  },
  selectedSlot: {
    borderColor: "#2E78D6",
    borderWidth: 4,
    backgroundColor: "rgba(46, 120, 214, 0.2)",
  },
});