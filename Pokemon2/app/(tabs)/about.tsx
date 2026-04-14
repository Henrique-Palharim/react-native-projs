import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutScreen() {
  return (
    <LinearGradient // funciona como View
      colors={["#FAE6C9", "#e0c59cff","#D1AD72", "#72514A"]}
      style={styles.container}>

     <Text style={[styles.text, { marginBottom: 20, color: '#000' }]}>
      Pokémon
     </Text>

      <Text style={styles.text}>
        "Pokémon é uma franquia de mídia criada por Satoshi Tajiri em 1996, que se expandiu para videogames, anime, filmes, mangás e jogos de cartas colecionáveis. O mundo de Pokémon é habitado por criaturas conhecidas como Pokémon, que os treinadores capturam, treinam e usam para batalhas amistosas ou competitivas. Cada Pokémon possui habilidades únicas, tipos e evoluções, incentivando estratégias e colecionismo.

        A franquia combina aventura, amizade e aprendizado sobre trabalho em equipe, tornando-se uma das mais amadas do mundo, encantando gerações de fãs com suas histórias, criaturas e desafios."
      </Text>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#e98888ff",
  },
  text: {
    maxWidth: 850,
    textAlign: 'justify',
    color: "#f0f0f0ff",
    fontWeight: "bold",
    fontSize: 24,
  },
  button: {
    color: "#000000ff",
    fontWeight: "bold",
    backgroundColor: "#FFADAD",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
});