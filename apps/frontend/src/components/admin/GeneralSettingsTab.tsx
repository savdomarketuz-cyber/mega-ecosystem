// src/components/admin/GeneralSettingsTab.tsx (YANGILANGAN)

import { useEffect, useState } from 'react';
import { Form, Button, Select, message, Spin, InputNumber, Checkbox } from 'antd';
import axios from 'axios';

const weekDays = [
    { label: 'Dushanba', value: 1 }, { label: 'Seshanba', value: 2 },
    { label: 'Chorshanba', value: 3 }, { label: 'Payshanba', value: 4 },
    { label: 'Juma', value: 5 }, { label: 'Shanba', value: 6 }, { label: 'Yakshanba', value: 7 },
];

const GeneralSettingsTab = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    // Vaqt oralig'ini yaratish funksiyasi
    const generateTimeOptions = () => {
        const options = [];
        for (let h = 1; h < 24; h++) {
            const hour = String(h).padStart(2, '0');
            options.push({ value: `${hour}:00`, label: `${hour}:00` });
            if (h < 23 || (h === 23 && 30 > 0)) { // 23:30 gacha
                options.push({ value: `${hour}:30`, label: `${hour}:30` });
            }
        }
        return options;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:3001/api/settings', { headers: { Authorization: `Bearer ${token}` } });
                form.setFieldsValue(data);
            } catch (error) { message.error("Sozlamalarni yuklashda xatolik!"); } 
            finally { setLoading(false); }
        };
        fetchSettings();
    }, [form]);

    const onFinish = async (values: any) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:3001/api/settings', values, { headers: { Authorization: `Bearer ${token}` } });
            message.success("Sozlamalar muvaffaqiyatli saqlandi!");
        } catch (error) { message.error("Saqlashda xatolik!"); }
    };

    if (loading) return <Spin />;

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
            <Form.Item name="shipmentVolume" label="1. Jo'natma Hajmi (kuniga nechta buyurtma)">
                <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="orderCutoffTime" label="2. Buyurtmalarni qabul qilishning oxirgi vaqti">
                <Select options={generateTimeOptions()} />
            </Form.Item>
            <Form.Item name="workingDays" label="3. Umumiy ish kunlari">
                <Checkbox.Group options={weekDays} />
            </Form.Item>
            <Form.Item name="fulfillmentLeadTimeDays" label="Buyurtmani tayyorlash uchun umumiy vaqt (kun)">
                <Select>{Array.from({ length: 10 }, (_, i) => i).map(day => <Select.Option key={day} value={day}>{day === 0 ? "O'sha kuni" : `${day} kun`}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Saqlash</Button>
            </Form.Item>
        </Form>
    );
};
export default GeneralSettingsTab;