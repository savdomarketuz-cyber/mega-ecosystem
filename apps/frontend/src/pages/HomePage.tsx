// frontend/src/pages/HomePage.tsx (YAKUNIY, TO'G'RI KOD)

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, List, Typography, Button, message, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title } = Typography;
const { Meta } = Card;

interface Product {
  id: number; name: string; description: string | null;
  price: number; stock: number; imageUrl: string | null;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, decreaseQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Mahsulotlarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2} style={{ margin: 0 }}>🛍️ Mahsulotlarimiz</Title>
        {/* Bu tugma endi MainLayout'ga o'tgan, bu yerda shart emas, lekin qoldiramiz */}
        {/* <Link to="/cart">
          <Button type="primary" size="large">Savatga o'tish ({cartItems.length})</Button>
        </Link> */}
      </div>
      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
        dataSource={products}
        renderItem={(product) => {
          const itemInCart = cartItems.find(item => item.id === product.id);
          return (
            <List.Item>
              <Card
                hoverable
                cover={ <Link to={`/products/${product.id}`}> <img alt={product.name} src={product.imageUrl || `https://picsum.photos/seed/${product.id}/300/300`} style={{ height: 200, objectFit: 'cover' }} /> </Link> }
                actions={[
                  itemInCart ? (
                    <Space>
                      <Button onClick={() => decreaseQuantity(product.id)}>-</Button>
                      <span style={{ margin: '0 8px', fontWeight: 'bold' }}>{itemInCart.quantity}</span>
                      <Button onClick={() => addToCart(product)}>+</Button>
                    </Space>
                  ) : (
                    <Button type="primary" onClick={() => { addToCart(product); message.success(`'${product.name}' savatga qo'shildi!`); }} disabled={product.stock === 0}>
                      Savatga qo'shish
                    </Button>
                  )
                ]}
              >
                <Link to={`/products/${product.id}`}>
                  <Meta title={product.name} description={`${product.price.toLocaleString()} so'm`} />
                </Link>
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default HomePage;