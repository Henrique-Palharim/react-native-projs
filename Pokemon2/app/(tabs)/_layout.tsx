import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function TabLayout() {

  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    PokemonHollow: require('../../assets/fonts/PokemonHollow.ttf'),
    PokemonSolid: require('../../assets/fonts/PokemonSolid.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (

    <Tabs
      screenOptions={{
        
        // HEADER
        headerStyle: { backgroundColor: '#FAE6C9' }, // '#3b3b3bff'
        headerTitleStyle: { color: '#000000', fontFamily: "PokemonSolid", fontSize: 24 },
        headerTintColor: '#000000',
        headerShadowVisible: false,

        // TAB BAR
        tabBarStyle: { 
          backgroundColor: '#72514A', 
          borderTopWidth: 0, 
          elevation: 10, 
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom, 
        },
        tabBarActiveTintColor: 'white',
        // tabBarActiveBackgroundColor: '#e9bbbbff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 14 },
      }}
    >

      <Tabs.Screen 
        name="index" 
        options={{ title: "Início",tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="about" 
        options={{ title: "Sobre", tabBarIcon: ({ color, focused }) => (
          <Ionicons 
              name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="battle" 
        options={{ title: "Batalha", tabBarIcon: ({ color, focused }) => (
          <Ionicons 
              name={focused ? 'flame' : 'flame-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="toDoList" 
        options={{ title: "Lista",tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'checkbox' : 'checkbox-outline'} color={color} size={24} />
          ),
        }} 
      />

    </Tabs>

  );

}