// frontend/src/pages/LoginPage.tsx fayli uchun TO'LIQ KOD

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Card, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  // useNavigate -- bu React Router'ning sahifadan sahifaga o'tish uchun vositasi
  const navigate = useNavigate();

// LoginPage.tsx faylidagi onFinish funksiyasining YANGI VERSIYASI

const onFinish = async (values: any) => {
  try {
    // 1. Backend'ga so'rov yuboramiz
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: values.email,
      password: values.password,
    });

    // --- BIZNING TEKSHIRUVLARIMIZ BOSHLANDI ---
    console.log("1. Login'dan javob keldi:", response.data);

    // 2. Javobdan tokenni ajratib olamiz
    const { token } = response.data;
    console.log("2. Ajratib olingan token:", token);

    // 3. Tokenni localStorage'ga yozamiz
    localStorage.setItem('token', token);
    console.log("3. localStorage'ga yozishga harakat qildik.");

    // 4. Yozilgan narsani darhol qayta o'qib tekshiramiz
    const savedToken = localStorage.getItem('token');
    console.log("4. localStorage'dan qayta o'qilgan token:", savedToken);
    // --- TEKSHIRUVLAR TUGADI ---

    message.success('Tizimga muvaffaqiyatli kirdingiz!');
    navigate('/');

  } catch (error: any) {
    console.error('Login xatosi:', error);
    const errorMessage = error.response?.data?.error || 'Login qilishda noma\'lum xato';
    message.error(errorMessage);
  }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Tizimga kirish</Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Iltimos, email manzilingizni kiriting!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Iltimos, parolingizni kiriting!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Parol" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;