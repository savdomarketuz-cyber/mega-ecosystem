// src/pages/admin/OrdersAdminPage.tsx uchun YAGONA TO'G'RI KOD

import { useState, useEffect } from 'react';
import { Table, Tag, Select, message, Spin, Tabs } from 'antd';
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
  user: User;
}

// Mumkin bo'lgan statuslar ro'yxatini shu yerda e'lon qilamiz
const orderStatuses = ['NEW', 'COLLECTING', 'AWAITING_COURIER', 'WITH_COURIER', 'AT_PICKUP_POINT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURN_COMPLETED'];

const OrdersAdminPage = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllOrders(response.data);
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
      fetchOrders(); // Jadvalni yangilash
    } catch (error) {
      message.error("Statusni yangilashda xatolik!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'blue';
      case 'COLLECTING': return 'processing';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      case 'RETURN_REQUESTED': return 'warning';
      case 'RETURN_COMPLETED': return 'lime';
      default: return 'default';
    }
  };

  const columns: TableProps<Order>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Mijoz', dataIndex: 'user', key: 'user', render: (user) => user?.email || 'Noma\'lum' },
    { title: 'Sana', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
    { title: 'Jami Summa', dataIndex: 'totalPrice', key: 'totalPrice', render: (price) => `${price.toLocaleString()} so'm`, sorter: (a, b) => a.totalPrice - b.totalPrice },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 160 }}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
        >
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

  const newOrders = allOrders.filter(o => o.status === 'NEW');
  const returnRequests = allOrders.filter(o => ['RETURN_REQUESTED', 'RETURN_COMPLETED'].includes(o.status));
  const processingOrders = allOrders.filter(o => !['NEW', 'RETURN_REQUESTED', 'RETURN_COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status));
  const completedOrders = allOrders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status));

  const tabItems = [
    { key: '1', label: `Yangi (${newOrders.length})`, children: <Table columns={columns} dataSource={newOrders} rowKey="id" /> },
    { key: '2', label: `Qaytarish So'rovlari (${returnRequests.length})`, children: <Table columns={columns} dataSource={returnRequests} rowKey="id" /> },
    { key: '3', label: `Jarayonda (${processingOrders.length})`, children: <Table columns={columns} dataSource={processingOrders} rowKey="id" /> },
    { key: '4', label: `Yakunlangan (${completedOrders.length})`, children: <Table columns={columns} dataSource={completedOrders} rowKey="id" /> }
  ];

  return (
    <Spin spinning={loading}>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </Spin>
  );
};

export default OrdersAdminPage;