import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import ReservaCard from "../components/ReservaCard";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader, { HeaderIconButton } from "../components/ScreenHeader";
import { useAuth } from "../contexts/AuthContext";
import { useRestaurante } from "../contexts/RestauranteContext";
import { ROUTES } from "../routes/routes";
import { cancelarReserva, confirmarReserva, getPainel } from "../services/api";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { addDaysISO, formatDateBR, formatTime, todayISO } from "../utils/datetime";

function Indicador({ rotulo, valor }) {
  return (
    <View style={styles.indicador}>
      <Text style={styles.indicadorRotulo}>{rotulo}</Text>
      <Text style={styles.indicadorValor}>{valor}</Text>
    </View>
  );
}

// US06 - painel do restaurante: indicadores e reservas do dia ordenadas por horário.
export default function GerenteHomeScreen() {
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const { restaurante, loading: loadingRestaurante, error: errorRestaurante, load } = useRestaurante();

  const [dia, setDia] = useState(todayISO());
  const [painel, setPainel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [reservaToCancel, setReservaToCancel] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const carregar = useCallback(
    async (data = dia) => {
      if (!restaurante) return;
      setLoading(true);
      setError(null);
      try {
        setPainel(await getPainel(restaurante.id, data));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [restaurante, dia]
  );

  // Atualiza o painel sempre que a aba ganha foco (ou o dia muda).
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function confirmar(reserva) {
    try {
      await confirmarReserva(reserva.id, usuario.id);
      await carregar();
    } catch (e) {
      setError(e.message);
    }
  }

  function askToCancel(reserva) {
    setCancelError(null);
    setReservaToCancel(reserva);
    setConfirmVisible(true);
  }

  async function confirmCancel() {
    setCanceling(true);
    setCancelError(null);
    try {
      await cancelarReserva(reservaToCancel.id, usuario.id);
      setConfirmVisible(false);
      await carregar();
    } catch (e) {
      setCancelError(e.message);
    } finally {
      setCanceling(false);
    }
  }

  function acoesDe(reserva) {
    if (reserva.status === "cancelada") return [];
    const acoes = [];
    if (reserva.status === "pendente") {
      acoes.push({ title: "Confirmar", variant: "primary", onPress: () => confirmar(reserva) });
    }
    acoes.push({ title: "Cancelar", variant: "secondary", onPress: () => askToCancel(reserva) });
    return acoes;
  }

  if (loadingRestaurante && !restaurante) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </ScreenContainer>
    );
  }

  if (!restaurante) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Painel" />
        <ErrorBox message={errorRestaurante} onRetry={load} loading={loadingRestaurante} />
        <EmptyState
          title="Você ainda não cadastrou seu restaurante"
          hint="Cadastre para começar a receber reservas."
        >
          <Button
            textButton="Cadastrar restaurante"
            style={styles.emptyButton}
            onPress={() => navigation.navigate(ROUTES.RESTAURANTE_FORM)}
          />
        </EmptyState>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Painel"
        subtitle={restaurante.nome}
        right={<HeaderIconButton icon="refresh" label="Atualizar painel" disabled={loading} onPress={() => carregar()} />}
      />

      <View style={styles.diaRow}>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Dia anterior" onPress={() => setDia((d) => addDaysISO(d, -1))}>
          <MaterialIcons name="chevron-left" size={32} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.dia}>
          {dia === todayISO() ? "Hoje · " : ""}
          {formatDateBR(dia)}
        </Text>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Próximo dia" onPress={() => setDia((d) => addDaysISO(d, 1))}>
          <MaterialIcons name="chevron-right" size={32} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ErrorBox message={error} onRetry={() => carregar()} loading={loading} />

      {painel ? (
        <View style={styles.indicadores}>
          <Indicador rotulo="Reservas" valor={painel.reservasHoje} />
          <Indicador rotulo="Mesas livres" valor={painel.mesasLivres} />
          <Indicador rotulo="Ocupação" valor={`${painel.ocupacao}%`} />
        </View>
      ) : null}

      <Text style={styles.secao}>Reservas do dia</Text>

      {loading && !painel ? (
        <ActivityIndicator size="large" color={colors.accent} />
      ) : painel && painel.reservas.length === 0 ? (
        <Text style={styles.hint}>Nenhuma reserva para este dia.</Text>
      ) : (
        <View style={styles.lista}>
          {(painel?.reservas ?? []).map((reserva) => (
            <ReservaCard key={reserva.id} reserva={reserva} mostrar="cliente" acoes={acoesDe(reserva)} />
          ))}
        </View>
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Cancelar reserva"
        message={
          reservaToCancel
            ? `Deseja cancelar a reserva de ${reservaToCancel.clienteNome} às ${formatTime(reservaToCancel.horario)}?`
            : ""
        }
        confirmLabel="Cancelar reserva"
        loading={canceling}
        error={cancelError}
        onConfirm={confirmCancel}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyButton: { marginTop: 16, alignSelf: "stretch" },
  diaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  dia: { fontSize: 18, fontWeight: "700", color: colors.primary },
  indicadores: { flexDirection: "row", gap: 12, marginBottom: spacing.lg },
  indicador: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: colors.surface },
  indicadorRotulo: { fontSize: 12, color: colors.textSecondary },
  indicadorValor: { marginTop: 6, fontSize: 24, fontWeight: "700", color: colors.primary },
  secao: { marginBottom: 12, fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  lista: { gap: 12, paddingBottom: 24 },
  hint: { fontSize: 14, color: colors.textSecondary },
});
