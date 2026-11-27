import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Button from "./Button";
import Card from "./Card";
import colors from "../theme/colors";

// Uma linha da busca: foto, nome, endereço e botão Reservar.
export default function RestauranteCard({ restaurante, onReservar }) {
  return (
    <Card style={styles.card}>
      <View style={styles.photo}>
        <MaterialIcons name="restaurant" size={22} color={colors.accent} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {restaurante.nome}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {restaurante.endereco} · {restaurante.cidade}
        </Text>
      </View>
      <Button textButton="Reservar" onPress={onReservar} style={styles.button} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  photo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#EAF4FE",
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: colors.primary },
  address: { marginTop: 2, fontSize: 13, color: colors.textSecondary },
  button: { marginHorizontal: 0, marginVertical: 0, paddingHorizontal: 12 },
});
