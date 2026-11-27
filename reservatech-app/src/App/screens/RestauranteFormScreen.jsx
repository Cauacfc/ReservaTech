import { useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useRestaurante } from "../contexts/RestauranteContext";
import colors from "../theme/colors";
import { isValidPhone, maskPhone } from "../utils/masks";

// Cadastro do restaurante do gerente (feito uma única vez).
export default function RestauranteFormScreen() {
  const navigation = useNavigation();
  const { saveRestaurante } = useRestaurante();

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  const enderecoRef = useRef(null);
  const cidadeRef = useRef(null);
  const telefoneRef = useRef(null);

  async function handleSave() {
    const errors = {};
    if (!nome.trim()) errors.nome = "Informe o nome do restaurante.";
    if (!endereco.trim()) errors.endereco = "Informe o endereço.";
    if (!cidade.trim()) errors.cidade = "Informe a cidade.";
    if (telefone && !isValidPhone(telefone)) errors.telefone = "Informe um telefone válido com DDD.";

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await saveRestaurante({
        nome: nome.trim(),
        endereco: endereco.trim(),
        cidade: cidade.trim(),
        telefone: telefone || undefined,
      });
      navigation.goBack();
    } catch (e) {
      setFieldErrors(e.fieldErrors ?? {});
      if (Object.keys(e.fieldErrors ?? {}).length === 0) setFormError(e.message);
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Cadastrar restaurante" onBack={() => navigation.goBack()} />

      <LabeledInput
        label="Nome do restaurante"
        placeholder="Ex.: Sabor da Casa"
        value={nome}
        onChangeText={setNome}
        error={fieldErrors.nome}
        returnKeyType="next"
        onSubmitEditing={() => enderecoRef.current?.focus()}
      />
      <LabeledInput
        ref={enderecoRef}
        label="Endereço"
        placeholder="Rua, número"
        value={endereco}
        onChangeText={setEndereco}
        error={fieldErrors.endereco}
        returnKeyType="next"
        onSubmitEditing={() => cidadeRef.current?.focus()}
      />
      <LabeledInput
        ref={cidadeRef}
        label="Cidade"
        placeholder="Ex.: São Paulo"
        value={cidade}
        onChangeText={setCidade}
        error={fieldErrors.cidade}
        returnKeyType="next"
        onSubmitEditing={() => telefoneRef.current?.focus()}
      />
      <LabeledInput
        ref={telefoneRef}
        label="Telefone (opcional)"
        placeholder="(11) 3000-0000"
        value={telefone}
        onChangeText={(text) => setTelefone(maskPhone(text))}
        error={fieldErrors.telefone}
        keyboardType="phone-pad"
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <Button textButton="Cadastrar restaurante" loading={saving} onPress={handleSave} />
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
