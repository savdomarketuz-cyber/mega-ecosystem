// src/components/layout/MainLayout.tsx (YAKUNIY, ENG TO'G'RI VERSIYA)

import { Layout, Menu, Badge, Button } from 'antd';
import { 
    ShoppingCartOutlined, 
    HomeOutlined, 
    UserOutlined, 
    LoginOutlined, 
    LogoutOutlined,
    UnorderedListOutlined 
} from '@ant-design/icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const menuItems = [
    { key: '1', icon: <HomeOutlined />, label: <Link to="/">Bosh sahifa</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 10, 
          width: '100%',
          display: 'flex', 
          alignItems: 'center',
          padding: '0 24px' // Yon tomondan bo'sh joy
      }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          <Link to="/" style={{ color: 'white' }}>Online Shop</Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          style={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', marginLeft: '50px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/cart" style={{ marginRight: '20px' }}>
            <Badge count={cartItemCount} size="small">
              <ShoppingCartOutlined style={{ color: 'white', fontSize: '24px' }} />
            </Badge>
          </Link>
          {token ? (
            <>
              <Link to="/orders" style={{ marginRight: '15px' }}>
                <Button type="text" style={{color: 'white'}} icon={<UnorderedListOutlined />}>Buyurtmalarim</Button>
              </Link>
              <Link to="/profile" style={{ marginRight: '15px' }}>
                <Button type="text" style={{color: 'white'}} icon={<UserOutlined />}>Profil</Button>
              </Link>
              <Button type="text" style={{color: 'white'}} icon={<LogoutOutlined />} onClick={handleLogout}>Chiqish</Button>
            </>
          ) : (
            <Link to="/login">
              <Button type="text" style={{color: 'white'}} icon={<LoginOutlined />}>Kirish</Button>
            </Link>
          )}
        </div>
      </Header>

      <Content style={{ padding: '24px' }}> {/* Tashqi padding endi shu yerda */}
        <div style={{ background: '#fff', minHeight: 'calc(100vh - 180px)', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Online Shop ©{new Date().getFullYear()} Created by You
      </Footer>
    </Layout>
  );
};

export default MainLayout;