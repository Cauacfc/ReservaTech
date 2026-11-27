import { Text, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import LabeledInput from "../components/LabeledInput";
import Button from "../components/Button";

import ScreenContainer from "../components/ScreenContainer";
import Logo from "../components/Logo";

import { ROUTES } from "../routes/routes";
import colors from "../theme/colors";
import spacing from "../theme/spacing";
import { isValidEmail } from "../utils/masks";

// Etapa 1 de 3: dados básicos (nome, e-mail e senha).
export default function RegisterScreen1() {
    const navigation = useNavigation();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const emailRef = useRef(null);
    const senhaRef = useRef(null);
    const confirmaRef = useRef(null);

    function avancar() {
      const errors = {};
      if (!nome.trim()) errors.nome = "Informe seu nome completo.";
      if (!isValidEmail(email)) errors.email = "Informe um e-mail válido.";
      if (senha.length < 6) errors.senha = "A senha deve ter pelo menos 6 caracteres.";
      if (confirmaSenha !== senha) errors.confirmaSenha = "As senhas não são iguais.";

      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;

      navigation.navigate(ROUTES.REGISTER_2, { nome: nome.trim(), email: email.trim(), senha });
    }

    return(
      <ScreenContainer>
        <Logo />
        <Text
          style={styles.title}>
            Insira alguns dados básicos:
        </Text>
        <LabeledInput
          label="Nome"
          placeholder="Digite seu nome completo"
          value={nome}
          onChangeText={setNome}
          error={fieldErrors.nome}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />
        <LabeledInput
          ref={emailRef}
          label="Email"
          placeholder="Insira seu endereço de email"
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
          label="Crie uma senha"
          placeholder="Insira sua senha (mínimo de 6 caracteres)"
          value={senha}
          onChangeText={setSenha}
          error={fieldErrors.senha}
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmaRef.current?.focus()}
        />
        <LabeledInput
          ref={confirmaRef}
          label="Repita a senha"
          placeholder="Insira sua senha"
          value={confirmaSenha}
          onChangeText={setConfirmaSenha}
          error={fieldErrors.confirmaSenha}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={avancar}
        />
        <Button
          textButton="Avançar"
          onPress={avancar}
        />
        <Button
          textButton="Voltar"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
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
});
