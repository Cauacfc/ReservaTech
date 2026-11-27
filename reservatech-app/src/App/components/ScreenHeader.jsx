import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import colors from "../theme/colors";
import typography from "../theme/typography";
import spacing from "../theme/spacing";

// Cabeçalho das telas internas: seta de voltar (opcional), título e ações à direita (opcional).
export default function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={onBack}
            style={styles.back}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

// Botão de ícone para a área "right" do cabeçalho (atualizar, adicionar...).
export function HeaderIconButton({ icon, onPress, label, disabled }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={[styles.iconButton, disabled && { opacity: 0.4 }]}
    >
      <MaterialIcons name={icon} size={24} color={colors.accent} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  back: { marginLeft: -4, padding: 4 },
  title: { flex: 1, ...typography.h1, color: colors.primary },
  right: { flexDirection: "row", alignItems: "center" },
  iconButton: { padding: 6 },
  subtitle: { marginTop: spacing.xs, ...typography.body, color: colors.textSecondary },
});
