import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Usuario, AuthResponse } from "../types";
import { apiService } from "../services/api";

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (login: string, senha: string) => Promise<void>;
  cadastro: (dados: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  hydrateFromLegacyStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (login: string, senha: string) => {
        try {
          set({ isLoading: true, error: null });

          const response: AuthResponse = await apiService.login({
            login,
            senha,
          });

          // DEBUG: logar usuário recebido no login
          console.log("[authStore.login] Usuario recebido:", response.usuario);

          // Salvar token e usuário no localStorage
          localStorage.setItem("kaoskampf_token", response.access_token);
          localStorage.setItem(
            "kaoskampf_user",
            JSON.stringify(response.usuario),
          );

          // Salvar cookie para o middleware (lido no servidor)
          try {
            const authData = {
              token: response.access_token,
              user: response.usuario,
            };
            document.cookie = `kaoskampf-auth=${encodeURIComponent(
              JSON.stringify(authData),
            )}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 dias
            console.log("[authStore.login] Cookie kaoskampf-auth salvo");
          } catch (e) {
            console.warn(
              "[authStore.login] Falha ao salvar cookie kaoskampf-auth",
              e,
            );
          }

          set({
            usuario: response.usuario,
            token: response.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Erro ao fazer login",
          });
          throw error;
        }
      },

      cadastro: async (dados: any) => {
        try {
          set({ isLoading: true, error: null });

          await apiService.cadastro(dados);

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Erro ao fazer cadastro",
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("kaoskampf_token");
        localStorage.removeItem("kaoskampf_user");

        set({
          usuario: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Hidratar store a partir do legacy localStorage (kaoskampf_user / kaoskampf_token)
      hydrateFromLegacyStorage: () => {
        if (typeof window === "undefined") return;

        const state = get();
        if (state.usuario) return; // já hidratado

        try {
          const legacyUser = localStorage.getItem("kaoskampf_user");
          const legacyToken = localStorage.getItem("kaoskampf_token");

          if (legacyUser && legacyToken) {
            const parsedUser: Usuario = JSON.parse(legacyUser);
            console.log(
              "[authStore] Hydratando de legacy storage:",
              parsedUser,
            );
            set({
              usuario: parsedUser,
              token: legacyToken,
              isAuthenticated: true,
            });
          }
        } catch (e) {
          console.warn("[authStore] Falha ao hidratar legacy storage", e);
        }
      },
    }),
    {
      name: "kaoskampf-auth",
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
