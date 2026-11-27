import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorBox from "../components/ErrorBox";
import LabeledInput from "../components/LabeledInput";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useRestaurante } from "../contexts/RestauranteContext";
import { getRelatorio } from "../services/api";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { addDaysISO, formatDateBR, parseDateBR, todayISO } from "../utils/datetime";
import { maskDate } from "../utils/masks";

function Total({ rotulo, valor }) {
  return (
    <View style={styles.total}>
      <Text style={styles.totalRotulo}>{rotulo}</Text>
      <Text style={styles.totalValor}>{valor}</Text>
    </View>
  );
}

// US08 - relatório de reservas e ocupação por período.
export default function RelatorioScreen() {
  const { restaurante } = useRestaurante();

  const [inicio, setInicio] = useState(formatDateBR(addDaysISO(todayISO(), -7)));
  const [fim, setFim] = useState(formatDateBR(addDaysISO(todayISO(), 30)));
  const [fieldErrors, setFieldErrors] = useState({});
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function gerar() {
    const errors = {};
    const inicioISO = parseDateBR(inicio);
    const fimISO = parseDateBR(fim);
    if (!inicioISO) errors.inicio = "Use dd/mm/aaaa.";
    if (!fimISO) errors.fim = "Use dd/mm/aaaa.";
    if (inicioISO && fimISO && fimISO < inicioISO) errors.fim = "Deve ser depois da inicial.";

    setFieldErrors(errors);
    setError(null);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      setRelatorio(await getRelatorio(restaurante.id, inicioISO, fimISO));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!restaurante) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Relatório" />
        <EmptyState title="Cadastre seu restaurante no Painel para ver os relatórios." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Relatório" subtitle="Reservas e ocupação por período" />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <LabeledInput
            label="De"
            placeholder="dd/mm/aaaa"
            value={inicio}
            onChangeText={(text) => setInicio(maskDate(text))}
            error={fieldErrors.inicio}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
        <View style={styles.rowItem}>
          <LabeledInput
            label="Até"
            placeholder="dd/mm/aaaa"
            value={fim}
            onChangeText={(text) => setFim(maskDate(text))}
            error={fieldErrors.fim}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
      </View>

      <Button textButton="Gerar relatório" loading={loading} onPress={gerar} />

      <ErrorBox message={error} />

      {relatorio ? (
        <View style={styles.resultado}>
          <Text style={styles.secao}>
            {formatDateBR(relatorio.inicio)} a {formatDateBR(relatorio.fim)}
          </Text>

          <View style={styles.totais}>
            <Total rotulo="Total" valor={relatorio.totalReservas} />
            <Total rotulo="Confirmadas" valor={relatorio.confirmadas} />
          </View>
          <View style={styles.totais}>
            <Total rotulo="Pendentes" valor={relatorio.pendentes} />
            <Total rotulo="Canceladas" valor={relatorio.canceladas} />
          </View>
          <Text style={styles.detail}>Mesas cadastradas: {relatorio.mesasTotal}</Text>

          <Text style={styles.secao}>Por dia</Text>
          {relatorio.porDia.length === 0 ? (
            <Text style={styles.hint}>Nenhuma reserva no período.</Text>
          ) : (
            relatorio.porDia.map((dia) => (
              <View key={dia.data} style={styles.diaRow}>
                <Text style={styles.diaData}>{formatDateBR(dia.data)}</Text>
                <Text style={styles.diaDetalhe}>
                  {dia.total} reserva(s) · {dia.confirmadas} conf. · {dia.pendentes} pend. · {dia.canceladas} canc.
                </Text>
              </View>
            ))
          )}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  rowItem: { flex: 1 },
  resultado: { marginTop: spacing.md, paddingBottom: spacing.lg },
  secao: { marginTop: 8, marginBottom: 12, fontSize: 16, fontWeight: "700", color: colors.textPrimary },
  totais: { flexDirection: "row", gap: 12, marginBottom: 12 },
  total: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: colors.surface },
  totalRotulo: { fontSize: 12, color: colors.textSecondary },
  totalValor: { marginTop: 6, fontSize: 24, fontWeight: "700", color: colors.primary },
  detail: { marginBottom: 16, fontSize: 14, color: colors.textSecondary },
  diaRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E8E8E8" },
  diaData: { fontSize: 15, fontWeight: "700", color: colors.primary },
  diaDetalhe: { marginTop: 2, fontSize: 13, color: colors.textSecondary },
  hint: { fontSize: 14, color: colors.textSecondary },
});
