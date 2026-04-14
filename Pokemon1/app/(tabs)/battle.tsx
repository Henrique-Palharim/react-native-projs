import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View, StyleSheet, Alert, TouchableOpacity } from "react-native";

// ─── Dados ─────────────────────────────────────────────────
const PLAYER_NAME = "MIMIKYU";
const ENEMY_NAME = "DRAGONITE";
const PLAYER_LEVEL = 36;
const ENEMY_LEVEL = 41;
const MAX_HP = 100;

const moves = [
  { name: "Tackle", power: 10 },
  { name: "Play Rough", power: 15 },
  { name: "Shadow Sneak", power: 12 },
  { name: "Swords Dance", power: 0 },
];

// ─── Barra de HP ─────────────────────────────────────────────
function HPBar({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct > 0.5 ? "#58C840" : pct > 0.25 ? "#F8D030" : "#F83030";

  return (
    <View style={styles.hpTrack}>
      <View
        style={[
          styles.hpFill,
          { width: `${pct * 100}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function BattleScreen() {
  const [playerHP, setPlayerHP] = React.useState(MAX_HP);
  const [enemyHP, setEnemyHP] = React.useState(MAX_HP);
  const [dialogText, setDialogText] = React.useState(
    `O que ${PLAYER_NAME} fará?`
  );
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(true);

  const resetGame = () => {
    setPlayerHP(MAX_HP);
    setEnemyHP(MAX_HP);
    setDialogText(`O que ${PLAYER_NAME} fará?`);
    setIsPlayerTurn(true);
  };

  const enemyAttack = (currentHP: number) => {
    const dmg = Math.floor(10 * (0.8 + Math.random() * 0.4));
    const newHP = Math.max(0, currentHP - dmg);

    setTimeout(() => {
      setPlayerHP(newHP);

      if (newHP <= 0) {
        setDialogText(`${PLAYER_NAME} foi derrotado!`);
        setTimeout(() => {
          Alert.alert("Derrota!", "Seu Pokémon desmaiou!", [
            { text: "Tentar novamente", onPress: resetGame },
          ]);
        }, 600);
      } else {
        setDialogText(`O que ${PLAYER_NAME} fará?`);
        setIsPlayerTurn(true);
      }
    }, 600);
  };

  const attack = (move: typeof moves[0]) => {
    if (!isPlayerTurn) return;

    // Buff
    if (move.name === "Swords Dance") {
      setDialogText(`${PLAYER_NAME} aumentou o ataque!`);
      setTimeout(() => {
        setDialogText(`O que ${PLAYER_NAME} fará?`);
      }, 1000);
      return;
    }

    setIsPlayerTurn(false);

    const dmg = Math.floor(move.power * (0.8 + Math.random() * 0.4));
    const newEnemyHP = Math.max(0, enemyHP - dmg);

    setDialogText(`${PLAYER_NAME} usou ${move.name}!`);

    setTimeout(() => {
      setEnemyHP(newEnemyHP);

      if (newEnemyHP <= 0) {
        setDialogText(`${ENEMY_NAME} foi derrotado!`);
        setTimeout(() => {
          Alert.alert("Vitória!", `Você derrotou ${ENEMY_NAME}!`, [
            { text: "Jogar novamente", onPress: resetGame },
          ]);
        }, 600);
        return;
      }

      // Enemy turn
      setDialogText(`${ENEMY_NAME} atacando...`);
      setTimeout(() => {
        enemyAttack(playerHP);
      }, 800);
    }, 600);
  };

  return (
    <LinearGradient colors={["#FAE6C9", "#ebcea2", "#D1AD72"]} style={styles.container}>
      {/* Enemy */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {ENEMY_NAME} Lv{ENEMY_LEVEL}
        </Text>
        <HPBar current={enemyHP} max={MAX_HP} />
        <Text style={styles.hpText}>
          {enemyHP}/{MAX_HP}
        </Text>
      </View>

      {/* Player */}
      <View style={styles.card}>
        <Text style={styles.name}>
          {PLAYER_NAME} Lv{PLAYER_LEVEL}
        </Text>
        <HPBar current={playerHP} max={MAX_HP} />
        <Text style={styles.hpText}>
          {playerHP}/{MAX_HP}
        </Text>
      </View>

      {/* Dialog */}
      <Text style={styles.dialog}>{dialogText}</Text>

      {/* Moves */}
      <View style={styles.moves}>
        {moves.map((move) => (
          <TouchableOpacity
            key={move.name}
            style={styles.button}
            onPress={() => attack(move)}
            disabled={!isPlayerTurn}
          >
            <Text style={styles.buttonText}>{move.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* BOTÃO RESET */}
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
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