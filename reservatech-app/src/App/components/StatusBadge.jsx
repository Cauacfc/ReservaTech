import { StyleSheet, Text, View } from "react-native";
import colors from "../theme/colors";
import borderRadius from "../theme/borderRadius";

const STYLES = {
  confirmada: { label: "Confirmada", bg: colors.successSurface, fg: colors.success },
  pendente: { label: "Pendente", bg: colors.warningSurface, fg: colors.warning },
  cancelada: { label: "Cancelada", bg: colors.errorSurface, fg: colors.error },
};

// Selo colorido com o status da reserva (confirmada, pendente ou cancelada).
export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? { label: status, bg: colors.surface, fg: colors.textSecondary };
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.fg }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  text: { fontSize: 12, fontWeight: "700" },
});
