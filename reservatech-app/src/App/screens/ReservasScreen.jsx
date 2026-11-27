import { useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import ReservaCard from "../components/ReservaCard";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader, { HeaderIconButton } from "../components/ScreenHeader";
import { useReservas } from "../contexts/ReservasContext";
import colors from "../theme/colors";
import { formatDateBR, formatTime } from "../utils/datetime";

// US04 - lista as reservas do cliente e permite cancelar.
export default function ReservasScreen() {
  const { reservas, loading, error, loadReservas, cancelReserva } = useReservas();

  const [reservaToCancel, setReservaToCancel] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  function askToCancel(reserva) {
    setCancelError(null);
    setReservaToCancel(reserva);
    setConfirmVisible(true);
  }

  async function confirmCancel() {
    setCanceling(true);
    setCancelError(null);
    try {
      await cancelReserva(reservaToCancel.id);
      setConfirmVisible(false);
    } catch (e) {
      // Ex.: "O cancelamento só é permitido até 1 hora antes do horário reservado."
      setCancelError(e.message);
    } finally {
      setCanceling(false);
    }
  }

  const firstLoad = loading && reservas.length === 0;

  return (
    <ScreenContainer scroll={false}>
      <ScreenHeader
        title="Minhas reservas"
        right={
          <HeaderIconButton
            icon="refresh"
            label="Atualizar lista"
            disabled={loading}
            onPress={loadReservas}
          />
        }
      />

      <ErrorBox message={error} onRetry={loadReservas} loading={loading} />

      {firstLoad ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ReservaCard
              reserva={item}
              mostrar="restaurante"
              acoes={
                item.status === "cancelada"
                  ? []
                  : [{ title: "Cancelar reserva", variant: "secondary", onPress: () => askToCancel(item) }]
              }
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            error ? null : (
              <EmptyState
                title="Você ainda não tem reservas"
                hint='Use a aba "Explorar" para reservar uma mesa.'
              />
            )
          }
          refreshing={loading}
          onRefresh={loadReservas}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Cancelar reserva"
        message={
          reservaToCancel
            ? `Deseja cancelar a reserva em ${reservaToCancel.restauranteNome} no dia ${formatDateBR(
                reservaToCancel.dataReserva
              )} às ${formatTime(reservaToCancel.horario)}?`
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
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  separator: { height: 12 },
  listContent: { flexGrow: 1, paddingBottom: 32 },
});
