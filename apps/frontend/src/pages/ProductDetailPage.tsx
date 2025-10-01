// frontend/src/pages/ProductDetailPage.tsx (YAKUNIY, TO'G'RI KOD)

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Typography, Spin, Alert, Button, Row, Col, message } from 'antd';
import { useCart } from '../context/CartContext';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number; name: string; description: string | null;
  price: number; stock: number; imageUrl: string | null;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3001/api/products/${id}`);
          setProduct(response.data);
          setError(null);
        } catch (err) {
          setError("Mahsulotni yuklashda xatolik yuz berdi.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      message.success(`'${product.name}' savatga qo'shildi!`);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  if (error) return <Alert message="Xatolik" description={error} type="error" showIcon />;
  if (!product) return <Alert message="Ma'lumot yo'q" description="Bunday mahsulot topilmadi." type="warning" showIcon />;

  return (
    <div>
      <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={16} xl={14}>
          <Card bordered={false}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <img
                  alt={product.name}
                  src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/800`}
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title level={2}>{product.name}</Title>
                <Paragraph type="secondary">{product.description || "Mahsulot haqida ma'lumot yo'q."}</Paragraph>
                <Title level={3} style={{ color: '#1890ff', margin: '20px 0' }}>{product.price.toLocaleString()} so'm</Title>
                <Text strong type={product.stock > 0 ? 'success' : 'danger'}>
                  Omborda: {product.stock > 0 ? `${product.stock} dona mavjud` : 'Mavjud emas'}
                </Text>
                <br /><br />
                <Button type="primary" size="large" onClick={handleAddToCart} disabled={product.stock === 0} style={{ marginTop: '20px' }}>
                  Savatga qo‘shish
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;