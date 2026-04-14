import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { useFonts } from 'expo-font';

LogBox.ignoreAllLogs(true);

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    PokemonHollow: require('../assets/fonts/PokemonHollow.ttf'),
    PokemonSolid: require('../assets/fonts/PokemonSolid.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return(

    <>
      <StatusBar style="light" />
      <Stack
       screenOptions={{
        headerStyle: { backgroundColor: "#FAE6C9" },
        headerTitleStyle: { color: '#000000', fontFamily: "PokemonSolid", fontSize: 24 },
        headerTintColor: '#ffffff',
        headerShadowVisible: false,
       }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: "Ops! Esta página não foi encontrada" }} />
      </Stack>
    </>

  )
  
}