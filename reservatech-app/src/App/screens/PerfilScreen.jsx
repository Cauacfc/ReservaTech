import { StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import Card from "../components/Card";
import ScreenContainer from "../components/ScreenContainer";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../contexts/AuthContext";
import colors from "../theme/colors";
import spacing from "../theme/spacing";

function Linha({ rotulo, valor }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{rotulo}</Text>
      <Text style={styles.value}>{valor || "—"}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const { usuario, sair } = useAuth();

  return (
    <ScreenContainer>
      <ScreenHeader title="Perfil" />

      <Card style={styles.card}>
        <Linha rotulo="Nome" valor={usuario.nome} />
        <Linha rotulo="E-mail" valor={usuario.email} />
        <Linha rotulo="Telefone" valor={usuario.telefone} />
        <Linha rotulo="Tipo de conta" valor={usuario.tipo === "gerente" ? "Gerente de restaurante" : "Cliente"} />
      </Card>

      <Button textButton="Sair" variant="danger" onPress={sair} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, marginBottom: spacing.md },
  row: { gap: 2 },
  label: { fontSize: 12, fontWeight: "700", color: colors.textSecondary },
  value: { fontSize: 16, color: colors.textPrimary },
});
