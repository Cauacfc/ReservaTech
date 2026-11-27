// Componente reutilizável do botão principal
import { ActivityIndicator, TouchableOpacity, Text, StyleSheet } from "react-native";
import colors from "../theme/colors";

const BG_BUTTON = '#00213D';
const TEXT_PRIMARY = '#FFFFFF';

// variant: "primary" (azul escuro), "secondary" (cinza, como o botão "Voltar") ou "danger" (vermelho)
export default function Button({
    textButton,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
    style,
}) {
    const blocked = disabled || loading;

    return(
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: blocked, busy: loading }}
            activeOpacity={0.8}
            disabled={blocked}
            onPress={onPress}
            style={[styles.button, styles[variant], blocked && styles.blocked, style]}
        >
            {loading ? (
                <ActivityIndicator color={TEXT_PRIMARY} style={styles.loader} />
            ) : (
                <Text style={styles.title}>{ textButton ? textButton : "Enviar" }</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: BG_BUTTON,
        borderRadius: 8,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    primary: { backgroundColor: BG_BUTTON },
    secondary: { backgroundColor: colors.disabled },
    danger: { backgroundColor: colors.error },
    blocked: { opacity: 0.6 },
    title: {
        color: TEXT_PRIMARY,
        textAlign: "center",
        marginVertical: 2,
        paddingVertical: 7,
    },
    loader: { marginVertical: 2, paddingVertical: 7 },
})
