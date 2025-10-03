// src/pages/ProductDetailPage.tsx (YAKUNIY, TO'LIQ KOD)

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Spin, Alert, Button, Row, Col, message, Descriptions, Divider } from 'antd';
import { useCart } from '../context/CartContext';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number; name: string; description: string; price: number; stock: number;
  marketSku: string; brand: string; countryOfOrigin: string; width: number;
  height: number; length: number; weight: number; color: string | null;
  size: string | null; oldPrice: number | null; imageUrl: string | null;
  attributes: { [key: string]: string } | null;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cartItems, addToCart, decreaseQuantity } = useCart();

  useEffect(() => {
    if (id) {
      const fetchAllData = async () => {
        try {
          setLoading(true);
          const [productRes, deliveryRes] = await Promise.all([
              axios.get(`http://localhost:3001/api/products/${id}`),
              axios.get(`http://localhost:3001/api/products/${id}/delivery-estimate`)
          ]);
          setProduct(productRes.data);
          setDeliveryEstimate(deliveryRes.data.deliveryDate);
          setError(null);
        } catch (err) {
          // MANA SHU QATOR QO'SHILDI
          console.error("Mahsulot sahifasidagi API xatosi:", err); 
          setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }
}, [id]);
  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Xatolik" description={error} type="error" showIcon />;
  if (!product) return <Alert message="Ma'lumot yo'q" description="Bunday mahsulot topilmadi." type="warning" showIcon />;

  const itemInCart = cartItems.find(item => item.id === product.id);

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          <img
            alt={product.name}
            src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/800`}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Title level={2}>{product.name}</Title>
          <Text type="secondary">Artikul: {product.marketSku}</Text>
          <Divider />

          {product.oldPrice && product.oldPrice > product.price ? (
            <div>
              <Text delete type="secondary" style={{ fontSize: '18px' }}>{product.oldPrice.toLocaleString()} so'm</Text>
              <Title level={3} style={{ color: '#cf1322', marginTop: 0 }}>{product.price.toLocaleString()} so'm</Title>
            </div>
          ) : (
            <Title level={3} style={{ color: '#1890ff' }}>{product.price.toLocaleString()} so'm</Title>
          )}

          {deliveryEstimate && (
            <Text strong style={{ display: 'block', marginBottom: 8, color: '#52c41a' }}>
              <RocketOutlined /> Yetkazib berish: {deliveryEstimate}
            </Text>
          )}
          
          <Text strong type={product.stock > 0 ? 'success' : 'danger'}>
            Omborda: {product.stock > 0 ? `${product.stock} dona mavjud` : 'Mavjud emas'}
          </Text>
          <br /><br />
          
          <div style={{ width: '100%', marginBottom: 24 }}>
            {itemInCart ? (
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <Text>Savatda:</Text>
                <Button size="large" onClick={() => decreaseQuantity(product.id)}>-</Button>
                <Text strong style={{ fontSize: '1.2em' }}>{itemInCart.quantity}</Text>
                <Button size="large" onClick={() => addToCart(product)}>+</Button>
              </div>
            ) : (
              <Button type="primary" size="large" onClick={() => {addToCart(product); message.success(`'${product.name}' savatga qo'shildi!`)}} disabled={product.stock === 0} style={{ width: '100%' }}>
                Savatga qo‘shish
              </Button>
            )}
          </div>
          
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Brend">{product.brand}</Descriptions.Item>
            <Descriptions.Item label="Ishlab chiqarilgan mamlakat">{product.countryOfOrigin}</Descriptions.Item>
            {product.color && <Descriptions.Item label="Rangi">{product.color}</Descriptions.Item>}
            {product.size && <Descriptions.Item label="O'lchami">{product.size}</Descriptions.Item>}
          </Descriptions>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <Title level={4}>Mahsulot Tavsifi</Title>
          <Paragraph>{product.description}</Paragraph>
        </Col>
        <Col xs={24} md={12}>
          <Title level={4}>Xususiyatlari</Title>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Og'irligi">{product.weight} gr</Descriptions.Item>
            <Descriptions.Item label="O'lchamlari (U x B x K)">{`${product.length} x ${product.height} x ${product.width} mm`}</Descriptions.Item>
            {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>{String(value)}</Descriptions.Item>
            ))}
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;