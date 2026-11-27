import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import {
  cancelarReserva,
  createReserva,
  getReservasDoCliente,
} from "../services/api";

/*
 * Guarda as reservas do cliente logado. A tela "Minhas reservas" e a tela de
 * "Nova reserva" enxergam sempre os mesmos dados.
 */
const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ -> busca as reservas do cliente na API.
  const loadReservas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReservas(await getReservasDoCliente(usuario.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [usuario.id]);

  useEffect(() => {
    loadReservas();
  }, [loadReservas]);

  // CREATE -> faz uma reserva e coloca no topo da lista.
  const saveReserva = useCallback(
    async (dados) => {
      const saved = await createReserva({ ...dados, clienteId: usuario.id });
      setReservas((current) => [saved, ...current]);
      setError(null);
      return saved;
    },
    [usuario.id]
  );

  // UPDATE -> cancela a reserva (a API aplica a regra de 1 hora de antecedência).
  const cancelReserva = useCallback(
    async (id) => {
      const updated = await cancelarReserva(id, usuario.id);
      setReservas((current) =>
        current.map((reserva) => (reserva.id === id ? updated : reserva))
      );
      setError(null);
    },
    [usuario.id]
  );

  const value = useMemo(
    () => ({ reservas, loading, error, loadReservas, saveReserva, cancelReserva }),
    [reservas, loading, error, loadReservas, saveReserva, cancelReserva]
  );

  return (
    <ReservasContext.Provider value={value}>{children}</ReservasContext.Provider>
  );
}

export function useReservas() {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error("useReservas precisa ser usado dentro de <ReservasProvider>.");
  }
  return context;
}
