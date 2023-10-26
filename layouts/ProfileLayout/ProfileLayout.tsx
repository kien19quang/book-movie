import { Flex, Layout, LayoutProps, Menu, MenuProps, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { HistoryOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useRouter } from 'next/router';
import { getItem } from '../../types/common';
import HeaderProfileLayout from './HeaderProfileLayout';
import Link from 'next/link';

const { Sider, Header, Footer, Content } = Layout
const { Text } = Typography

export interface ProfileProps {
}

const listMenuItem: MenuProps['items'] = [
  getItem('Thông tin', 'info', <UserOutlined style={{ fontSize: 16 }} />),
  getItem('Lịch sử mua hàng', 'purchase-history', <HistoryOutlined style={{ fontSize: 16 }} />),
  // getItem('Giỏ hàng của bạn', 'cart', <ShoppingCartOutlined style={{ fontSize: 16 }} />),
];

export default function ProfileLayout ({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeyMenu, setSelectedKeyMenu] = useState<string>('profile');
  const router = useRouter()
  
  useEffect(() => {
    const listKey = listMenuItem ? listMenuItem.map(item => item?.key) : []
    for (const key of listKey) {
      if (router.pathname.includes(key as string)) {
        setSelectedKeyMenu(key as string)
        break;
      }
    }
  }, [router.pathname])

  const handleClickMenu = (value: MenuInfo) => {
    if (value.key !== selectedKeyMenu) {
      router.push({ pathname: `/profile/${value.key}` });
      setSelectedKeyMenu(value.key);
    }
  };

  return (
    <Layout hasSider style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Sider
        width={240}
        theme="light"
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        style={{
          transition: 'all .3s cubic-bezier(.29,.01,0,1.04)',
          boxShadow: '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Row align="middle" justify="center" style={{ height: 60, borderBottom: '1px solid #e1e5ea' }}>
          <Link href="/" style={{ fontSize: 28, }}>
            <Text className="text-purple fw-bold" style={{ textShadow: '0 0 5px rgba(111, 87, 235, 0.5)', fontSize: 28 }}>What</Text>
            Movie
          </Link>
        </Row>
        <Menu mode="inline" selectedKeys={[selectedKeyMenu]} items={listMenuItem} onClick={handleClickMenu} style={{height: 'fit-content'}}/>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 240,
          backgroundColor: '#f6f7f9',
          transition: 'all .3s cubic-bezier(.29,.01,0,1.04)',
        }}
      >
        <HeaderProfileLayout collapsed={collapsed} />
        <Content style={{ position: 'relative', marginTop: 60 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
