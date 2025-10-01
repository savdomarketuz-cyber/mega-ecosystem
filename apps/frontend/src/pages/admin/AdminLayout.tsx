// src/pages/admin/AdminLayout.tsx uchun TO'G'RI KOD

import { Layout, Menu } from 'antd';
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, TagsOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "white", padding: 16, fontSize: 18, textAlign: 'center' }}>
          <Link to="/admin" style={{ color: 'white' }}>Admin Panel</Link>
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/orders">Buyurtmalar</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<AppstoreOutlined />}>
            <Link to="/admin/products">Mahsulotlar</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<TagsOutlined />}>
            <Link to="/admin/categories">Kategoriyalar</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>
            <Link to="/admin/users">Foydalanuvchilar</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 24 }}>
          <h2>Admin Boshqaruvi</h2>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {/* Barcha admin sahifalari shu yerda ko'rsatiladi */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;