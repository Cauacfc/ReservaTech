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
  createMesa,
  createRestaurante,
  deleteMesa,
  getMesas,
  getRestaurantesDoGerente,
  updateMesa,
} from "../services/api";

/*
 * Guarda o restaurante do gerente logado e as mesas dele (CRUD de mesas, US05),
 * no mesmo estilo do ProductsContext do app de produtos.
 */
const RestauranteContext = createContext(null);

export function RestauranteProvider({ children }) {
  const { usuario } = useAuth();
  const [restaurante, setRestaurante] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ -> busca o restaurante do gerente e as mesas dele.
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lista = await getRestaurantesDoGerente(usuario.id);
      const encontrado = lista[0] ?? null;
      setRestaurante(encontrado);
      setMesas(encontrado ? await getMesas(encontrado.id) : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [usuario.id]);

  useEffect(() => {
    load();
  }, [load]);

  // CREATE -> cadastra o restaurante do gerente.
  const saveRestaurante = useCallback(
    async (dados) => {
      const criado = await createRestaurante({ ...dados, gerenteId: usuario.id });
      setRestaurante(criado);
      setMesas([]);
      setError(null);
      return criado;
    },
    [usuario.id]
  );

  // CREATE (sem id) ou UPDATE (com id) de mesa.
  const saveMesa = useCallback(
    async (dados, id) => {
      const isNew = id == null;
      const saved = isNew
        ? await createMesa(restaurante.id, dados)
        : await updateMesa(id, dados);
      setMesas((current) =>
        isNew
          ? [...current, saved].sort((a, b) => a.numero - b.numero)
          : current.map((mesa) => (mesa.id === id ? saved : mesa))
      );
      setError(null);
      return saved;
    },
    [restaurante]
  );

  // DELETE -> remove a mesa (a API recusa se ela tiver reservas).
  const removeMesa = useCallback(async (id) => {
    try {
      await deleteMesa(id);
    } catch (e) {
      if (e.status !== 404) {
        throw e;
      }
    }
    setMesas((current) => current.filter((mesa) => mesa.id !== id));
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      restaurante,
      mesas,
      loading,
      error,
      load,
      saveRestaurante,
      saveMesa,
      removeMesa,
    }),
    [restaurante, mesas, loading, error, load, saveRestaurante, saveMesa, removeMesa]
  );

  return (
    <RestauranteContext.Provider value={value}>
      {children}
    </RestauranteContext.Provider>
  );
}

export function useRestaurante() {
  const context = useContext(RestauranteContext);
  if (!context) {
    throw new Error("useRestaurante precisa ser usado dentro de <RestauranteProvider>.");
  }
  return context;
}
