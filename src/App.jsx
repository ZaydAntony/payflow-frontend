import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import CheckoutPages from "./pages/CheckoutPages";
import Transactions from "./pages/Transactions";
import Account from "./pages/Account";
import PublicCheckout from "./pages/PublicCheckout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pay/:publicId" element={<PublicCheckout />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profiles />} />
        <Route path="checkout-pages" element={<CheckoutPages />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}