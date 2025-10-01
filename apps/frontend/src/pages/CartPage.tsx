// src/pages/CartPage.tsx (YAKUNIY VERSION)

import { Card, List, Typography, Button, Empty, Statistic, message, Space } from 'antd';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

const CartPage = () => {
  const { cartItems, addToCart, decreaseQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error("Buyurtma berish uchun, iltimos, tizimga kiring.");
      navigate('/login');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await axios.post('http://localhost:3001/api/orders', 
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
      clearCart(); // Savatni bo'shatamiz
      navigate('/orders'); // "Mening buyurtmalarim" sahifasiga o'tamiz

    } catch (error) {
      console.error("Buyurtma berishda xatolik:", error);
      message.error("Buyurtma berishda xatolik yuz berdi.");
    }
  };

  if (cartItems.length === 0) {
    return ( <div style={{ padding: '50px', textAlign: 'center' }}> <Empty description="Sizning savatingiz bo'sh"> <Link to="/"><Button type="primary">Xaridni boshlash</Button></Link> </Empty> </div> );
  }

  return (
    <div style={{ padding: '20px 50px' }}>
      <Title level={2}>🛒 Savatingiz</Title>
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Space>
                <Button onClick={() => decreaseQuantity(item.id)}>-</Button>
                <Text strong>{item.quantity}</Text>
                <Button onClick={() => addToCart(item)}>+</Button>
              </Space>,
              <Text strong>{(item.price * item.quantity).toLocaleString()} so'm</Text>
            ]}
          >
            <List.Item.Meta
              avatar={<img width={80} alt={item.name} src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80`} />}
              title={<Link to={`/products/${item.id}`}>{item.name}</Link>}
              description={`${item.price.toLocaleString()} so'm`}
            />
          </List.Item>
        )}
      />
      <Card style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Jami summa:</Title>
            <Statistic value={totalPrice} suffix="so'm" valueStyle={{ color: '#1890ff', fontSize: '24px' }} />
        </div>
        <Button type="primary" size="large" style={{ width: '100%', marginTop: '20px' }} onClick={handleCheckout}>
            Buyurtma berishga o'tish
        </Button>
      </Card>
    </div>
  );
};

export default CartPage;