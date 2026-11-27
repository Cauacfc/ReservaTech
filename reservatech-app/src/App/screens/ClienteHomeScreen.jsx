import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import Card from "../components/Card";
import ErrorBox from "../components/ErrorBox";
import Logo from "../components/Logo";
import ReservaCard from "../components/ReservaCard";
import ScreenContainer from "../components/ScreenContainer";
import { useAuth } from "../contexts/AuthContext";
import { useReservas } from "../contexts/ReservasContext";
import { ROUTES } from "../routes/routes";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import typography from "../theme/typography";

// Próxima reserva ativa (não cancelada) que ainda não aconteceu.
function proximaReserva(reservas) {
  const agora = new Date();
  return reservas
    .filter((r) => r.status !== "cancelada")
    .map((r) => ({ reserva: r, inicio: new Date(`${r.dataReserva}T${r.horario}`) }))
    .filter((item) => item.inicio >= agora)
    .sort((a, b) => a.inicio - b.inicio)[0]?.reserva;
}

export default function ClienteHomeScreen() {
  const navigation = useNavigation();
  const { usuario } = useAuth();
  const { reservas, loading, error, loadReservas } = useReservas();

  const proxima = proximaReserva(reservas);
  const ativas = reservas.filter((r) => r.status !== "cancelada").length;
  const primeiroNome = usuario.nome.split(" ")[0];

  return (
    <ScreenContainer>
      <Logo />
      <Text style={styles.greeting}>Olá, {primeiroNome}!</Text>
      <Text style={styles.subtitle}>O que vamos reservar hoje?</Text>

      <ErrorBox message={error} onRetry={loadReservas} loading={loading} />

      <Text style={styles.section}>Próxima reserva</Text>
      {proxima ? (
        <ReservaCard reserva={proxima} mostrar="restaurante" />
      ) : (
        <Card>
          <Text style={styles.emptyTitle}>Nenhuma reserva marcada</Text>
          <Text style={styles.emptyHint}>
            Busque um restaurante com mesa livre e reserve em poucos passos.
          </Text>
        </Card>
      )}

      <View style={styles.counter}>
        <Text style={styles.counterValue}>{ativas}</Text>
        <Text style={styles.counterLabel}>
          {ativas === 1 ? "reserva ativa" : "reservas ativas"}
        </Text>
      </View>

      <Button
        textButton="Reservar uma mesa"
        onPress={() => navigation.navigate(ROUTES.CLIENTE_EXPLORAR)}
      />
      <Button
        textButton="Ver minhas reservas"
        variant="secondary"
        onPress={() => navigation.navigate(ROUTES.CLIENTE_RESERVAS)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greeting: { ...typography.h1, textAlign: "center", color: colors.primary, marginTop: spacing.md },
  subtitle: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  section: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyTitle: { ...typography.h3, color: colors.primary },
  emptyHint: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  counter: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  counterValue: { fontSize: 32, fontWeight: "700", color: colors.accent },
  counterLabel: { ...typography.body, color: colors.textSecondary },
});
