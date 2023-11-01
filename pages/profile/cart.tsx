import { Avatar, Button, Divider, Flex, List, Modal, Popconfirm, Row, Space, Tabs, TabsProps, Tag, Typography, message } from 'antd';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import { stringToColor } from '../../utils';
import React, { ReactNode, useState } from 'react';
import { DollarOutlined, LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import Image from 'next/image';
import ModalBuyTiket from '../../components/ListModal/ModalBuyTicket';

const { Text, Title } = Typography;
const { confirm } = Modal

export interface ListMovieCartProps {
  status: 'pending' | 'active' | 'completed' | 'canceled';
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
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [listMovie, setListMovie] = useState(data)

  const handleDeleteTicket = (index: number) => {
    confirm({
      title: 'Bạn có chắc muốn xoá vé này đi không?',
      onOk: () => {
        setListMovie(prev => prev.filter((item, idx) => idx !== index && item))
        message.success('Xoá vé xem phim thành công')
      }
    })
  }

  const renderActionByStatus = (status: 'pending' | 'active' | 'completed' | 'canceled', index: number) => {
    const content = {
      pending: (
        <Flex key="action" gap={12}>
          <Button danger onClick={() => handleDeleteTicket(index)}>Xoá</Button>
          <Button onClick={() => setOpenModal(true)}>Đặt vé</Button>
        </Flex>
      ),
      active: (
        <Flex key="action" gap={12}>
          <Button danger onClick={() => handleDeleteTicket(index)}>Hủy đặt</Button>
        </Flex>
      ),
      completed: (
        <Flex key="action" gap={12}>
          <Button onClick={() => setOpenModal(true)}>Đặt lại</Button>
        </Flex>
      ),
      canceled: (
        <Flex key="action" gap={12}>
          <Button onClick={() => setOpenModal(true)}>Đặt lại</Button>
        </Flex>
      ),
    }
    return content[status]
  }

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 4,
        }}
        dataSource={listMovie}
        renderItem={(item, index) => (
          <List.Item
            key={item.title}
            actions={[
              <IconText icon={DollarOutlined} text="Giá vé: 150.000đ" key="list-vertical-like-o" />,
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            ]}
            extra={[renderActionByStatus(status, index)]}
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
      <ModalBuyTiket open={openModal} onCancel={() => setOpenModal(false)} />
    </>
  );
};

const renderTagByStatus: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa đặt', color: '#2db7f5' },
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
    label: 'Chưa đặt',
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
