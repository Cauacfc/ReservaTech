import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import OptionChips from "../components/OptionChips";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useReservas } from "../contexts/ReservasContext";
import { ROUTES } from "../routes/routes";
import { getMesasDisponiveis } from "../services/api";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { addDaysISO, formatDateBR, parseDateBR, parseTime, todayISO } from "../utils/datetime";
import { maskDate, maskTime } from "../utils/masks";

const HORARIOS = ["12:00", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map((h) => ({
  value: h,
  label: h,
}));

// US03 - reserva de mesa. Escolhe data, horário e número de pessoas; a API informa as mesas livres.
export default function NovaReservaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { saveReserva } = useReservas();

  const { restaurante, data: dataInicial, horario: horarioInicial, pessoas: pessoasInicial } = route.params;

  const [data, setData] = useState(formatDateBR(dataInicial ?? addDaysISO(todayISO(), 1)));
  const [horario, setHorario] = useState(horarioInicial ?? "19:30");
  const [pessoas, setPessoas] = useState(pessoasInicial ?? 2);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    const errors = {};
    const dataISO = parseDateBR(data);
    const horaOk = parseTime(horario);

    if (!dataISO) errors.data = "Use o formato dd/mm/aaaa.";
    else if (dataISO < todayISO()) errors.data = "Escolha uma data de hoje em diante.";
    if (!horaOk) errors.horario = "Escolha ou digite um horário (hh:mm).";

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      // Pergunta à API quais mesas estão livres e usa a menor que comporta o grupo.
      const livres = await getMesasDisponiveis(restaurante.id, {
        data: dataISO,
        horario: horaOk,
        pessoas,
      });
      if (livres.length === 0) {
        setFormError(
          `Não há mesas disponíveis para ${pessoas} pessoa(s) em ${data} às ${horaOk}. Tente outro horário.`
        );
        setSaving(false);
        return;
      }

      await saveReserva({
        mesaId: livres[0].id,
        dataReserva: dataISO,
        horario: horaOk,
        numeroPessoas: pessoas,
      });
      // Volta para as abas, já na lista "Reservas".
      navigation.navigate(ROUTES.CLIENTE_TABS, { screen: ROUTES.CLIENTE_RESERVAS });
    } catch (e) {
      setFieldErrors(e.fieldErrors ?? {});
      setFormError(e.message);
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Nova reserva" onBack={() => navigation.goBack()} />

      <View style={styles.restaurante}>
        <Text style={styles.restauranteNome}>{restaurante.nome}</Text>
        <Text style={styles.restauranteEndereco}>
          {restaurante.endereco} · {restaurante.cidade}
        </Text>
      </View>

      <LabeledInput
        label="Data"
        placeholder="dd/mm/aaaa"
        value={data}
        onChangeText={(text) => setData(maskDate(text))}
        error={fieldErrors.data ?? fieldErrors.dataReserva}
        keyboardType="number-pad"
        maxLength={10}
      />

      <OptionChips
        label="Horário"
        options={HORARIOS}
        value={horario}
        onChange={setHorario}
        error={fieldErrors.horario}
      />
      <LabeledInput
        label="Outro horário (hh:mm)"
        placeholder="20:15"
        value={horario}
        onChangeText={(text) => setHorario(maskTime(text))}
        keyboardType="number-pad"
        maxLength={5}
      />

      <Text style={styles.label}>Número de pessoas</Text>
      <View style={styles.stepper}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Diminuir"
          disabled={pessoas <= 1}
          onPress={() => setPessoas((p) => Math.max(1, p - 1))}
          style={[styles.stepperButton, pessoas <= 1 && styles.stepperDisabled]}
        >
          <MaterialIcons name="remove" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{pessoas}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Aumentar"
          disabled={pessoas >= 20}
          onPress={() => setPessoas((p) => Math.min(20, p + 1))}
          style={[styles.stepperButton, pessoas >= 20 && styles.stepperDisabled]}
        >
          <MaterialIcons name="add" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
      {fieldErrors.numeroPessoas ? <Text style={styles.error}>{fieldErrors.numeroPessoas}</Text> : null}

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <Button textButton="Confirmar reserva" loading={saving} onPress={handleConfirm} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  restaurante: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: "#EAF4FE",
    alignItems: "center",
  },
  restauranteNome: { fontSize: 18, fontWeight: "700", color: colors.primary },
  restauranteEndereco: { marginTop: 4, fontSize: 13, color: colors.textSecondary },
  label: { marginBottom: 6, color: "#36454F", fontSize: 14, fontWeight: "600" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 20, marginBottom: spacing.lg },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#00213D",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperDisabled: { opacity: 0.4 },
  stepperValue: { minWidth: 32, fontSize: 22, fontWeight: "700", textAlign: "center", color: colors.textPrimary },
  error: { marginTop: -12, marginBottom: 12, fontSize: 12, color: colors.error },
  formError: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.errorSurface,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
