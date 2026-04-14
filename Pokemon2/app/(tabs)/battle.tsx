import { Text, View, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import Button from "../../components/Button";
import ImageViewer from "@/components/ImageViewer";

const moves = [
  { name: "Tackle", power: 10 },
  { name: "Play Rough", power: 15 },
  { name: "Shadow Sneak", power: 12 },
  { name: "Swords Dance", power: 0 }, // buff move
];

const PlaceholderImage = require('../../assets/images/pokemons/mimikyu.jpg');
const PlaceholderImage2 = require('../../assets/images/pokemons/dragonite.jpg');

export default function BattleScreen() {
  const [playerHP, setPlayerHP] = React.useState(100);
  const [enemyHP, setEnemyHP] = React.useState(100);

  const attack = (move: typeof moves[0]) => {
    let damage = move.power;
    if (move.name === "Swords Dance") {
      Alert.alert("Buff!", "Ataque aumentado!");
      return;
    }

    // Calcula dano aleatório entre 80% e 120%
    const finalDamage = Math.floor(damage * (0.8 + Math.random() * 0.4));
    const newEnemyHP = Math.max(0, enemyHP - finalDamage);
    setEnemyHP(newEnemyHP);

    // Checa se derrotou o inimigo
    if (newEnemyHP <= 0) {
      Alert.alert("Vitória!", `Você derrotou o inimigo usando ${move.name}!`);
      setEnemyHP(100); // reseta para jogar de novo
    }
  };

  return (
    <LinearGradient
      colors={["#FAE6C9", "#D1AD72", "#72514A"]}
      style={styles.container}
    >
      {/* <ImageViewer imgSource={PlaceholderImage} /> */}

      <Text style={[styles.title, { color: '#000' }]}>Batalha Pokémon!</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Seu Pokémon: {playerHP} HP</Text>
        <Text style={styles.statusText}>Inimigo: {enemyHP} HP</Text>
      </View>

      <Text style={styles.chooseText}>Escolha um ataque:</Text>

      <View style={styles.movesContainer}>
        {moves.map((move) => (
          <Button
            key={move.name}
            theme="primary"
            label={move.name}
            onPress={() => attack(move)}
          />
        ))}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column", // Garante fluxo vertical (um embaixo do outro)
    alignItems: "center",    // Centraliza os elementos no eixo horizontal
    justifyContent: "flex-start", // Faz os itens começarem do topo da tela
    padding: 20,
    paddingTop: 60, // Dá um respiro no topo da tela
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  statusContainer: {
    width: "100%",
    flexDirection: "column", // Força os textos de HP a ficarem um embaixo do outro
    alignItems: "center",    // Centraliza o texto de HP
    marginBottom: 30,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E78D6",
    marginBottom: 10,
  },
  chooseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  movesContainer: {
    width: "100%",
    flexDirection: "column", // Força os botões a renderizarem em coluna
    alignItems: "center",   // Estica os botões para ocuparem a largura da tela
    gap: 15, // Espaçamento consistente entre cada botão
  },
});