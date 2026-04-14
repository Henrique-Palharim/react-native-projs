import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function NotFound() {
  return (
    <>
      <LinearGradient
      colors={["#FAE6C9", "#D1AD72", "#72514A"]}
        // colors={["#990000ff", "#441717"]}
        style={styles.container}>

        <Link href="/" style={styles.button}>
          Ir para tela Inicial
        </Link>
        
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 24,
  },
  button: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
});