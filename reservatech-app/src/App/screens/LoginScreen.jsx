// Componente de tela
import { useRef, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import ScreenContainer from "../components/ScreenContainer";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES } from "../routes/routes";
import colors from "../theme/colors";
import { isValidEmail } from "../utils/masks";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { entrar } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const senhaRef = useRef(null);

  async function handleLogin() {
    const errors = {};
    if (!isValidEmail(email)) errors.email = "Informe um e-mail válido.";
    if (!senha) errors.senha = "Informe sua senha.";

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await entrar(email, senha);
    } catch (e) {
      setFormError(e.message);
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Logo />
      <Text style={styles.title}>Faça login na sua conta</Text>
      <LabeledInput
        label="Email:"
        placeholder="Insira seu endereço de email:"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => senhaRef.current?.focus()}
      />
      <LabeledInput
        ref={senhaRef}
        label="Senha:"
        placeholder="Insira sua senha:"
        value={senha}
        onChangeText={setSenha}
        error={fieldErrors.senha}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      {formError ? (
        <Text style={styles.formError} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <Button textButton="Entrar" loading={loading} onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER_1)} accessibilityRole="link">
        <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Contas de teste (senha 123456): maria@email.com (cliente) ou carlos@sabordacasa.com (gerente).
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
    title:{
      fontSize: 20,
      fontWeight: "700",
      textAlign: "center",
      color: "#6B6E71",
      marginBottom: 26,
    },
    formError: {
      marginBottom: 8,
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.errorSurface,
      fontSize: 14,
      lineHeight: 20,
      color: colors.textPrimary,
    },
    link: {
      marginTop: 8,
      textAlign: "center",
      fontSize: 14,
      fontWeight: "600",
      color: colors.accent,
    },
    hint: {
      marginTop: 28,
      fontSize: 12,
      lineHeight: 18,
      textAlign: "center",
      color: colors.placeholder,
    },
})
