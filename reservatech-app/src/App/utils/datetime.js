// Conversões entre o formato exibido (dd/mm/aaaa, hh:mm) e o formato da API (aaaa-mm-dd, hh:mm).

function pad(n) {
  return String(n).padStart(2, "0");
}

// Date -> "2026-12-25" (usa a data local, não UTC)
export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(iso, days) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

// "2026-12-25" -> "25/12/2026"
export function formatDateBR(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// "25/12/2026" -> "2026-12-25". Devolve null quando a data não existe.
export function parseDateBR(text) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text || "");
  if (!match) return null;
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  const valid =
    date.getFullYear() === Number(y) &&
    date.getMonth() === Number(m) - 1 &&
    date.getDate() === Number(d);
  return valid ? `${y}-${m}-${d}` : null;
}

// "19:30:00" -> "19:30"
export function formatTime(time) {
  return (time || "").slice(0, 5);
}

// "19:30" -> "19:30" (valida hh:mm). Devolve null quando inválido.
export function parseTime(text) {
  const match = /^(\d{2}):(\d{2})$/.exec(text || "");
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h <= 23 && m <= 59 ? text : null;
}
