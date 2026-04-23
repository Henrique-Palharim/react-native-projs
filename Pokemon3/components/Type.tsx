import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from "react-native";

// Definindo os temas disponíveis e suas cores
const THEMES = {
  bug:      { bg: "#747F1E", text: "#fff",  width: 100, height: 40 },
  dark:     { bg: "#4F4036", text: "#fff",  width: 100, height: 40 },
  dragon:   { bg: "#5127B6", text: "#fff",  width: 100, height: 40 },
  electric: { bg: "#B79925", text: "#fff",  width: 100, height: 40 },
  fairy:    { bg: "#B64CBC", text: "#fff",  width: 100, height: 40 },
  fight:    { bg: "#892924", text: "#fff",  width: 100, height: 40 },
  fire:     { bg: "#AB5A1F", text: "#fff", width: 100, height: 40 },
  flying:   { bg: "#796AA6", text: "#fff",  width: 100, height: 40 },
  grass:    { bg: "#578F3C", text: "#fff",  width: 100, height: 40 },
  ghost:    { bg: "#51426B", text: "#fff",  width: 100, height: 40 },
  ground:   { bg: "#A68E4C", text: "#fff",  width: 100, height: 40 },
  ice:      { bg: "#679D9D", text: "#000",  width: 100, height: 40 },
  normal:   { bg: "#7D7D5B", text: "#fff",  width: 100, height: 40 },
  rock:     { bg: "#7E6E2C", text: "#fff",  width: 100, height: 40 },
  poison:   { bg: "#713371", text: "#fff",  width: 100, height: 40 },
  psychic:  { bg: "#B84064", text: "#fff",  width: 100, height: 40 },
  steel:    { bg: "#7F7F93", text: "#000",  width: 100, height: 40 },
  water:    { bg: "#4A68B2", text: "#fff",  width: 100, height: 40 }
};

// Declarando os tipos de botões
type TipoDoTema = "bug" | "dark" | "dragon" | "electric" | "fairy" | "fight" | 
                  "fire" | "flying" | "grass" | "ghost" | "ground" | "ice" | 
                  "normal" | "rock" | "poison" | "psychic" | "steel" | "water";

type Propriedades = {
  label: string;
  theme: TipoDoTema;
  style?: StyleProp<ViewStyle>;
}

export default function Type({ label, theme, style: customStyle }: Propriedades) {
  // configura o tema escolhido
  const config = THEMES[theme];

  return (
    <View
      style={[
        styles.typeContainer,
        { width: config.width, height: config.height },
        customStyle
      ]}
    >
      <View style={[styles.type, { backgroundColor: config.bg }]}>
        <Text style={[styles.typeLabel, { color: config.text }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  typeContainer: {
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  type: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  typeLabel: {
    fontWeight: "bold",
    fontSize: 16
  }
});