// Paleta de cores do ReservaTech (mesma do app Voll)
const colors = {
  primary: "#0B3B60", // Azul escuro — botões principais, bordas de inputs, labels.
  primaryDark: "#082846", // Azul ainda mais escuro — reservado para variações futuras.
  accent: "#2196F3", // Azul claro — logo, links e destaques.
  textPrimary: "#333333", // Cor padrão de texto — quase preto, mais suave que #000.
  textSecondary: "#6B7280", // Cinza médio — textos secundários, subtítulos.
  inputBackground: "#F4F4F4", // Fundo levemente acinzentado dos campos de texto.
  inputBorder: "#E5E7EB", // Borda dos campos de texto em estado normal.
  placeholder: "#9CA3AF", // Cor do texto de placeholder (dica dentro do campo vazio).
  white: "#FFFFFF", // Branco — texto em botões e elementos no fundo escuro.
  disabled: "#A3A3A3", // Cinza — fundo do botão "Voltar" (variante secundária).
  background: "#FFFFFF",
  backgroundDark: "#000000", // Preto — fundo da tela 3 (escolha do perfil).
  error: "#DC2626", // Vermelho — bordas e mensagens de erro.

  // Cores extras usadas só nas telas internas (status das reservas e avisos).
  errorSurface: "#FEE2E2",
  success: "#15803D",
  successSurface: "#DCFCE7",
  warning: "#B45309",
  warningSurface: "#FEF3C7",
  surface: "#F5F5F5", // Fundo de cartões e indicadores.
  overlay: "rgba(17, 24, 39, 0.5)", // Fundo escurecido atrás das caixas de confirmação.
};

export default colors; // Exporta o objeto para que outros arquivos possam importar.
