import { useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import OptionChips from "../components/OptionChips";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useRestaurante } from "../contexts/RestauranteContext";
import colors from "../theme/colors";

const LOCAIS = [
  { value: "interna", label: "Interna" },
  { value: "externa", label: "Externa" },
];

// A mesma tela serve para cadastrar e para alterar:
//   navigation.navigate(ROUTES.MESA_FORM)            -> cadastro
//   navigation.navigate(ROUTES.MESA_FORM, { id: 3 }) -> alteração da mesa 3
export default function MesaFormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mesas, saveMesa } = useRestaurante();

  const id = route.params?.id;
  const editing = id != null;
  const mesa = editing ? mesas.find((item) => item.id === id) : undefined;

  const proximoNumero = mesas.length > 0 ? Math.max(...mesas.map((m) => m.numero)) + 1 : 1;

  const [numero, setNumero] = useState(String(mesa?.numero ?? proximoNumero));
  const [capacidade, setCapacidade] = useState(mesa ? String(mesa.capacidade) : "");
  const [localizacao, setLocalizacao] = useState(mesa?.localizacao ?? "interna");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const capacidadeRef = useRef(null);

  async function handleSave() {
    const errors = {};
    const numeroInt = Number(numero);
    const capacidadeInt = Number(capacidade);

    if (!Number.isInteger(numeroInt) || numeroInt <= 0) errors.numero = "Informe o número da mesa.";
    if (!Number.isInteger(capacidadeInt) || capacidadeInt <= 0) errors.capacidade = "Informe a capacidade (lugares).";

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await saveMesa({ numero: numeroInt, capacidade: capacidadeInt, localizacao }, id);
      navigation.goBack();
    } catch (e) {
      setFieldErrors(e.fieldErrors ?? {});
      if (Object.keys(e.fieldErrors ?? {}).length === 0) setFormError(e.message);
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={editing ? "Alterar mesa" : "Nova mesa"} onBack={() => navigation.goBack()} />

      <LabeledInput
        label="Número da mesa"
        placeholder="1"
        value={numero}
        onChangeText={(text) => setNumero(text.replace(/\D/g, "").slice(0, 3))}
        error={fieldErrors.numero}
        keyboardType="number-pad"
        returnKeyType="next"
        onSubmitEditing={() => capacidadeRef.current?.focus()}
      />
      <LabeledInput
        ref={capacidadeRef}
        label="Capacidade (lugares)"
        placeholder="4"
        value={capacidade}
        onChangeText={(text) => setCapacidade(text.replace(/\D/g, "").slice(0, 2))}
        error={fieldErrors.capacidade}
        keyboardType="number-pad"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />
      <OptionChips
        label="Localização"
        options={LOCAIS}
        value={localizacao}
        onChange={setLocalizacao}
        error={fieldErrors.localizacao}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <Button textButton={editing ? "Salvar alterações" : "Cadastrar"} loading={saving} onPress={handleSave} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
