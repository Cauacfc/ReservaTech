import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import GerenteHomeScreen from '../screens/GerenteHomeScreen';
import MesasScreen from '../screens/MesasScreen';
import MesaFormScreen from '../screens/MesaFormScreen';
import RelatorioScreen from '../screens/RelatorioScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RestauranteFormScreen from '../screens/RestauranteFormScreen';
import { useRestaurante } from '../contexts/RestauranteContext';
import { ROUTES } from './routes';
import { tabScreenOptions } from './tabOptions';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function GerenteTabs() {
  // Quantidade de mesas cadastradas, exibida no selo da aba "Mesas".
  const { mesas } = useRestaurante();

  return (
    <Tab.Navigator initialRouteName={ROUTES.GERENTE_HOME} screenOptions={tabScreenOptions}>
      <Tab.Screen
        name={ROUTES.GERENTE_HOME}
        component={GerenteHomeScreen}
        options={{
          tabBarLabel: 'Painel',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.MESAS}
        component={MesasScreen}
        options={{
          tabBarLabel: 'Mesas',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="table-restaurant" size={size} color={color} />,
          tabBarBadge: mesas.length > 0 ? mesas.length : undefined,
        }}
      />
      <Tab.Screen
        name={ROUTES.RELATORIO}
        component={RelatorioScreen}
        options={{
          tabBarLabel: 'Relatório',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="bar-chart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name={ROUTES.GERENTE_PERFIL}
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

export default function GerenteNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.GERENTE_TABS}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name={ROUTES.GERENTE_TABS} component={GerenteTabs} />
      {/* Formulários empilhados por cima das abas, cobrindo a barra. */}
      <Stack.Screen name={ROUTES.MESA_FORM} component={MesaFormScreen} />
      <Stack.Screen name={ROUTES.RESTAURANTE_FORM} component={RestauranteFormScreen} />
    </Stack.Navigator>
  );
}
