import axios from "axios";

// Point this at your Django backend. Override at build time with
// VITE_API_BASE_URL, e.g. in a .env file: VITE_API_BASE_URL=https://api.yourdomain.com
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Endpoints that must never carry an Authorization header — they're public,
// and a stale/expired token sitting in localStorage would otherwise get
// rejected by JWTAuthentication with a 401 *before* Django even checks that
// the endpoint allows anonymous access.
//
// NOTE: this used to be a plain `url.includes(path)` check, which wrongly
// matched "/auth/users/me/" against the "/auth/users/" registration path
// (since "me/" is inside it as a substring) and stripped the token off the
// one authenticated call that needs it right after login. Registration is
// matched exactly; the others are safe as prefix matches.
function isPublicPath(url = "") {
  if (url === "/auth/users/") return true; // registration only, NOT /auth/users/me/
  if (url.startsWith("/auth/jwt/create/")) return true;
  if (url.startsWith("/auth/jwt/refresh/")) return true;
  if (url.startsWith("/api/v1/pay/")) return true;
  return false;
}

client.interceptors.request.use((config) => {
  if (isPublicPath(config.url)) {
    delete config.headers.Authorization;
    return config;
  }
  const token = localStorage.getItem("payflow_access");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// If a request fails with 401, try refreshing the access token once, then
// replay the original request. If refresh also fails, boot the user out.
let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isPublicPath(original.url)
    ) {
      original._retry = true;
      const refresh = localStorage.getItem("payflow_refresh");
      if (!refresh) {
        localStorage.removeItem("payflow_access");
        return Promise.reject(error);
      }
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/jwt/refresh/`, { refresh })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        localStorage.setItem("payflow_access", data.access);
        original.headers.Authorization = `JWT ${data.access}`;
        return client(original);
      } catch (refreshError) {
        localStorage.removeItem("payflow_access");
        localStorage.removeItem("payflow_refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;

// ---- Auth ----
export const login = (username, password) =>
  client.post("/auth/jwt/create/", { username, password });

export const register = (payload) => client.post("/auth/users/", payload);

export const fetchMe = () => client.get("/auth/users/me/");
export const updateMe = (payload) => client.patch("/auth/users/me/", payload);
export const changePassword = (payload) => client.post("/auth/users/set_password/", payload);

// ---- Payment profiles ----
export const listProfiles = () => client.get("/api/v1/profile/");
export const createProfile = (payload) => client.post("/api/v1/profile/", payload);
export const deleteProfile = (id) => client.delete(`/api/v1/profile/${id}/`);

// ---- Checkout pages ----
export const listCheckoutPages = () => client.get("/api/v1/checkout/");
export const createCheckoutPage = (payload) => client.post("/api/v1/checkout/", payload);
export const deleteCheckoutPage = (id) => client.delete(`/api/v1/checkout/${id}/`);
export const updateCheckoutPage = (id, payload) => client.patch(`/api/v1/checkout/${id}/`, payload);

// ---- Public checkout (no auth) ----
export const getPublicCheckout = (publicId) => client.get(`/api/v1/pay/${publicId}/`);
export const submitStkPush = (publicId, payload) => client.post(`/api/v1/pay/${publicId}/`, payload);

// ---- Transactions (read-only) ----
export const listTransactions = () => client.get("/api/v1/transactions/");
export const getTransaction = (id) => client.get(`/api/v1/transactions/${id}/`);
// ---- Merchant wallet ----
export const getWallet = (profileId) => client.get(`/api/v1/wallet/${profileId}/`);
export const withdrawWallet = (profileId) => client.post(`/api/v1/wallet/${profileId}/withdraw/`);
export const getWalletTable = () => client.get("/api/v1/wallet/table/");