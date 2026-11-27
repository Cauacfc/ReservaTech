// Componente funcional que contem a porta de entrada do App
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./App/routes/AppNavigator";
import { AuthProvider } from "./App/contexts/AuthContext";

export default function App() {
    // O AuthProvider deixa o usuário logado disponível para todas as telas.
    return (
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    )
}
