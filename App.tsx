import React from "react";
import "react-native-url-polyfill/auto";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { useFonts, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { Karla_400Regular, Karla_700Bold } from "@expo-google-fonts/karla";
import 'react-native-gesture-handler';

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import { ProvideAuth, useAuth } from "./stores/useAuth";
import { defaultTheme } from "./constants/Theme";
import { ProvideModal } from "./stores/useModal";

function Main() {
  const isLoadingComplete = useCachedResources();
  const auth = useAuth();

  const [fontsLoaded] = useFonts({
    Rubik_700Bold,
    Karla_400Regular,
    Karla_700Bold,
  });

  if (!isLoadingComplete || !fontsLoaded || auth?.loading) {
    return null;
  } else {
    return (
      <NativeBaseProvider theme={defaultTheme}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </NativeBaseProvider>
    );
  }
}
export default function App() {
  return (
    <ProvideAuth>
      <ProvideModal>
        <Main />
      </ProvideModal>
    </ProvideAuth>
  );
}
