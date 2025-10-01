// src/pages/admin/OrdersAdminPage.tsx (YAKUNIY VA TO'LIQ KOD)

import { useState, useEffect } from 'react';
import { Table, Tag, Select, message, Spin } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';

// Ma'lumotlar uchun interfeyslar
interface User {
  name: string | null;
  email: string;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: User; // Buyurtma egasi
}

// Mumkin bo'lgan statuslar ro'yxatini shu yerda e'lon qilamiz
const orderStatuses = ['NEW', 'COLLECTING', 'AWAITING_COURIER', 'WITH_COURIER', 'AT_PICKUP_POINT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const OrdersAdminPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      message.error("Buyurtmalarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`#${orderId} raqamli buyurtma statusi yangilandi!`);
      fetchOrders();
    } catch (error) {
      message.error("Statusni yangilashda xatolik!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) { case 'NEW': return 'blue'; case 'COLLECTING': return 'processing'; case 'DELIVERED': return 'success'; case 'CANCELLED': return 'error'; default: return 'default'; }
  };

  const columns: TableProps<Order>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Mijoz', dataIndex: 'user', key: 'user', render: (user) => user?.email || 'Noma\'lum' },
    { title: 'Sana', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Jami Summa', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => `${price.toLocaleString()} so'm`, sorter: (a, b) => a.totalPrice - b.totalPrice, },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 140 }} // Sal kattaroq qildim
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
        >
          {/* MANA SHU YER TO'G'RILANDI */}
          {orderStatuses.map((s) => (
            <Select.Option key={s} value={s}>
              <Tag color={getStatusColor(s)}>{s}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
      filters: orderStatuses.map(s => ({ text: s, value: s })),
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </Spin>
  );
};

export default OrdersAdminPage;