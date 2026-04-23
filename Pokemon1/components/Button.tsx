import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from "react-native";

// Definindo os temas disponíveis e suas cores
const THEMES = {
  primary: { bg: "#FE9C51", text: "black", width: 220, height: 58 },
  ghost:   { bg: "#5269AD", text: "#fff",  width: 100, height: 40 },
  fairy:   { bg: "#EC8FE6", text: "#fff",  width: 100, height: 40 },
  default: { bg: "#f5ff6b", text: "black", width: 220, height: 58 },
};

// Declarando os tipos de botões
type TipoDoTema = "primary" | "ghost" | "fairy";

type Propriedades = {
  label: string;
  theme?: TipoDoTema;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function Button({ label, theme, onPress, style: customStyle }: Propriedades) {
  // configura o tema escolhido ou usa o default
  const config = theme ? THEMES[theme] : THEMES.default;

  return (
    <View style={[
      styles.buttonContainer, 
      { width: config.width, height: config.height }, 
      customStyle
    ]}>
      <Pressable
        style={[styles.button, { backgroundColor: config.bg }]}
        onPress={onPress || (() => alert(`Pressed ${label}`))}
      >
        <Text style={[styles.buttonLabel, { color: config.text }]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    fontWeight: "bold",
    fontSize: 16
  }
});