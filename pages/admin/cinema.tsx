import { Button, Flex, Form, Modal, Row, Table, Typography, message } from 'antd';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import prismadbClient from '../../libs/prismadb';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import ModalAddCinema from '../../components/ListModal/ModalAddCinema';
import { CreateCinema } from '../../types/cinema';
import ApiClient from '../../configs/axiosConfig';

const { Text, Title } = Typography;
const { confirm } = Modal;

interface DataType {
  key?: string;
  id: number;
  name: string;
  province: {
    id: number;
    name: string;
  };
}

const AdminCinema = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listCinema, setListCinema] = useState<DataType[]>(props.listCinema as any);
  const [openModalAddCinema, setOpenModalAddCinema] = useState<boolean>(false);
  const [idEditCinema, setIdEditCinema] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCancelModal = () => {
    setOpenModalAddCinema(false);
    setIdEditCinema('');
    form.resetFields();
  };

  const [form] = Form.useForm();

  const handleEditCinema = (record: DataType) => {
    setIdEditCinema(String(record.id));
    setOpenModalAddCinema(true);
    form.setFieldsValue(record);
  };

  const handleDeleteCinema = (record: DataType) => {
    confirm({
      title: 'Bạn có chắc muốn xoá rạp chiếu phim này không?',
      onOk: async () => {
        const user = await ApiClient.DELETE(`/api/cinema/?id=${record.id}`);
        if (user) {
          setListCinema((prev) => prev.filter((item) => item.id !== record.id));
          message.success('Xoá rạp chiếu phim thành công');
        }
      },
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values: CreateCinema) => {
        const newListCinema = [...listCinema];
        if (!idEditCinema) {
          const cinema = await ApiClient.POST('/api/cinema', values);
          if (cinema) {
            newListCinema.push(cinema);
          }
        } else {
          const cinema = await ApiClient.PUT('/api/cinema', { id: idEditCinema, ...values });
          if (cinema) {
            const index = newListCinema.findIndex((item) => item.id === cinema.id);
            newListCinema[index] = cinema;
          }
        }
        message.success(idEditCinema ? 'Cập nhật rạp chiếu phim thành công' : 'Thêm rạp chiếu phim thành công');
        setListCinema(newListCinema);
        setOpenModalAddCinema(false);
        setIdEditCinema('');
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
      title: 'Tên rạp chiếu',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Tỉnh thành',
      dataIndex: ['province', 'name'],
      key: 'province',
      width: '50%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditCinema(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteCinema(record)} />
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
              Danh sách rạp chiếu phim
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddCinema(true)}>
              Thêm rạp chiếu
            </Button>
          </Flex>
          <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600 }} columns={columns} dataSource={listCinema} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddCinema form={form} listProvince={props.listProvince} open={openModalAddCinema} onCancel={handleCancelModal} confirmLoading={loading} title="Rạp chiếu phim" onOk={handleSubmit} />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const [listCinema, listProvince] = await Promise.all([
    prismadbClient.cinema.findMany({
      include: {
        province: true,
      },
    }),
    prismadbClient.province.findMany(),
  ]);

  return {
    props: {
      listCinema: listCinema,
      listProvince: listProvince,
    },
  };
}

AdminCinema.Layout = AdminLayout;

export default AdminCinema;
