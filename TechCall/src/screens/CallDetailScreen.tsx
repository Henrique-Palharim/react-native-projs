import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications'; // importação das Notificações
import { db } from '../firebase/config';

interface CallDetails {
  id: string;
  description: string;
  photoUri?: string;
  address?: string;
  status: 'pendente' | 'atendendo' | 'concluido' | 'cancelado';
  slaNotificationId?: string; // ID da notificação agendada
}

export default function CallDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { chamadoId } = route.params as { chamadoId: string };

  const [call, setCall] = useState<CallDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // busca o documento único no Firestore pelo chamadoId
  async function fetchCallDetails() {
    try {
      setLoading(true);
      if (!chamadoId) {
        Alert.alert('Erro', 'ID do chamado não fornecido.');
        navigation.goBack();
        return;
      }

      const docRef = doc(db, 'chamados', chamadoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCall({ id: docSnap.id, ...docSnap.data() } as CallDetails);
      } else {
        Alert.alert('Erro', 'Chamado não encontrado.');
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível carregar o chamado.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCallDetails();
  }, [chamadoId]);

  // atualiza o status e cancela o alerta de SLA se for atendido ou cancelado a tempo
  async function handleUpdateStatus(newStatus: 'atendendo' | 'concluido' | 'cancelado') {
    try {
      setUpdating(true);
      const docRef = doc(db, 'chamados', chamadoId);

      // 1. atualiza o status no banco de dados
      await updateDoc(docRef, { status: newStatus });

      // 2. se o chamado foi atendido ou cancelado a tempo, cancela a notificação agendada
      if (
        (newStatus === 'atendendo' || newStatus === 'cancelado') &&
        call?.slaNotificationId
      ) {
        await Notifications.cancelScheduledNotificationAsync(call.slaNotificationId);
      }

      // 3. atualiza o estado local para refletir na tela imediatamente
      setCall((prev) => (prev ? { ...prev, status: newStatus } : null));

      Alert.alert('Sucesso', `Status alterado para: ${newStatus}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o status do chamado.');
    } finally {
      setUpdating(false);
    }
  }

  // estilização dinâmica para o status
  function getStatusStyle(status: string) {
    switch (status) {
      case 'atendendo':
        return { bg: '#fff3e0', text: '#e65100', label: 'Em Atendimento' };
      case 'concluido':
        return { bg: '#e3f2fd', text: '#1565c0', label: 'Concluído' };
      case 'cancelado':
        return { bg: '#ffebee', text: '#c62828', label: 'Cancelado' };
      default:
        return { bg: '#e0f2f1', text: '#00695c', label: 'Pendente' };
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1565c0" />
        <Text style={styles.loadingText}>Carregando chamado...</Text>
      </View>
    );
  }

  if (!call) return null;

  const statusInfo = getStatusStyle(call.status);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Cabeçalho de Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status do Chamado</Text>
        <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.badgeText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      {/* Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <View style={styles.card}>
        <Text style={styles.descriptionText}>{call.description}</Text>
      </View>

      {/* Foto (Se houver) */}
      <Text style={styles.label}>Foto do Equipamento</Text>
      {call.photoUri ? (
        <Image source={{ uri: call.photoUri }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Nenhuma foto anexada</Text>
        </View>
      )}

      {/* Localização (Se houver) */}
      <Text style={styles.label}>Localização</Text>
      <View style={styles.card}>
        <Text style={styles.addressText}>
          {call.address || 'Nenhuma localização registrada.'}
        </Text>
      </View>

      {/* Botões de Ação */}
      <Text style={styles.label}>Ações</Text>
      {updating ? (
        <ActivityIndicator size="small" color="#1565c0" style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.attendButton,
              (call.status === 'atendendo' || call.status === 'concluido' || call.status === 'cancelado') &&
                styles.disabledButton,
            ]}
            disabled={
              call.status === 'atendendo' ||
              call.status === 'concluido' ||
              call.status === 'cancelado'
            }
            onPress={() => handleUpdateStatus('atendendo')}
          >
            <Text style={styles.buttonText}>Iniciar Atendimento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.completeButton,
              (call.status === 'concluido' || call.status === 'cancelado') &&
                styles.disabledButton,
            ]}
            disabled={call.status === 'concluido' || call.status === 'cancelado'}
            onPress={() => handleUpdateStatus('concluido')}
          >
            <Text style={styles.buttonText}>Concluir Atendimento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              (call.status === 'cancelado' || call.status === 'concluido') &&
                styles.disabledButton,
            ]}
            disabled={call.status === 'cancelado' || call.status === 'concluido'}
            onPress={() => handleUpdateStatus('cancelado')}
          >
            <Text style={styles.buttonText}>Cancelar Chamado</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 12, color: '#666', fontSize: 16 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#ccc' },
  descriptionText: { fontSize: 15, color: '#333', lineHeight: 22 },
  addressText: { fontSize: 14, color: '#555' },
  photo: { width: '100%', height: 200, borderRadius: 8 },
  placeholder: { height: 120, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', borderStyle: 'dashed', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: '#999' },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  badgeText: { fontWeight: 'bold', fontSize: 13 },
  actionsContainer: { gap: 10, marginTop: 4 },
  button: { borderRadius: 8, padding: 14, alignItems: 'center' },
  attendButton: { backgroundColor: '#e65100' },
  completeButton: { backgroundColor: '#1565c0' },
  cancelButton: { backgroundColor: '#c62828' },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});