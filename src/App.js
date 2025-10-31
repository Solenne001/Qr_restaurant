import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages client
import Layout from "./Pages/Layout";
import Menu from "./Pages/Menu";
import Cart from "./Pages/Cart";
import Order from "./Pages/Order";

// Pages admin
import AdminLayout from "./Admin/Components/AdminLayout";
import Dashboard from "./Admin/Pages/Dashboard";
import MenuManagement from "./Admin/Pages/MenuManagements";
import Orders from "./Admin/Pages/Orders";
import Login from "./Admin/Pages/Register";
import QrAdmin from "./Admin/Pages/QrAdmin";

// Contexts
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [clientInfo, setClientInfo] = useState({
    name: "",
    table: "",
    type: "",
  });

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={8000} pauseOnHover />

          <Routes>
            {/* ✅ MENU devient page principale */}
            <Route path="/" element={<Layout clientInfo={clientInfo} />}>
              <Route index element={<Menu clientInfo={clientInfo} />} />
              <Route path="cart" element={<Cart clientInfo={clientInfo} />} />
              <Route path="order" element={<Order clientInfo={clientInfo} />} />
            </Route>

            {/* Admin Login */}
            <Route path="/login" element={<Login />} />

            {/* ✅ Routes Admin protégées */}
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="orders" element={<Orders />} />
              <Route path="qr" element={<QrAdmin />} />
            </Route>

            {/* Redirection si mauvaise URL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
