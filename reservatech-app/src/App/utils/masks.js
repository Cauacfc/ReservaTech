// Máscara de CEP: formata "12345678" como "12345-678"
export const CEP_MASK = [
  /\d/, // 1° dígito: aceita qualquer número (\d = 0-9)
  /\d/, // 2° dígito
  /\d/, // 3° dígito
  /\d/, // 4° dígito
  /\d/, // 5° dígito
  '-',  // Caractere fixo: o hífen é inserido automaticamente
  /\d/, // 6° dígito
  /\d/, // 7° dígito
  /\d/, // 8° dígito
];

// Máscara de telefone: formata "11912345678" como "(11) 91234-5678"
export const PHONE_MASK = [
  '(',  // Parêntese de abertura (inserido automaticamente)
  /\d/, // DDD - 1° dígito
  /\d/, // DDD - 2° dígito
  ')',  // Parêntese de fechamento
  ' ',  // Espaço fixo
  /\d/, /\d/, /\d/, /\d/, /\d/, // 5 dígitos do número
  '-',  // Hífen separador
  /\d/, /\d/, /\d/, /\d/, // 4 dígitos finais
];

// Remove tudo que não é dígito — útil para validar sem a formatação
export const onlyDigits = (value) =>
  (value || '').replace(/\D/g, '');
  // (value || '') → se value for null/undefined, usa string vazia
  // .replace(/\D/g, '') → apaga todos os não-dígitos (\D)
  // A flag 'g' = "global": substitui TODAS as ocorrências

// Validação básica de e-mail
export const isValidEmail = (email) => {
  if (!email) return false;            // Vazio → inválido
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // ^ → início | [^\s@]+ → chars antes do @ | @ → arroba
  // [^\s@]+ → domínio | \. → ponto literal | [^\s@]+$ → extensão até o fim
  return re.test(email.trim()); // .trim() remove espaços das bordas
};

// CEP deve ter exatamente 8 dígitos (após remover o hífen)
export const isValidCEP = (cep) => onlyDigits(cep).length === 8;
// Exemplo: "12345-678" → onlyDigits → "12345678" → length 8 → true

// Telefone: 10 dígitos (fixo) ou 11 dígitos (celular com 9°)
export const isValidPhone = (phone) => {
  const d = onlyDigits(phone).length;
  return d === 10 || d === 11;
};

// ---------- Máscaras aplicadas enquanto a pessoa digita ----------

// "11912345678" -> "(11) 91234-5678"
export function maskPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// "25122026" -> "25/12/2026"
export function maskDate(value) {
  const d = onlyDigits(value).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

// "1930" -> "19:30"
export function maskTime(value) {
  const d = onlyDigits(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}:${d.slice(2)}`;
}
