import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import ClienteHomeScreen from '../screens/ClienteHomeScreen';
import ExplorarScreen from '../screens/ExplorarScreen';
import ReservasScreen from '../screens/ReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import NovaReservaScreen from '../screens/NovaReservaScreen';
import { useReservas } from '../contexts/ReservasContext';
import { ROUTES } from './routes';
import { tabScreenOptions } from './tabOptions';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClienteTabs() {
  // Quantidade de reservas ativas, exibida no selo da aba "Reservas".
  const { reservas } = useReservas();
  const ativas = reservas.filter((reserva) => reserva.status !== 'cancelada').length;

  return (
    <Tab.Navigator initialRouteName={ROUTES.CLIENTE_HOME} screenOptions={tabScreenOptions}>
      <Tab.Screen
        name={ROUTES.CLIENTE_HOME}
        component={ClienteHomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.CLIENTE_EXPLORAR}
        component={ExplorarScreen}
        options={{
          tabBarLabel: 'Explorar',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.CLIENTE_RESERVAS}
        component={ReservasScreen}
        options={{
          tabBarLabel: 'Reservas',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="event-available" size={size} color={color} />,
          tabBarBadge: ativas > 0 ? ativas : undefined,
        }}
      />
      <Tab.Screen
        name={ROUTES.CLIENTE_PERFIL}
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function ClienteNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.CLIENTE_TABS}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      {/* A primeira tela da pilha são as abas (Início, Explorar, Reservas e Perfil)... */}
      <Stack.Screen name={ROUTES.CLIENTE_TABS} component={ClienteTabs} />
      {/* ...e a tela de nova reserva é empilhada por cima delas. */}
      <Stack.Screen name={ROUTES.NOVA_RESERVA} component={NovaReservaScreen} />
    </Stack.Navigator>
  );
}
