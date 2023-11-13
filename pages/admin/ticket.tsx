import { CheckOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Modal, Statistic, Table, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import prismadbClient from '../../libs/prismadb';
import { ITicketPurchase, StatusCinemaTicket } from '../../types/user';
import ApiClient from '../../configs/axiosConfig';

const { Text, Title } = Typography;
const { confirm } = Modal;

interface DataType {
  key?: string;
  id: number;
  userId: string;
  name: string;
  title: string;
  ticketPrice: number;
  quantity: number;
  provinceId?: number;
  cinemaId?: string;
  dayBookTicket?: string;
  type?: string
  movieScreenTime?: string
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Mã tỉnh thành',
    dataIndex: 'id',
    key: 'id',
    width: 150,
  },
  {
    title: 'Tên tỉnh thành',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Action',
    key: 'action',
    render: () => {
      return (
        <Flex gap={16}>
          <Button icon={<EditOutlined />} />
          <Button danger icon={<DeleteOutlined />} />
        </Flex>
      );
    },
    width: 120,
  },
];

const AdminTicket = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listCinemaTicket, setListCinemaTicket] = useState<DataType[]>(props.listCinemaTicket as any);

  const handleSearch = (value: string) => {
    const newListCinemaTicket = props.listCinemaTicket.filter((item: any) => item.email.includes(value))
    setListCinemaTicket(newListCinemaTicket)
  }

  const handleDoneTicket = (record: DataType) => {
    confirm({
      title: 'Người dùng đã mua vé?',
      okText: 'Xác nhận',
      onOk: async () => {
        const cinemaTicket = await ApiClient.PUT('/api/user/cinema-ticket/ticket-purchase', { movieId: record.id, userId: record.userId, status: StatusCinemaTicket['completed'] } as ITicketPurchase)
        if (cinemaTicket) {
          setListCinemaTicket(prev => prev.filter(item => item.id !== record.id))
          message.success('Bán vé thành công')
        }
      }
    })
  }

  const handleCancelTicket = (record: DataType) => {
    confirm({
      title: 'Bạn có muốn huỷ vé của khách hàng?',
      okText: 'Xác nhận',
      onOk: async () => {
        const cinemaTicket = await ApiClient.PUT('/api/user/cinema-ticket/ticket-purchase', { movieId: record.id, userId: record.userId, status: StatusCinemaTicket['canceled'] } as ITicketPurchase)
        if (cinemaTicket) {
          setListCinemaTicket(prev => prev.filter(item => item.id !== record.id))
          message.success('Huỷ vé thành công')
        }
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      fixed: 'left'
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: 'Tỉnh thành',
      dataIndex: 'provinceId',
      key: 'provinceId',
      render(value, record, index) {
        const province = props.listProvince.find(item => item.id === value)
        return province?.name
      },
    },
    {
      title: 'Rạp chiếu phim',
      dataIndex: 'cinemaId',
      key: 'cinemaId',
      render(value, record, index) {
        const province = props.listProvince.find(item => item.id === record.provinceId)
        const cinema = province?.cinema.find(item => item.id === value)
        return cinema?.name
      },
      width: 350
    },
    {
      title: 'Ngày xem',
      dataIndex: 'dayBookTicket',
      key: 'dayBookTicket',
    },
    {
      title: 'Kiểu chiếu',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giờ chiếu',
      dataIndex: 'movieScreenTime',
      key: 'movieScreenTime',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá vé',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      render(value, record, index) {
        return <Statistic value={value} suffix='đ' valueStyle={{ fontSize: 16 }} />
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => {
        return (
          <Flex gap={16}>
            <Button icon={<CheckOutlined />} onClick={() => handleDoneTicket(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleCancelTicket(record)} />
          </Flex>
        );
      },
      width: 120,
    },
  ];

  return (
    <>
      <Flex vertical style={{ width: '100%', height: '100%' }} justify="center" align="center">
        <Flex
          justify="center"
          vertical
          style={{
            padding: 20,
            borderRadius: 16,
            backgroundColor: 'white',
            boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
            gap: 24,
            maxWidth: 1200,
            width: '100%',
            margin: '0 40px'
          }}
        >
          <Flex justify="space-between" align="center">
            <Title level={3} style={{ margin: 0, fontSize: 20 }}>
              Danh sách vé xem phim
            </Title>

            <Input prefix={<SearchOutlined />} style={{ width: 400 }} placeholder='Tìm kiếm theo email' onChange={e => handleSearch(e.target.value)} />
          </Flex>
          <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600, x: 2100 }} columns={columns} dataSource={listCinemaTicket} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const [listUser, listProvince] = await Promise.all([
    prismadbClient.user.findMany({
      select: {
        name: true,
        email: true,
        id: true,
        role: true,
        cinemaTicket: true,
      }
    }),
    prismadbClient.province.findMany({
      include: {
        cinema: true
      }
    })
  ])
  const listCinemaTicket: any = []
  listUser.forEach((item) => {
    item.cinemaTicket.forEach(ticket => {
      if (ticket.status === StatusCinemaTicket['active']) {
        ticket.createdAt = dayjs(ticket.createdAt).format('DD-MM-YYYY') as any;
        ticket.updatedAt = dayjs(ticket.updatedAt).format('DD-MM-YYYY') as any;
        listCinemaTicket.push({
          name: item.name,
          email: item.email,
          userId: item.id,
          ...ticket
        })
      }
    })
  });

  return {
    props: {
      listCinemaTicket: listCinemaTicket,
      listProvince: listProvince
    },
  };
}

AdminTicket.Layout = AdminLayout;

export default AdminTicket;
