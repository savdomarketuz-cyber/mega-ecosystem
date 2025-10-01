// frontend/src/pages/OrdersPage.tsx (YAKUNIY, TO'G'RI KOD)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { List, Typography, Spin, Alert, Tag, Card } from 'antd';

const { Title, Text } = Typography;

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError("Buyurtmalarni yuklashda xatolik yuz berdi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'blue';
      case 'COLLECTING': return 'processing';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  }
  if (error) {
    return <Alert message="Xatolik" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <Title level={2}>📜 Mening Buyurtmalarim</Title>
      <List
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <Card style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>Buyurtma #{order.id}</Text><br />
                  <Text type="secondary">Sana: {new Date(order.createdAt).toLocaleDateString()}</Text>
                </div>
                <div>
                  <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                </div>
                <div>
                  <Text strong>{order.totalPrice.toLocaleString()} so'm</Text>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrdersPage;