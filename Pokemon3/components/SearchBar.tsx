import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  searchQuery: string;
  onTypeSearch: (text: string) => void;
  handleSearch: (name?: string) => void;
  suggestions: string[];
  loading: boolean;
};

export default function SearchBar({ searchQuery, onTypeSearch, handleSearch, suggestions, loading }: SearchBarProps) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Ex: Charizard, Pikachu..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={onTypeSearch}
          onSubmitEditing={() => handleSearch()}
        />
        {loading && <ActivityIndicator style={styles.loader} color="#D1AD72" />}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          {suggestions.map((item) => (
            <TouchableOpacity key={item} style={styles.suggestionItem} onPress={() => handleSearch(item)}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchWrapper: { maxWidth: 320, width: "100%", marginBottom: 40, zIndex: 100 },
  inputContainer: { position: "relative", justifyContent: "center" },
  searchIcon: { position: "absolute", left: 12, zIndex: 1 },
  searchInput: { backgroundColor: "#fff", paddingLeft: 40, paddingVertical: 12, borderRadius: 8, fontSize: 18, width: "100%", elevation: 3 },
  loader: { position: 'absolute', right: 15 },
  suggestionsBox: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  suggestionItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  suggestionText: { fontSize: 16, textTransform: 'capitalize' },
});