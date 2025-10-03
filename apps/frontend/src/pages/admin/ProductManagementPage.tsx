import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Space, Row, Col, Switch, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { TableProps } from 'antd';
const { Title } = Typography; // <-- SHU QATORNI QO'SHING
interface Product {
  id: number; name: string; description?: string; price: number; stock: number;
  categoryId: number; imageUrl?: string; attributes?: any;
}
interface Category { id: number; name: string; }

const ProductManagementPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

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
    } catch (error) { message.error("Ma'lumotlarni yuklashda xatolik!"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const showModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const attributesArray = product.attributes ? Object.entries(product.attributes).map(([key, value]) => ({ key, value })) : [];
      form.setFieldsValue({ ...product, attributes: attributesArray });
    } else {
      setEditingProduct(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleFinish = async (values: any) => {
    try {
      if (values.attributes) {
        const attributesObject = values.attributes.reduce((obj: any, item: any) => {
          if (item && item.key) { obj[item.key] = item.value; }
          return obj;
        }, {});
        values.attributes = attributesObject;
      } else {
        values.attributes = {};
      }
      const token = localStorage.getItem('token');
      const method = editingProduct ? 'put' : 'post';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      await axios[method](`http://localhost:3001${url}`, values, { headers: { Authorization: `Bearer ${token}` } });
      message.success(`Mahsulot muvaffaqiyatli ${editingProduct ? "yangilandi" : "qo'shildi"}!`);
      setIsModalOpen(false);
      fetchData();
    } catch (error) { message.error("Operatsiyada xatolik!"); }
  };

  const handleDelete = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      message.success("Mahsulot muvaffaqiyatli o'chirildi!");
      fetchData();
    } catch (error) { message.error("Mahsulotni o'chirishda xatolik!"); }
  };

  const columns: TableProps<Product>['columns'] = [
    { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'Nomi', dataIndex: 'name', key: 'name' },
    { title: 'Narxi', dataIndex: 'price', key: 'price', render: (price) => `${price.toLocaleString()} so'm`},
    { title: 'Qoldiq', dataIndex: 'stock', key: 'stock' },
    { title: 'Amallar', key: 'action', render: (_, record) => ( <Space size="middle"> <a onClick={() => showModal(record)}>Tahrirlash</a> <Popconfirm title="O'chirish" description="Haqiqatan ham o'chirmoqchimisiz?" onConfirm={() => handleDelete(record.id)} okText="Ha" cancelText="Yo'q"><a>O'chirish</a></Popconfirm> </Space> ),},
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>Yangi mahsulot qo'shish</Button>
      <Table loading={loading} columns={columns} dataSource={products} rowKey="id" />
      <Modal title={editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="1. Sarlavha" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="categoryId" label="2. Kategoriya" rules={[{ required: true }]}><Select placeholder="Tanlang">{categories.map(c => (<Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>))}</Select></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="internalSku" label="4. Tavar SKU kodi" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="barcode" label="8. Shtrix kod (ixtiyoriy)"><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="description" label="11. Tavar tavsifi" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="brand" label="9. Brend" rules={[{ required: true }]}><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="countryOfOrigin" label="7. Ishlab chiqarilgan mamlakat" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="imageUrl" label="5. Asosiy rasm manzili (URL)"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="videoUrl" label="6. Video manzili (URL, ixtiyoriy)"><Input /></Form.Item></Col>
          </Row>
          <Title level={5}>12. Tavar o'lchamlari</Title>
          <Row gutter={16}>
            <Col span={6}><Form.Item name="width" label="Kenglik (mm)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item name="height" label="Balandlik (mm)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item name="length" label="Uzunlik (mm)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={6}><Form.Item name="weight" label="Og'irlik (gr)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Title level={5}>16. Variantlar (sodda)</Title>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="color" label="Rangi (ixtiyoriy)"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="size" label="O'lchami (masalan, XL, 42) (ixtiyoriy)"><Input /></Form.Item></Col>
          </Row>
          <Title level={5}>Narx va Qoldiq</Title>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="price" label="17. Sotilish narxi (so'm)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="oldPrice" label="18. Eski narxi (ixtiyoriy)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="stock" label="19. Ombordagi soni" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Title level={5}>Boshqa</Title>
          <Row gutter={16} align="bottom">
            <Col span={8}><Form.Item name="shelfLifeMonths" label="13. Yaroqlilik muddati (oy)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="ageRestriction" label="14. Yosh cheklovi"><Select placeholder="Tanlang" allowClear>{[0, 6, 12, 16, 18].map(age => <Select.Option key={age} value={age}>{age}+</Select.Option>)}</Select></Form.Item></Col>
            <Col span={8}><Form.Item name="isAdult" label="15. Kattalar uchun" valuePropName="checked"><Switch /></Form.Item></Col>
          </Row>
          <Title level={5}>10. Qo'shimcha parametrlar</Title>
          <Form.List name="attributes">
            {(fields, { add, remove }) => (<> {fields.map(field => ( <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline"> <Form.Item {...field} name={[field.name, 'key']} rules={[{ required: true, message: 'Nomi' }]}><Input placeholder="Parametr nomi" /></Form.Item> <Form.Item {...field} name={[field.name, 'value']} rules={[{ required: true, message: 'Qiymati' }]}><Input placeholder="Qiymati" /></Form.Item> <DeleteOutlined onClick={() => remove(field.name)} /> </Space> ))} <Form.Item><Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Parametr qo'shish</Button></Form.Item> </>)}
          </Form.List>
          <Form.Item style={{marginTop: 24}}><Button type="primary" htmlType="submit">Saqlash</Button></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagementPage;