import { StyleSheet, Text, View } from "react-native";

import colors from "../theme/colors";

// Mensagem exibida quando uma lista está vazia.
export default function EmptyState({ title, hint, children }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", paddingVertical: 48, paddingHorizontal: 8 },
  title: { fontSize: 16, fontWeight: "700", textAlign: "center", color: colors.textSecondary },
  hint: { marginTop: 8, fontSize: 14, textAlign: "center", color: colors.placeholder },
});
