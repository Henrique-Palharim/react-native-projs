import React from "react";
import { StyleSheet, Image, View, Pressable } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type PartySlot = { id: string; image: any | null };

const SIZE = 100;

type Props = {
  team: PartySlot[];
  onSetTeam: (newTeam: PartySlot[]) => void;
  onSelect: (pokemon: any, index: number) => void;
  selectedIndex: number | null;
};

export default function Party({ team, onSetTeam, onSelect, selectedIndex }: Props) {
  
  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<PartySlot>) => {
    const index = getIndex();
    const isSelected = selectedIndex === index;

    return (
      <ScaleDecorator>
        <Pressable
          // onLongPress agora inicia o drag instantaneamente
          onLongPress={drag} 
          delayLongPress={100} // Torna o reconhecimento do "segurar" muito mais rápido (padrão é 500ms)
          onPress={() => item.image && onSelect(item.image, index!)}
          style={[
            styles.slot,
            isSelected && styles.selectedSlot,
            isActive && styles.activeSlot,
          ]}
        >
          {item.image ? (
            <Image source={item.image} style={styles.image} />
          ) : (
            <View style={styles.empty} />
          )}
        </Pressable>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DraggableFlatList
        data={team}
        onDragEnd={({ data }) => onSetTeam(data)}
        keyExtractor={(item) => item.id} // ID fixo é essencial para a troca funcionar
        renderItem={renderItem}
        horizontal
        activationDistance={5} // Distância mínima de movimento para começar a arrastar
        contentContainerStyle={styles.row}
        // Isso impede que o ScrollView da página "mate" o movimento lateral
        simultaneousHandlers={[]} 
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    gap: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  slot: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  empty: {
    flex: 1,
  },
  selectedSlot: {
    borderColor: "#2E78D6",
    borderWidth: 4,
  },
  activeSlot: {
    opacity: 0.7,
    borderColor: "#FFD700",
  },
});