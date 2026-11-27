import colors from "../theme/colors";

// Aparência comum da barra de abas, com as cores do Voll:
// azul claro (accent) na aba ativa e cinza nas demais.
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.accent,
  tabBarInactiveTintColor: colors.placeholder,
  tabBarShowLabel: true,
  tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
  tabBarStyle: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  tabBarBadgeStyle: { backgroundColor: colors.accent, color: colors.white, fontSize: 11 },
};
