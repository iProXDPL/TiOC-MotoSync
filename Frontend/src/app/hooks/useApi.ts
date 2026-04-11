import { useAuth } from "@clerk/react";
import { useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export function useApi() {
  const { getToken } = useAuth();

  const fetchWithToken = useCallback(
    async (endpoint: string, method: HttpMethod = "GET", body?: any) => {
      try {
        // 1. Zdobądź token JWT z Clerka
        const token = await getToken();

        // 2. Skonfiguruj nagłówki
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Dla testowego środowiska (nagłówek x-mock-role, można odkomentować podczas testów roli)
        // headers["x-mock-role"] = "mechanic"; 

        // 3. Wykonaj żądanie API
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        // 4. Jeśli serwer zwróci 204 No Content, po prostu zakończ bez błędu.
        if (response.status === 204) {
          return null;
        }

        // 5. Odbierz i przetwórz odpowiedź jako JSON, chyba, że ktoś próbuje usunąć (zwraca czasami po prostu OK).
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.error || `API Error: ${response.statusText}`);
        }

        return data;
      } catch (error: any) {
        console.error("API Call failed:", error.message);
        throw error;
      }
    },
    [getToken]
  );

  return {
    get: (endpoint: string) => fetchWithToken(endpoint, "GET"),
    post: (endpoint: string, body: any) => fetchWithToken(endpoint, "POST", body),
    put: (endpoint: string, body: any) => fetchWithToken(endpoint, "PUT", body),
    del: (endpoint: string) => fetchWithToken(endpoint, "DELETE"),
  };
}
