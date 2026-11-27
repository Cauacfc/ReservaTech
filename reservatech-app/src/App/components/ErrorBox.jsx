import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import colors from "../theme/colors";

// Aviso de erro (ex.: sem conexão com a API) com botão opcional "Tentar novamente".
export default function ErrorBox({ message, onRetry, loading }) {
  if (!message) return null;
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <Button
          textButton="Tentar novamente"
          variant="secondary"
          loading={loading}
          onPress={onRetry}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: colors.errorSurface,
  },
  text: { fontSize: 14, lineHeight: 20, color: colors.textPrimary },
  button: { marginHorizontal: 0, marginBottom: 0 },
});
