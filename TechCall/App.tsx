import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import NewCallScreen from './src/screens/NewCallScreen';
import CallListScreen from './src/screens/CallListScreen';
import CallDetailScreen from './src/screens/CallDetailScreen';

const Stack = createNativeStackNavigator();

// permite navegar através da notificação
export const navigationRef = createNavigationContainerRef<any>();

// configura como a notificação se comporta com a tela aberta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  // cria o canal de notificações do Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        Notifications.setNotificationChannelAsync('chamados', {
          name: 'Atualizações de chamados',
          importance: Notifications.AndroidImportance.HIGH,
        }).catch((err) => console.log('Canal já existe ou falhou:', err));
      } catch (error) {
        console.error('Erro ao criar canal de notificações:', error);
      }
    }
  }, []);

  // reage ao toque na notificação para abrir a tela de detalhes
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const { chamadoId } = response.notification.request.content.data;
      if (chamadoId && navigationRef.isReady()) {
        navigationRef.navigate('CallDetail', { chamadoId });
      }
    });

    const response = Notifications.getLastNotificationResponse();
    const chamadoId = response?.notification.request.content.data?.chamadoId;
    if (chamadoId && navigationRef.isReady()) {
      navigationRef.navigate('CallDetail', { chamadoId });
    }

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="CallList">
        <Stack.Screen
          name="CallList"
          component={CallListScreen}
          options={{ title: 'Chamados' }}
        />
        <Stack.Screen
          name="NewCall"
          component={NewCallScreen}
          options={{ title: 'Novo Chamado' }}
        />
        <Stack.Screen
          name="CallDetail"
          component={CallDetailScreen}
          options={{ title: 'Detalhes do Chamado' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}