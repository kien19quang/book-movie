import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Table, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import prismadbClient from '../../libs/prismadb';
import { CreateScreening, IOption } from '../../types/cinema';
import { Cinema } from '@prisma/client';
import ModalAddScreening from '../../components/ListModal/ModalAddScreening';
import ApiClient from '../../configs/axiosConfig';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { confirm } = Modal

interface DataType {
  key?: string;
  id: number;
  dayBookTicket: string;
  types: string[];
  movieScreenTimes: string[];
  cinema: Cinema;
}

const AdminScreening = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listScreening, setListScreening] = useState<DataType[]>(props.listScreening as any);
  const [openModalAddScreening, setOpenModalAddScreening] = useState<boolean>(false);
  const [idEditScreening, setIdScreening] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleCancelModal = () => {
    setOpenModalAddScreening(false)
    setIdScreening('')
    form.resetFields()
  }

  const handleEditScreening = (record: DataType) => {
    record.dayBookTicket = dayjs(record.dayBookTicket, 'DD-MM-YYYY') as any;
    (record as any).provinceId = record.cinema.provinceId
    setIdScreening(String(record.id));
    setOpenModalAddScreening(true);
    form.setFieldsValue(record);
  };

  const handleDeleteScreening = (record: DataType) => {
    confirm({
      title: 'Bạn có chắc muốn xoá suất chiếu phim này không?',
      onOk: async () => {
        const user = await ApiClient.DELETE(`/api/cinema/screenings?id=${record.id}`)
        if (user) {
          setListScreening(prev => prev.filter(item => item.id !== record.id))
          message.success('Xoá suất chiếu phim thành công')
        }
      }
    })
  }

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values: CreateScreening) => {
        const newListScreening = [...listScreening];
        console.log(dayjs(values.dayBookTicket).format('DD-MM-YYYY'))
        values.dayBookTicket = dayjs(values.dayBookTicket).format('DD-MM-YYYY')
        if (!idEditScreening) {
          const cinema = await ApiClient.POST('/api/cinema/screenings', values);
          if (cinema) {
            newListScreening.push(cinema);
          }
        } else {
          const cinema = await ApiClient.PUT('/api/cinema/screenings', { id: idEditScreening, ...values });
          if (cinema) {
            const index = newListScreening.findIndex((item) => item.id === cinema.id);
            newListScreening[index] = cinema;
          }
        }
        message.success(idEditScreening ? 'Cập nhật suất chiếu phim thành công' : 'Thêm suất chiếu phim thành công');
        setListScreening(newListScreening);
        setOpenModalAddScreening(false);
        setIdScreening('');
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.error) {
          message.error(error?.response?.data?.error);
        } else {
          message.error('Vui lòng điền đầy đủ thông tin');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên tỉnh thành',
      dataIndex: ['cinema', 'province', 'name'],
      key: 'province',
      width: 180,
      fixed: 'left',
    },
    {
      title: 'Rạp chiếu phim',
      dataIndex: ['cinema', 'name'],
      key: 'cinema',
      width: 300,
      fixed: 'left',
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'dayBookTicket',
      key: 'dayBookTicket',
      width: 150,
    },
    {
      title: 'Kiểu chiếu',
      key: 'types',
      render(value, record, index) {
        const typeShow = record.types.join(', ');
        return <Text>{typeShow}</Text>;
      },
    },
    {
      title: 'Thời gian',
      key: 'movieScreenTimes',
      render(value, record, index) {
        const movieTimeShow = record.movieScreenTimes.join(', ');
        return <Text>{movieTimeShow}</Text>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditScreening(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteScreening(record)}/>
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
              Danh sách suất chiếu phim
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddScreening(true)}>
              Thêm suất chiếu
            </Button>
          </Flex>
          <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600, x: 1800 }} columns={columns} dataSource={listScreening} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddScreening form={form} listProvince={props.listProvince as any} open={openModalAddScreening} onCancel={handleCancelModal} confirmLoading={loading} title="Suất chiếu phim" onOk={handleSubmit} />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const [listScreening, listProvince] = await Promise.all([
    prismadbClient.screenings.findMany({
      include: {
        cinema: {
          include: {
            province: true,
          },
        },
      },
    }),
    prismadbClient.province.findMany({
      include: {
        cinema: true
      }
    }),
  ]);

  return {
    props: {
      listScreening: listScreening,
      listProvince: listProvince
    },
  };
}

AdminScreening.Layout = AdminLayout;

export default AdminScreening;
