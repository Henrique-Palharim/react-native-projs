/*
  VISÃO GERAL
  Esta página simula uma batalha entre dois pokémon (player e inimigo) com atributos dinâmicos:
  HP, Turnos, Ataques, Mensagens de batalha, Vitória/derrota
*/

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";

// ─── Dados ─────────────────────────────────────────────────
const PLAYER_NOME = "MIMIKYU";
const OPONENTE_NOME = "DRAGONITE";
const PLAYER_LEVEL = 36;
const OPONENTE_LEVEL = 41;
const VIDA_MAX = 100;

const moves = [
  { name: "Tackle", power: 10 },
  { name: "Play Rough", power: 15 },
  { name: "Shadow Sneak", power: 12 },
  { name: "Swords Dance", power: 0 },
];

// ─── Barra de HP ─────────────────────────────────────────────
function HPBarra({ current, max }: { current: number; max: number }) {
  const porcentagem = current / max;
  const cor = porcentagem > 0.5 ? "#58C840" : porcentagem > 0.25 ? "#F8D030" : "#F83030";

  return (
    <View style={styles.hpTrack}>
      <View
        style={[
          styles.hpFill,
          { width: `${porcentagem * 100}%`, backgroundColor: cor },
        ]}
      />
    </View>
  );
}

export default function TelaBatalha() {
  const [playerHP, setPlayerHP] = React.useState(VIDA_MAX);
  const [enemyHP, setEnemyHP] = React.useState(VIDA_MAX);
  const [dialogText, setDialogText] = React.useState(
    `O que ${PLAYER_NOME} fará?`
  );
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true);

  const resetarJogo = () => {
    setPlayerHP(VIDA_MAX);
    setEnemyHP(VIDA_MAX);
    setDialogText(`O que ${PLAYER_NOME} fará?`);
    setIsPlayerTurn(true);
  };

  const AtaqueInimigo = (currentHP: number) => {
    const dmg = Math.floor(10 * (0.8 + Math.random() * 0.4));
    const newHP = Math.max(0, currentHP - dmg);

    setTimeout(() => {
      setPlayerHP(newHP);

      if (newHP <= 0) {
        setDialogText(`${PLAYER_NOME} foi derrotado!`);
        setTimeout(() => {
          Alert.alert("Derrota!", "Seu Pokémon desmaiou!", [
            { text: "Tentar novamente", onPress: resetarJogo },
          ]);
        }, 600);
      } else {
        setDialogText(`O que ${PLAYER_NOME} fará?`);
        setIsPlayerTurn(true);
      }
    }, 600);
  };

  const ataque = (move: typeof moves[0]) => {
    if (!isPlayerTurn) return;

    // Buff
    if (move.name === "Swords Dance") {
      setDialogText(`${PLAYER_NOME} aumentou o ataque!`);
      setTimeout(() => {
        setDialogText(`O que ${PLAYER_NOME} fará?`);
      }, 1000);
      return;
    }

    setIsPlayerTurn(false);

    const dano = Math.floor(move.power * (0.8 + Math.random() * 0.4));
    const novoHpOponente = Math.max(0, enemyHP - dano);

    setDialogText(`${PLAYER_NOME} usou ${move.name}!`);

    setTimeout(() => {
      setEnemyHP(novoHpOponente);

      if (novoHpOponente <= 0) {
        setDialogText(`${OPONENTE_NOME} foi derrotado!`);
        setTimeout(() => {
          Alert.alert("Vitória!", `Você derrotou ${OPONENTE_NOME}!`, [
            { text: "Jogar novamente", onPress: resetarJogo },
          ]);
        }, 600);
        return;
      }

      // Turno do inimigo
      setDialogText(`${OPONENTE_NOME} atacando...`);
      setTimeout(() => {
        AtaqueInimigo(playerHP);
      }, 800);
    }, 600);
  };

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      {/* Oponente */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {OPONENTE_NOME} Lv{OPONENTE_LEVEL}
        </Text>
        <HPBarra current={enemyHP} max={VIDA_MAX} />
        <Text style={styles.hpText}>
          {enemyHP}/{VIDA_MAX}
        </Text>
      </View>

      {/* Player */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {PLAYER_NOME} Lv{PLAYER_LEVEL}
        </Text>
        <HPBarra current={playerHP} max={VIDA_MAX} />
        <Text style={styles.hpText}>
          {playerHP}/{VIDA_MAX}
        </Text>
      </View>

      {/* Mensagens */}
      <Text style={styles.dialog}>{dialogText}</Text>

      {/* Movimentos */}
      <View style={styles.moves}>
        {moves.map((move) => (
          <TouchableOpacity
            key={move.name}
            style={styles.button}
            onPress={() => ataque(move)}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.buttonText}>{move.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTÃO RESET */}
      <TouchableOpacity style={styles.resetButton} onPress={resetarJogo}>
        <Text style={styles.resetText}>Resetar batalha</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-around",
    backgroundColor: "#fff",
  },

  card: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  hpText: {
    marginTop: 4,
    textAlign: "right",
  },

  dialog: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },

  moves: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },

  button: {
    padding: 12,
    backgroundColor: "#2E78D6",
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  hpTrack: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },

  hpFill: {
    height: "100%",
  },
  resetButton: {
  marginTop: 10,
  padding: 12,
  backgroundColor: "#ffdddd",
  borderRadius: 6,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#cc0000",
},

resetText: {
  color: "#cc0000",
  fontWeight: "bold",
},
});