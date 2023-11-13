import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import prismadbClient from '../../libs/prismadb';
import { IOption } from '../../types/cinema';
import { Cinema } from '@prisma/client';

const { Text, Title } = Typography

interface DataType {
  key?: string;
  id: number;
  dayBookTicket: string;
  types: IOption[];
  movieScreenTimes: IOption[];
  cinema: Cinema
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Tên tỉnh thành',
    dataIndex: ['cinema', 'province', 'name'],
    key: 'province',
  },
  {
    title: 'Rạp chiếu phim',
    dataIndex: ['cinema', 'name'],
    key: 'cinema',
  },
  {
    title: 'Ngày chiếu',
    dataIndex: 'dayBookTicket',
    key: 'dayBookTicket',
  },
  {
    title: 'Kiểu chiếu',
    dataIndex: 'types',
    key: 'types',
  },
  {
    title: 'Thời gian',
    dataIndex: 'movieScreenTimes',
    key: 'movieScreenTimes',
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
      )
    },
    width: 120
  },
];

const AdminScreening = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listScreening, setListScreening] = useState<DataType[]>(props.listScreening as any)

  return (
    <Flex vertical style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Flex
        justify="center"
        vertical
        style={{ padding: 20, borderRadius: 16, backgroundColor: 'white', boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)', gap: 24, maxWidth: 1000, width: '100%' }}
      >
        <Flex justify='space-between' align='center'>
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Danh sách suất chiếu phim
          </Title>

          <Button icon={<PlusOutlined />} type='primary'>
            Thêm suất chiếu
          </Button>
        </Flex>
        <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600 }} columns={columns} dataSource={listScreening} bordered={false} style={{ width: '100%' }} />
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const listScreening = await prismadbClient.screenings.findMany({
    include: {
      cinema: {
        include: {
          province: true
        }
      }
    }
  })

  return {
    props: {
      listScreening: listScreening
    }
  }
}

AdminScreening.Layout = AdminLayout;

export default AdminScreening;
