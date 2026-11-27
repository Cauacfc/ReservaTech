import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { cadastrar as apiCadastrar, login as apiLogin } from "../services/api";

/*
 * Guarda o usuário logado (cliente ou gerente) para todas as telas.
 * Quando "usuario" é null, o app mostra apenas as telas de login e cadastro.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const entrar = useCallback(async (email, senha) => {
    setUsuario(await apiLogin(email.trim(), senha));
  }, []);

  // Cadastra e já entra no app com o usuário criado.
  const cadastrar = useCallback(async (dados) => {
    const criado = await apiCadastrar(dados);
    setUsuario(criado);
    return criado;
  }, []);

  const sair = useCallback(() => setUsuario(null), []);

  const value = useMemo(
    () => ({ usuario, entrar, cadastrar, sair }),
    [usuario, entrar, cadastrar, sair]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para as telas: const { usuario, sair } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>.");
  }
  return context;
}
