import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Card from "./Card";
import colors from "../theme/colors";

// Uma linha da lista de mesas: número, capacidade e localização à esquerda; alterar e excluir à direita.
export default function MesaCard({ mesa, onEdit, onDelete }) {
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>Mesa {mesa.numero}</Text>
        <Text style={styles.detail}>
          {mesa.capacidade === 1 ? "1 lugar" : `${mesa.capacidade} lugares`} · {mesa.localizacao}
        </Text>
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Alterar mesa ${mesa.numero}`}
        onPress={onEdit}
        style={styles.action}
      >
        <MaterialIcons name="edit" size={22} color={colors.accent} />
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Excluir mesa ${mesa.numero}`}
        onPress={onDelete}
        style={styles.action}
      >
        <MaterialIcons name="delete" size={22} color={colors.error} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingRight: 6 },
  info: { flex: 1, marginRight: 4 },
  name: { fontSize: 16, fontWeight: "700", color: colors.primary },
  detail: { marginTop: 4, fontSize: 14, color: colors.textSecondary },
  action: { padding: 10 },
});
