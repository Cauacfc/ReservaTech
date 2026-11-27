import { forwardRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../theme/colors";

const INPUT_BG = "#F5F5F5";
const INPUT_BORDER = "#E8E8E8";
const LABEL_COLOR = "#36454F";

// Campo de texto com rótulo em cima e mensagem de erro embaixo.
// As demais propriedades (value, onChangeText, placeholder, keyboardType...) vão direto para o TextInput.
const LabeledInput = forwardRef(function LabeledInput({ label, error, style, ...rest }, ref) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>
                { label }
            </Text>
            <TextInput
                ref={ref}
                accessibilityLabel={label}
                style={[styles.input, error && styles.inputError, style]}
                placeholderTextColor="#B5B5B5"
                {...rest} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    )
});

export default LabeledInput;

const styles = StyleSheet.create({
    wrapper: {
        width: "100%", // Faz o componente ocupar toda a largura disponível
        marginBottom: 14, // Define o espaço abaixo do campo
    },
    label: {
        marginBottom: 6,
        color: LABEL_COLOR,
        fontSize: 14,
        fontWeight: "600",
    },
    input: {
        backgroundColor: INPUT_BG,
        borderRadius: 8,
        borderColor: INPUT_BORDER,
        borderWidth: 1, // Define o comprimento da borda

        shadowColor: "#000", // Define a cor da borda
        shadowOffset: { width: 1, height: 2}, // Define a posição da sombra
        shadowOpacity: 0.08, // Define a transparência
        shadowRadius: 6,

        fontSize: 14,
        color: "#222",

        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    inputError: { borderColor: colors.error },
    error: { marginTop: 4, fontSize: 12, color: colors.error },
})
