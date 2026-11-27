import { NavigationContainer } from '@react-navigation/native';
// NavigationContainer: contexto global de navegação. Mantém o histórico de telas (a "pilha").
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// createNativeStackNavigator: navegador de pilha usando componentes nativos do iOS/Android.

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen1 from '../screens/RegisterScreen1';
import RegisterScreen2 from '../screens/RegisterScreen2';
import RegisterScreen3 from '../screens/RegisterScreen3';

import ClienteNavigator from './ClienteNavigator';
import GerenteNavigator from './GerenteNavigator';

import { useAuth } from '../contexts/AuthContext';
import { ReservasProvider } from '../contexts/ReservasContext';
import { RestauranteProvider } from '../contexts/RestauranteContext';
import { ROUTES } from './routes';

const Stack = createNativeStackNavigator(); // Cria a instância do navegador

// Telas exibidas enquanto ninguém está logado (mesmas do Voll: login e cadastro em 3 etapas).
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN}   // Tela exibida ao abrir o app
      screenOptions={{
        headerShown: false,             // Oculta o cabeçalho padrão em TODAS as telas
        animation: 'slide_from_right',  // Animação: desliza da direita para a esquerda
      }}
    >
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.REGISTER_1} component={RegisterScreen1} />
      <Stack.Screen name={ROUTES.REGISTER_2} component={RegisterScreen2} />
      <Stack.Screen name={ROUTES.REGISTER_3} component={RegisterScreen3} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { usuario } = useAuth();

  // A key faz a navegação e os dados dos contextos serem reiniciados quando outro usuário entra.
  return (
    <NavigationContainer key={usuario ? `usuario-${usuario.id}` : 'visitante'}>
      {!usuario ? (
        <AuthStack />
      ) : usuario.tipo === 'gerente' ? (
        <RestauranteProvider>
          <GerenteNavigator />
        </RestauranteProvider>
      ) : (
        <ReservasProvider>
          <ClienteNavigator />
        </ReservasProvider>
      )}
    </NavigationContainer>
  );
}
