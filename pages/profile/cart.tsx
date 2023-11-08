import { CommentOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Flex, List, Modal, Row, Space, Statistic, Tabs, TabsProps, Tag, Typography, message } from 'antd';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import React, { useState } from 'react';
import ModalBuyTiket from '../../components/ListModal/ModalBuyTicket';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import UserService from '../../services/userService';
import { ICinemaTicket, IUser, StatusCinemaTicket } from '../../types/user';

const { Text, Title } = Typography;
const { confirm } = Modal;

export interface ListMovieCartProps {
  data: ICinemaTicket[];
  user: IUser;
  onChange: (listMovie: ICinemaTicket[]) => void;
}

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const ListMovieCart = ({ data, user, onChange }: ListMovieCartProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [movie, setMovie] = useState<ICinemaTicket>();
  const [type, setType] = useState<'reset' | 'book' | undefined>();

  const handleDeleteTicket = (index: number, type: 'delete' | 'cancel') => {
    confirm({
      title: 'Bạn có chắc muốn xoá vé này đi không?',
      onOk: async () => {
        const response = await UserService.deleteCinemaTicket(user.id, data[index].id, type);
        if (response) {
          onChange(response);
          message.success('Xoá vé xem phim thành công');
        }
      },
    });
  };

  const renderActionByStatus = (status: StatusCinemaTicket, index: number) => {
    const content = {
      pending: (
        <Flex key="action" gap={12}>
          <Button danger onClick={() => handleDeleteTicket(index, 'delete')}>
            Xoá
          </Button>
          <Button
            onClick={() => {
              setOpenModal(true);
              setMovie(data[index]);
              setType('book');
            }}
          >
            Đặt vé
          </Button>
        </Flex>
      ),
      active: (
        <Flex key="action" gap={12}>
          <Button danger onClick={() => handleDeleteTicket(index, 'cancel')}>
            Hủy đặt
          </Button>
        </Flex>
      ),
      completed: (
        <Flex key="action" gap={12}>
          <Button
            onClick={() => {
              setOpenModal(true);
              setMovie(data[index]);
              setType('reset');
            }}
          >
            Đặt lại
          </Button>
        </Flex>
      ),
      canceled: (
        <Flex key="action" gap={12}>
          <Button
            onClick={() => {
              setOpenModal(true);
              setMovie(data[index]);
              setType('reset');
            }}
          >
            Đặt lại
          </Button>
        </Flex>
      ),
    };
    return content[status];
  };

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          defaultPageSize: 4,
        }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            key={item.title}
            actions={[
              <Row key="ticket-price" style={{ gap: 4 }} align="middle">
                Giá vé:
                <Statistic value={item.ticketPrice} suffix="đ" valueStyle={{ fontSize: 14, color: '#00000073' }} />
              </Row>,
              <IconText icon={StarOutlined} text={`${item.voteAverage}`} key="list-vertical-star-o" />,
              <IconText icon={CommentOutlined} text={`${item.voteCount}`} key="list-vertical-like-o" />,
            ]}
            extra={[renderActionByStatus(item.status, index)]}
          >
            <List.Item.Meta
              avatar={<Image width={272} height={168} src={`${process.env.NEXT_PUBLIC_IMG}/w300/${item.thumbnailUrl}`} alt={`poster ${item.title}`} style={{ objectFit: 'cover', borderRadius: 12 }} />}
              title={
                <Flex gap={12} align="center">
                  <Title style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>{item.title}</Title>
                  <Tag color={renderTagByStatus[item.status].color}>{renderTagByStatus[item.status].label}</Tag>
                </Flex>
              }
              description={item.overview}
            />
          </List.Item>
        )}
      />
      {movie && (
        <ModalBuyTiket
          open={openModal}
          onCancel={() => setOpenModal(false)}
          onChange={(listCinema) => onChange(listCinema)}
          type={type}
          movie={
            {
              id: movie.id,
              title: movie.title,
              overview: movie.overview,
              backdrop_path: movie.thumbnailUrl,
              vote_count: movie.voteCount,
              vote_average: movie.voteAverage,
            } as any
          }
        />
      )}
    </>
  );
};

const renderTagByStatus: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chưa đặt', color: '#2db7f5' },
  active: { label: 'Đã đặt', color: '#87d068' },
  completed: { label: 'Hoàn thành', color: '#6f57eb' },
  canceled: { label: 'Đã hủy', color: '#f50' },
};

const Cart = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeKey, setActiveKey] = useState<string>('all');
  const [listMovieCart, setListMovieCart] = useState<ICinemaTicket[]>(props.listMovieCart);

  const commonChild = (
    <ListMovieCart
      data={listMovieCart}
      user={props.user as IUser}
      onChange={async (listMovie: ICinemaTicket[]) => {
        const response = await UserService.getCinemaTicket(props.user.id as string, activeKey);
        if (response) {
          setListMovieCart(response);
        }
      }}
    />
  );

  const items: TabsProps['items'] = [
    {
      key: 'all',
      label: 'Tất cả',
      children: commonChild,
    },
    {
      key: 'pending',
      label: 'Chưa đặt',
      children: commonChild,
    },
    {
      key: 'active',
      label: 'Đã đặt',
      children: commonChild,
    },
    {
      key: 'completed',
      label: 'Hoàn thành',
      children: commonChild,
    },
    {
      key: 'canceled',
      label: 'Đã hủy',
      children: commonChild,
    },
  ];

  const onChangeTabkey = async (key: string) => {
    const response = await UserService.getCinemaTicket(props.user.id as string, key);
    if (response) {
      setListMovieCart(response);
      setActiveKey(key);
    }
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

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);

  if (!session || !session.user.id) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const listMovieCart = await UserService.getCinemaTicket(session.user.id);
  return {
    props: {
      listMovieCart: listMovieCart || [],
      user: session.user,
    },
  };
}

Cart.Layout = ProfileLayout;

export default Cart;
