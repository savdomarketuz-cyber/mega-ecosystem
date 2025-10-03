// src/pages/OrderDetailPage.tsx uchun TO'LIQ KOD

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Typography, Spin, Alert, Button, List, Tag, Popconfirm, message, Descriptions } from 'antd';

const { Title, Text } = Typography;

// Statusga qarab rang tanlaydigan funksiya
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

const OrderDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/api/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
        } catch (error) {
            message.error("Buyurtma ma'lumotlarini yuklashda xatolik.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            // Backend o'zi statusni RETURN_REQUESTED'ga o'zgartiradi
            await axios.put(`http://localhost:3001/api/orders/${id}/status`, 
                { status: 'CANCELLED' }, // Biz har doim "CANCELLED" so'raymiz
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success("Amal muvaffaqiyatli bajarildi!");
            fetchOrder(); // Sahifani yangilash
        } catch (error: any) {
            message.error(error.response?.data?.error || "Operatsiyada xatolik.");
        }
    };

    if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
    if (!order) return <Alert message="Buyurtma topilmadi." type="error" />;

    return (
        <div>
            <Title level={3}>Buyurtma #{order.id} Tafsilotlari</Title>
            <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Sana">{new Date(order.createdAt).toLocaleString()}</Descriptions.Item>
                <Descriptions.Item label="Status"><Tag color={getStatusColor(order.status)}>{order.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="Jami Summa">{order.totalPrice.toLocaleString()} so'm</Descriptions.Item>
            </Descriptions>

            <Title level={4}>Mahsulotlar</Title>
            <List
                itemLayout="horizontal"
                dataSource={order.items}
                renderItem={(item: any) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<img width={60} alt={item.product.name} src={item.product.imageUrl || `https://picsum.photos/seed/${item.product.id}/80`} />}
                            title={<Link to={`/products/${item.product.id}`}>{item.product.name}</Link>}
                            description={`Soni: ${item.quantity} x ${item.price.toLocaleString()} so'm`}
                        />
                        <div>{(item.quantity * item.price).toLocaleString()} so'm</div>
                    </List.Item>
                )}
            />

            {['NEW', 'COLLECTING', 'AWAITING_COURIER', 'WITH_COURIER'].includes(order.status) && (
                <Popconfirm
                    title={order.status === 'NEW' ? "Buyurtmani bekor qilish" : "Qaytarish so'rovini yuborish"}
                    description="Haqiqatan ham davom etmoqchimisiz?"
                    onConfirm={handleCancelOrder}
                    okText="Ha"
                    cancelText="Yo'q"
                >
                    <Button type="primary" danger style={{ marginTop: 24 }}>
                        {order.status === 'NEW' ? "Buyurtmani bekor qilish" : "Qaytarish so'rovini yuborish"}
                    </Button>
                </Popconfirm>
            )}
        </div>
    );
};

export default OrderDetailPage;