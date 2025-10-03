// src/pages/admin/SettingsPage.tsx uchun TO'LIQ KOD

import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import GeneralSettingsTab from '../../components/admin/GeneralSettingsTab';
import DeliverySettingsTab from '../../components/admin/DeliverySettingsTab';

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Umumiy Sozlamalar',
    children: <GeneralSettingsTab />,
  },
  {
    key: '2',
    label: 'Mahsulotlar Yetkazish Sozlamalari',
    children: <DeliverySettingsTab />,
  },
];

const SettingsPage = () => {
    return <Tabs defaultActiveKey="1" items={items} />;
}

export default SettingsPage;