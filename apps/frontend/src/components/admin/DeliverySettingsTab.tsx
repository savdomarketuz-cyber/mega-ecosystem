// src/components/admin/DeliverySettingsTab.tsx (XATOLARI TUZATILGAN)

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Checkbox, Select, Form, Space, Card } from 'antd';
import axios from 'axios';

const weekDays = [ { label: 'Dush', value: 1 }, { label: 'Sesh', value: 2 }, { label: 'Chor', value: 3 }, { label: 'Pay', value: 4 }, { label: 'Jum', value: 5 }, { label: 'Shan', value: 6 }, { label: 'Yak', value: 7 } ];
const generateTimeOptions = () => { const options = []; for (let h = 1; h < 24; h++) { const hour = String(h).padStart(2, '0'); options.push({ value: `${hour}:00`, label: `${hour}:00` }); if (h < 23 || (h === 23 && 30 > 0)) { options.push({ value: `${hour}:30`, label: `${hour}:30` }); } } return options; };

const DeliverySettingsTab = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();

    // 1. fetchProducts funksiyasi useEffect tashqarisiga olindi
    const fetchProducts = useCallback(async () => {
       try {
           setLoading(true);
           const token = localStorage.getItem('token');
           const { data } = await axios.get('http://localhost:3001/api/products', { headers: { Authorization: `Bearer ${token}` } });
           setProducts(data);
       } catch (error) { message.error("Mahsulotlarni yuklashda xatolik!"); }
       finally { setLoading(false); }
    }, []);

    useEffect(() => { 
       fetchProducts();
    }, [fetchProducts]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => { setSelectedRowKeys(newSelectedRowKeys); };

    const handleBulkUpdate = async (values: any) => {
        if(selectedRowKeys.length === 0) { message.warning("Avval kamida bitta mahsulot tanlang!"); return; }
        try {
            const token = localStorage.getItem('token');
            const settingsToUpdate = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined && v !== null));

            if(Object.keys(settingsToUpdate).length === 0) {
                message.info("Yangilash uchun hech qanday sozlama tanlanmadi.");
                return;
            }

            await axios.put('http://localhost:3001/api/products/bulk-update/fulfillment', 
            { productIds: selectedRowKeys, settings: settingsToUpdate }, 
            { headers: { Authorization: `Bearer ${token}` } });
            message.success(`${selectedRowKeys.length} ta mahsulot uchun sozlamalar yangilandi!`);
            setSelectedRowKeys([]);
            fetchProducts(); // 2. Endi bu yerda bemalol chaqirish mumkin
        } catch (error) { message.error("Ommaviy yangilashda xatolik!"); }
    };
    
    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const columns = [ { title: 'Nomi', dataIndex: 'name' }, { title: 'Artikul', dataIndex: 'marketSku' }, { title: 'Tayyorlash (kun)', dataIndex: 'fulfillmentLeadTimeDays', render: (val: number | null) => val === 0 ? "O'sha kuni" : val ? `${val} kun` : '-' }, { title: 'Qabul Vaqti', dataIndex: 'orderCutoffTime' } ];
    
    return (
        <div>
            {selectedRowKeys.length > 0 && (
                <Card title={`${selectedRowKeys.length} ta mahsulot uchun ommaviy sozlamalar`} style={{ marginBottom: 24 }}>
                    <Form form={form} onFinish={handleBulkUpdate}>
                        <Space wrap align="end">
                            <Form.Item name="fulfillmentLeadTimeDays" label="Tayyorlash vaqti (kun)">
                                <Select style={{ width: 150 }} placeholder="O'zgartirish yo'q" allowClear>{Array.from({ length: 11 }, (_, i) => i).map(day => <Select.Option key={day} value={day}>{day === 0 ? "O'sha kuni" : `${day} kun`}</Select.Option>)}</Select>
                            </Form.Item>
                            <Form.Item name="orderCutoffTime" label="Buyurtma qabul qilish vaqti">
                                <Select style={{ width: 150 }} placeholder="O'zgartirish yo'q" allowClear options={generateTimeOptions()} />
                            </Form.Item>
                            <Form.Item name="workingDays" label="Ish kunlari">
                                <Checkbox.Group options={weekDays} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Tanlanganlarga qo'llash</Button>
                            </Form.Item>
                        </Space>
                    </Form>
                </Card>
            )}
            <Table loading={loading} rowSelection={rowSelection} columns={columns} dataSource={products} rowKey="id" />
        </div>
    );
};
export default DeliverySettingsTab;