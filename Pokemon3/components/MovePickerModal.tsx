import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

type MovePickerProps = {
  visible: boolean;
  moves: any[];
  onClose: () => void;
  onSelect: (moveName: string) => void;
};

export default function MovePickerModal({ visible, moves, onClose, onSelect }: MovePickerProps) {
  const [filter, setFilter] = useState("");

  const filteredMoves = moves
  .filter(m => m.move.name.toLowerCase().includes(filter.toLowerCase()))
  .sort((a, b) => a.move.name.localeCompare(b.move.name));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a Move</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <TextInput 
            style={styles.searchInput}
            placeholder="Filter moves..."
            value={filter}
            onChangeText={setFilter}
          />

          <FlatList
            data={filteredMoves}
            keyExtractor={(item) => item.move.name}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.moveItem} 
                onPress={() => {
                  onSelect(item.move.name);
                  setFilter("");
                  onClose();
                }}
              >
                <Text style={styles.moveText}>{item.move.name.replace('-', ' ')}</Text>
                <Ionicons name="add-circle-outline" size={20} color="#2E78D6" />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', height: '70%', backgroundColor: '#fff', borderRadius: 15, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  searchInput: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginBottom: 10 },
  moveItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between' },
  moveText: { fontSize: 18, textTransform: 'capitalize' }
});