import { Modal, StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import colors from "../theme/colors";

/*
 * Caixa de confirmação para ações que não têm volta (ex.: cancelar, excluir).
 * Usa o Modal em vez do Alert.alert porque o Alert não funciona no navegador.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  loading = false,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button
              textButton="Voltar"
              variant="secondary"
              style={styles.button}
              disabled={loading}
              onPress={onCancel}
            />
            <Button
              textButton={confirmLabel}
              variant="danger"
              style={styles.button}
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  title: { marginBottom: 8, fontSize: 18, fontWeight: "700", color: colors.primary },
  message: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  error: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.errorSurface,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textPrimary,
  },
  actions: { flexDirection: "row", marginTop: 20, marginHorizontal: -20 },
  button: { flex: 1, marginHorizontal: 20 / 2 },
});
