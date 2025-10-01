// src/pages/admin/CategoryManagementPage.tsx uchun TO'LIQ KOD

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      message.error("Kategoriyalarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditingCategory(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const method = editingCategory ? 'put' : 'post';
      const url = editingCategory 
        ? `http://localhost:3001/api/categories/${editingCategory.id}` 
        : 'http://localhost:3001/api/categories';

      await axios[method](url, values, { headers: { Authorization: `Bearer ${token}` } });

      message.success(`Kategoriya muvaffaqiyatli ${editingCategory ? "yangilandi" : "qo'shildi"}!`);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      message.error("Operatsiyada xatolik!");
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Kategoriya muvaffaqiyatli o'chirildi!");
      fetchData();
    } catch (error) {
      message.error("Kategoriyani o'chirishda xatolik!");
    }
  };

  const columns: TableProps<Category>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { 
      title: 'Asosiy Kategoriya', 
      dataIndex: 'parentId', 
      key: 'parentId',
      render: (parentId) => categories.find(c => c.id === parentId)?.name || '-'
    },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>Tahrirlash</a>
          <Popconfirm
            title="Kategoriyani o'chirish"
            description="Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <a>O'chirish</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Yangi kategoriya qo'shish
      </Button>
      <Table loading={loading} columns={columns} dataSource={categories} rowKey="id" />

      <Modal
        title={editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya qo'shish"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Kategoriya Nomi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="Asosiy Kategoriyasi (ixtiyoriy)">
            <Select placeholder="Asosiy kategoriyani tanlang" allowClear>
              {categories.filter(c => c.id !== editingCategory?.id).map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage;