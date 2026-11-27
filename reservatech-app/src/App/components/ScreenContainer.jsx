import { ScrollView, StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../theme/colors";

// scroll=false: usado nas telas com FlatList, que já rolam sozinhas.
// background: permite trocar o fundo (a tela 3 do cadastro usa preto, como no Voll).
export default function ScreenContainer({ children, contentStyle, scroll = true, background }) {
  return(
    <SafeAreaView style={[styles.safe, background && { backgroundColor: background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={[ styles.content, contentStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.fixed, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingTop: 32 },
  // flexGrow -> 1, faz com que o conteúdo utilize toda a tela, mesmo que não tenha conteúdo suficiente para preencher a tela.
  fixed: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
});
