import { Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import LabeledInput from "../components/LabeledInput";
import Button from "../components/Button";
import ScreenContainer from "../components/ScreenContainer";
import Logo from "../components/Logo";

import { ROUTES } from "../routes/routes";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { isValidPhone, maskPhone } from "../utils/masks";

// Etapa 2 de 3: telefone para contato (opcional).
export default function RegisterScreen2() {
  const navigation = useNavigation();
  const route = useRoute();

  const [telefone, setTelefone] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function avancar() {
    if (telefone && !isValidPhone(telefone)) {
      setFieldErrors({ telefone: "Informe um telefone válido com DDD." });
      return;
    }
    setFieldErrors({});
    navigation.navigate(ROUTES.REGISTER_3, { ...route.params, telefone });
  }

  return (
    <ScreenContainer>
      <Logo />
      <Text style={styles.title}>Como podemos falar com você?</Text>
      <LabeledInput
        label="Telefone (opcional)"
        placeholder="(11) 91234-5678"
        value={telefone}
        onChangeText={(text) => setTelefone(maskPhone(text))}
        error={fieldErrors.telefone}
        keyboardType="phone-pad"
        returnKeyType="done"
        onSubmitEditing={avancar}
      />
      <Text style={styles.hint}>
        Usamos o telefone apenas para contato sobre as suas reservas.
      </Text>

      <Button textButton="Avançar" onPress={avancar} />
      <Button textButton="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 22,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  hint: {
    marginBottom: spacing.md,
    fontSize: 12,
    lineHeight: 18,
    color: colors.placeholder,
  },
});
