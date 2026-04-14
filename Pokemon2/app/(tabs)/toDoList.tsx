import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';

import { useTarefas } from '../../hooks/useTarefas';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

// habilita animação no Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function App() {

  const {
    tarefas,
    novaTarefa,
    setNovaTarefa,
    adicionarTarefa,
    removerTarefa,
    alternarTarefa
  } = useTarefas();

  const handleRemove = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    removerTarefa(id);
};

  return (
    <LinearGradient
      style={styles.container}
      colors={["#FAE6C9", "#e0c59cff", "#D1AD72", "#72514A"]}
    >

      <Text style={styles.titulo}>Lista de Tarefas</Text>

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa..."
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={adicionarTarefa}
        >
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.tarefaContainer}>

            {/* CHECKBOX */}
            <TouchableOpacity onPress={() => alternarTarefa(item.id)}>
              <Ionicons
                name={item.concluida ? "checkbox" : "square-outline"}
                size={24}
                color="#2E78D6"
              />
            </TouchableOpacity>

            {/* TEXTO */}
            <Text
              style={[
                styles.tarefaTexto,
                item.concluida && styles.tarefaConcluida
              ]}
            >
              {item.texto}
            </Text>

            {/* DELETE */}
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Ionicons
                name="trash-outline"
                size={22}
                color="#ff4d4d"
              />
            </TouchableOpacity>

          </View>
        )}
      />

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },

  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },

  button: {
    backgroundColor: '#B75426',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  tarefaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  tarefaTexto: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },

  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: '#888',
  }

});