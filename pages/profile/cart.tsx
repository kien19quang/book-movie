import { Avatar, Button, Divider, Flex, List, Popconfirm, Row, Space, Tabs, TabsProps, Tag, Typography } from 'antd';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import { stringToColor } from '../../utils';
import React, { ReactNode, useState } from 'react';
import { DollarOutlined, LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Text, Title } = Typography;

export interface ListMovieCartProps {
  status: 'pending' | 'active' | 'completed' | 'canceled';
}

const CancelButton = () => {
  return (
    <Popconfirm
        title={<Title level={3} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Huỷ đặt vé xem phim</Title>}
        description={<Text>Bạn có chắc muốn huỷ đặt vé xem bộ phim này?</Text>}
        okText="Xác nhận"
        okButtonProps={{ style: { height: 28 } }}
        cancelButtonProps={{ style: { height: 28 } }}
      >
        <Button danger>Hủy đặt</Button>
    </Popconfirm>
  )
}


const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListMovieCart = ({ status }: ListMovieCartProps) => {
  const data = Array.from({ length: 16 }).map((_, i) => ({
    title: `Đi Tìm Công Lý`,
    content: 'Một người đàn ông thề sẽ mang lại công lý cho những người chịu trách nhiệm về cái chết của vợ mình trong khi bảo vệ gia đình duy nhất mà anh ta còn lại - con gái của anh ta.',
  }));

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 4,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          key={item.title}
          actions={[
            <IconText icon={DollarOutlined} text="Giá vé: 150.000đ" key="list-vertical-like-o" />,
            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
          ]}
          extra={[renderActionByStatus[status]]}
        >
          <List.Item.Meta
            avatar={<Image width={272} height={168} alt="Ảnh phim" src="https://image.tmdb.org/t/p/w500//nprqOIEfiMMQx16lgKeLf3rmPrR.jpg" style={{ objectFit: 'cover', borderRadius: 12 }} />}
            title={
              <Flex gap={12} align="center">
                <Title style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{item.title}</Title>
                <Tag color={renderTagByStatus[status].color}>{renderTagByStatus[status].label}</Tag>
              </Flex>
            }
            description={item.content}
          />
        </List.Item>
      )}
    />
  );
};

const renderActionByStatus: Record<string, ReactNode> = {
  pending: (
    <Flex key="action" gap={12}>
      <CancelButton />
      <Button>Thanh toán</Button>
    </Flex>
  ),
  active: (
    <Flex key="action" gap={12}>
      <CancelButton />
    </Flex>
  ),
  completed: (
    <Flex key="action" gap={12}>
      <Button>Mua lại</Button>
    </Flex>
  ),
  canceled: (
    <Flex key="action" gap={12}>
      <Button>Đặt lại</Button>
    </Flex>
  ),
};

const renderTagByStatus: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ thanh toán', color: '#2db7f5' },
  active: { label: 'Đã đặt', color: '#87d068' },
  completed: { label: 'Hoàn thành', color: '#6f57eb' },
  canceled: { label: 'Đã hủy', color: '#f50' },
};


const items: TabsProps['items'] = [
  {
    key: 'all',
    label: 'Tất cả',
    children: <ListMovieCart status="active" />,
  },
  {
    key: 'pending',
    label: 'Chờ thanh toán',
    children: <ListMovieCart status="pending" />,
  },
  {
    key: 'active',
    label: 'Đã đặt',
    children: <ListMovieCart status="active" />,
  },
  {
    key: 'completed',
    label: 'Hoàn thành',
    children: <ListMovieCart status="completed" />,
  },
  {
    key: 'canceled',
    label: 'Đã hủy',
    children: <ListMovieCart status="canceled" />,
  },
];
const Cart = () => {
  const [activeKey, setActiveKey] = useState<string>('all');

  const onChangeTabkey = (key: string) => {
    setActiveKey(key);
  };

  return (
    <Flex vertical style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Flex
        justify="center"
        vertical
        gap={16}
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: 'white',
          boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
          maxWidth: 1200,
          width: '100%',
        }}
      >
        <Tabs defaultActiveKey={activeKey} items={items} onChange={onChangeTabkey} />
      </Flex>
    </Flex>
  );
};

Cart.Layout = ProfileLayout;

export default Cart;
