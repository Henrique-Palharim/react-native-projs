import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CallListScreen({ navigation }: any) {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // recarrega a lista do Firestore sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      async function fetchCalls() {
        try {
          setLoading(true);
          const q = query(
            collection(db, 'chamados'),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const list: any[] = [];

          querySnapshot.forEach((docSnapshot) => {
            list.push({ id: docSnapshot.id, ...docSnapshot.data() });
          });

          setCalls(list);
        } catch (error) {
          console.error('Erro ao buscar lista:', error);
          Alert.alert('Erro', 'Não foi possível carregar a lista de chamados.');
        } finally {
          setLoading(false);
        }
      }

      fetchCalls();
    }, [])
  );

  // função para excluir o chamado do Firestore
  async function handleDeleteCall(id: string) {
    Alert.alert(
      'Excluir Chamado',
      'Tem certeza que deseja remover este chamado permanentemente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'chamados', id));
              
              // atualiza o estado local
              setCalls((prevCalls) => prevCalls.filter((call) => call.id !== id));
              
              Alert.alert('Sucesso', 'Chamado excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir:', error);
              Alert.alert('Erro', 'Não foi possível excluir o chamado.');
            }
          },
        },
      ]
    );
  }

  // define o rótulo e a cor de cada status
  function getStatusInfo(status: string) {
    switch (status) {
      case 'atendendo':
        return { label: 'Em Atendimento', color: '#e65100' };
      case 'concluido':
        return { label: 'Concluído', color: '#1565c0' };
      case 'cancelado':
        return { label: 'Cancelado', color: '#c62828' };
      default:
        return { label: 'Pendente', color: '#00695c' };
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1565c0" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={calls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const statusInfo = getStatusInfo(item.status);

          return (
            <View style={styles.card}>
              {/* clique no conteúdo para ver detalhes */}
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() =>
                  navigation.navigate('CallDetail', { chamadoId: item.id })
                }
              >
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.description}
                </Text>
                <Text style={styles.cardStatus}>
                  Status:{' '}
                  <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* botão de excluir */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCall(item.id)}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum chamado cadastrado.</Text>
        }
      />

      {/* botão flutuante para criar novo chamado */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewCall')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardStatus: { fontSize: 14, color: '#666', marginTop: 4 },
  statusText: { fontWeight: 'bold' },
  deleteButton: { padding: 8, marginLeft: 8 },
  deleteButtonText: { color: '#c62828', fontSize: 18, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#1565c0',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});