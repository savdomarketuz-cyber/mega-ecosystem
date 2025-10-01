// src/pages/admin/DashboardPage.tsx uchun TO'LIQ KOD

import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message, Spin } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import axios from 'axios';

interface Stats {
  users: number;
  products: number;
  orders: number;
  revenue: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        message.error("Statistikani yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Jami Foydalanuvchilar"
            value={stats?.users}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Jami Mahsulotlar"
            value={stats?.products}
            prefix={<AppstoreOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Jami Buyurtmalar"
            value={stats?.orders}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Jami Savdo"
            value={stats?.revenue}
            precision={0}
            prefix={<DollarCircleOutlined />}
            suffix="so'm"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardPage;