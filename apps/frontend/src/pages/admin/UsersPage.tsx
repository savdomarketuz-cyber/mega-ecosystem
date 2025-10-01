// src/pages/admin/UsersPage.tsx uchun TO'LIQ KOD

import { useState, useEffect } from 'react';
import { Table, Tag, message, Spin } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';

interface User {
  id: number;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        message.error("Foydalanuvchilarni yuklashda xatolik!");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Ismi', dataIndex: 'name', key: 'name', render: (name) => name || 'Noma\'lum' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Roli',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'volcano' : 'geekblue'}>{role}</Tag>
      ),
      filters: [
        { text: 'ADMIN', value: 'ADMIN' },
        { text: 'CUSTOMER', value: 'CUSTOMER' },
      ],
      onFilter: (value, record) => record.role.indexOf(value as string) === 0,
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table columns={columns} dataSource={users} rowKey="id" />
    </Spin>
  );
};

export default UsersPage;