// src/App.tsx (YAKUNIY, SOZLAMALAR SAHIFASI BILAN)

import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  DashboardOutlined,
  SettingOutlined // <-- Yangi ikona
} from "@ant-design/icons";

// Asosiy qoliplar
import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./components/PrivateRoute";

// Foydalanuvchi sahifalari
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";

// Admin sahifalari
import DashboardPage from "./pages/admin/DashboardPage";
import OrdersAdminPage from "./pages/admin/OrdersAdminPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage"; // <-- Yangi sahifa importi

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Foydalanuvchi sahifalari */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />

        {/* Admin marshrutlari */}
        <Route
          path="/admin"
          element={<PrivateRoute role="ADMIN"><AdminLayoutComponent /></PrivateRoute>}
        >
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} /> {/* <-- Yangi marshrut */}
        </Route>
      </Routes>
    </Router>
  );
}

function AdminLayoutComponent() {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "white", padding: 16, fontSize: 18, textAlign: 'center' }}>
          <Link to="/admin" style={{ color: 'white' }}>Admin Panel</Link>
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}><Link to="/admin">Dashboard</Link></Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}><Link to="/admin/orders">Buyurtmalar</Link></Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}><Link to="/admin/products">Mahsulotlar</Link></Menu.Item>
          <Menu.Item key="4" icon={<TagsOutlined />}><Link to="/admin/categories">Kategoriyalar</Link></Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}><Link to="/admin/users">Foydalanuvchilar</Link></Menu.Item>
          <Menu.Item key="6" icon={<SettingOutlined />}><Link to="/admin/settings">Sozlamalar</Link></Menu.Item> {/* <-- Yangi menyu bandi */}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 24 }}><h2>Admin Boshqaruvi</h2></Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}