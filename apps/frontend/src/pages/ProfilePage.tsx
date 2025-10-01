// frontend/src/pages/ProfilePage.tsx fayli uchun TO'LIQ KOD

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Avatar, Typography, Spin, Alert, Button, message } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface UserProfile {
  id: number;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Brauzer xotirasidan tokenni olamiz
      const token = localStorage.getItem('token');

      if (!token) {
        setError("Siz tizimga kirmagansiz.");
        setLoading(false);
        navigate('/login'); // Agar token bo'lmasa, login sahifasiga jo'natamiz
        return;
      }

      try {
        // 2. Token bilan birga backend'ga so'rov yuboramiz
        const response = await axios.get('http://localhost:3001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}` // <--- Eng muhim qism!
          }
        });
        setUser(response.data);
      } catch (err) {
        setError("Profil ma'lumotlarini yuklashda xatolik.");
        localStorage.removeItem('token'); // Yaroqsiz tokenni o'chiramiz
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    // Tokanni xotiradan o'chiramiz
    localStorage.removeItem('token');
    message.success("Tizimdan muvaffaqiyatli chiqdingiz!");
    // Login sahifasiga qaytamiz
    navigate('/login');
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  }

  if (error) {
    return <Alert message="Xatolik" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <Title level={3} style={{ marginTop: 16 }}>{user?.name || 'Noma\'lum Foydalanuvchi'}</Title>
        </div>
        <div style={{ marginTop: 24 }}>
          <p><MailOutlined /> <Text strong>Email:</Text> {user?.email}</p>
          <p><UserOutlined /> <Text strong>Rol:</Text> {user?.role}</p>
          <p><CalendarOutlined /> <Text strong>Ro'yxatdan o'tgan sana:</Text> {new Date(user!.createdAt).toLocaleDateString()}</p>
        </div>
        <Button 
          type="primary" 
          danger 
          onClick={handleLogout} 
          style={{ width: '100%', marginTop: '24px' }}
        >
          Tizimdan chiqish
        </Button>
      </Card>
    </div>
  );
};

export default ProfilePage;