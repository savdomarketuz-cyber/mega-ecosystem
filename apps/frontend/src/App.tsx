// src/App.tsx fayli uchun YAKUNIY VA TOZA KOD

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Asosiy qoliplar
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./pages/admin/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";

// Foydalanuvchi sahifalari
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";

// Admin sahifalari
import DashboardPage from "./pages/admin/DashboardPage";
import OrdersAdminPage from "./pages/admin/OrdersAdminPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import UsersPage from "./pages/admin/UsersPage";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Foydalanuvchi uchun sahifalar (MainLayout qolipi ichida) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* 2. Qolipsiz sahifa (Login) */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Admin marshrutlari (PrivateRoute va AdminLayout qolipi ichida) */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* /admin/ ichidagi sahifalar */}
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

      </Routes>
    </Router>
  );
}