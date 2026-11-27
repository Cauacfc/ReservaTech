import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import Card from "./Card";
import StatusBadge from "./StatusBadge";
import colors from "../theme/colors";
import { formatDateBR, formatTime } from "../utils/datetime";

// Cartão de uma reserva. Mostra o restaurante (visão do cliente) ou o cliente (visão do gerente).
// "acoes" é uma lista de { title, variant, onPress } exibida como botões embaixo do cartão.
export default function ReservaCard({ reserva, mostrar = "restaurante", acoes = [] }) {
  const titulo = mostrar === "cliente" ? reserva.clienteNome : reserva.restauranteNome;

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {titulo}
          </Text>
          <Text style={styles.detail}>
            {formatDateBR(reserva.dataReserva)} às {formatTime(reserva.horario)} ·{" "}
            {reserva.numeroPessoas === 1 ? "1 pessoa" : `${reserva.numeroPessoas} pessoas`}
          </Text>
          <Text style={styles.detail}>
            Mesa {reserva.mesaNumero} ({reserva.localizacao})
          </Text>
        </View>
        <StatusBadge status={reserva.status} />
      </View>

      {acoes.length > 0 ? (
        <View style={styles.actions}>
          {acoes.map((acao) => (
            <Button
              key={acao.title}
              textButton={acao.title}
              variant={acao.variant ?? "primary"}
              style={styles.action}
              onPress={acao.onPress}
            />
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  top: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: colors.primary },
  detail: { marginTop: 4, fontSize: 14, color: colors.textSecondary },
  actions: { flexDirection: "row", gap: 8 },
  action: { flex: 1, marginHorizontal: 0, marginVertical: 0 },
});
