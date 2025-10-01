// src/pages/admin/ProductManagementPage.tsx (YAKUNIY, TO'LIQ VERSION)

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Space } from 'antd';
import axios from 'axios';
import type { TableProps } from 'antd';

// Tiplar
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}
interface Category {
  id: number;
  name: string;
}

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // <-- Tahrirlanayotgan mahsulotni saqlash uchun
  const [form] = Form.useForm();

  // Ma'lumotlarni backend'dan yuklash
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/products', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3001/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      message.error("Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal oynani ochish (yangi yoki tahrirlash uchun)
  const showModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue(product); // Formani mahsulot ma'lumotlari bilan to'ldirish
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Formani yuborish (yangi yoki tahrirlangan mahsulotni saqlash)
  const handleFinish = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const method = editingProduct ? 'put' : 'post';
      const url = editingProduct 
        ? `http://localhost:3001/api/products/${editingProduct.id}` 
        : 'http://localhost:3001/api/products';

      await axios[method](url, values, { headers: { Authorization: `Bearer ${token}` } });
      
      message.success(`Mahsulot muvaffaqiyatli ${editingProduct ? "yangilandi" : "qo'shildi"}!`);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      message.error("Operatsiyada xatolik!");
    }
  };

  // Mahsulotni o'chirish
  const handleDelete = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Mahsulot muvaffaqiyatli o'chirildi!");
      fetchData();
    } catch (error) {
      message.error("Mahsulotni o'chirishda xatolik!");
    }
  };

  // Jadval ustunlari (yangi "Amallar" ustuni bilan)
  const columns: TableProps<Product>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Nomi', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Narxi', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} so'm`, sorter: (a, b) => a.price - b.price },
    { title: 'Qoldiq', dataIndex: 'stock', key: 'stock', sorter: (a, b) => a.stock - b.stock },
    {
      title: 'Amallar',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>Tahrirlash</a>
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?"
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
        Yangi mahsulot qo'shish
      </Button>
      <Table loading={loading} columns={columns} dataSource={products} rowKey="id" />

      <Modal
        title={editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            {/* ... Form.Item'lar o'zgarishsiz qoladi ... */}
            <Form.Item name="name" label="Mahsulot Nomi" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="description" label="Tavsifi"><Input.TextArea /></Form.Item>
            <Form.Item name="price" label="Narxi" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="stock" label="Ombordagi Soni" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="categoryId" label="Kategoriyasi" rules={[{ required: true }]}>
            <Select placeholder="Kategoriyani tanlang">
                {categories.map(cat => ( <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option> ))}
            </Select>
            </Form.Item>
            <Form.Item name="imageUrl" label="Rasm Manzili (URL)"><Input /></Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit">Saqlash</Button>
            </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;