import { createContext, useContext, useMemo } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const ApiCtx = createContext(null);

export const ApiProvider = ({ children }) => {
  const { getToken } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL;

  const client = useMemo(() => {
    const instance = axios.create({ baseURL });

    // Attach token if available (works for admin, comments, bookmarks)
    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken({ template: "backend" }); // use your JWT template
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // no-op (public requests still work)
      }
      return config;
    });

    return instance;
  }, [baseURL, getToken]);

  return <ApiCtx.Provider value={client}>{children}</ApiCtx.Provider>;
};

export const useApi = () => {
  const ctx = useContext(ApiCtx);
  if (!ctx) throw new Error("useApi must be used inside ApiProvider");
  return ctx;
};
