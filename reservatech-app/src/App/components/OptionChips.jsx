import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import colors from "../theme/colors";

// Grade de opções selecionáveis (horários, localização da mesa...).
// options: lista de { value, label }.
export default function OptionChips({ label, options, value, onChange, error }) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              activeOpacity={0.8}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => onChange(option.value)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", marginBottom: 14 },
  label: { marginBottom: 6, color: "#36454F", fontSize: 14, fontWeight: "600" },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: 14, color: "#222" },
  chipTextSelected: { color: colors.white, fontWeight: "700" },
  error: { marginTop: 4, fontSize: 12, color: colors.error },
});
