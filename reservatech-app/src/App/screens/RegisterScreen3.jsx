import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import Button from "../components/Button";
import ScreenContainer from "../components/ScreenContainer";
import Logo from "../components/Logo";
import { useAuth } from "../contexts/AuthContext";

import colors from "../theme/colors";
import spacing from "../theme/spacing";
import borderRadius from "../theme/borderRadius";

const PERFIS = [
  {
    value: "cliente",
    titulo: "Cliente",
    descricao: "Busque restaurantes, reserve mesas e acompanhe suas reservas.",
  },
  {
    value: "gerente",
    titulo: "Gerente de restaurante",
    descricao: "Cadastre seu restaurante e as mesas, confirme reservas e veja relatórios.",
  },
];

// Etapa 3 de 3: escolha do perfil (equivalente à tela de seleção de planos do Voll).
export default function RegisterScreen3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { cadastrar } = useAuth();

  const [tipo, setTipo] = useState("cliente");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function concluir() {
    const { nome, email, senha, telefone } = route.params;
    setLoading(true);
    setError(null);
    try {
      // O cadastro já deixa o usuário logado e o app troca para a área dele.
      await cadastrar({ nome, email, senha, telefone: telefone || undefined, tipo });
    } catch (e) {
      const campos = Object.values(e.fieldErrors ?? {});
      setError(campos.length > 0 ? campos.join(" ") : e.message);
      setLoading(false);
    }
  }

  return (
    <ScreenContainer background={colors.backgroundDark}>
      <Logo />
      <Text style={styles.title}>Escolha o seu perfil</Text>

      {PERFIS.map((perfil) => {
        const selecionado = perfil.value === tipo;
        return (
          <TouchableOpacity
            key={perfil.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: selecionado }}
            activeOpacity={0.85}
            onPress={() => setTipo(perfil.value)}
            style={[styles.card, selecionado && styles.cardSelecionado]}
          >
            <View style={styles.radio}>
              {selecionado ? <View style={styles.radioDot} /> : null}
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{perfil.titulo}</Text>
              <Text style={styles.cardDescricao}>{perfil.descricao}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <Button textButton="Concluir cadastro" loading={loading} onPress={concluir} />
      <Button textButton="Voltar" variant="secondary" disabled={loading} onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 22,
    color: colors.white,
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: "#2B2B2B",
    backgroundColor: "#111111",
  },
  cardSelecionado: { borderColor: colors.accent },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.white },
  cardDescricao: { marginTop: 4, fontSize: 13, lineHeight: 18, color: colors.placeholder },
  error: {
    marginBottom: spacing.sm,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.errorSurface,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
