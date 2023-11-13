import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Table, Typography, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import prismadbClient from '../../libs/prismadb';
import ModalAddProvince from '../../components/ListModal/ModalAddProvince';
import { CreateProvince } from '../../types/cinema';
import ApiClient from '../../configs/axiosConfig';

const { Text, Title } = Typography;
const { confirm } = Modal

interface DataType {
  key?: string;
  id: number;
  name: string;
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

const AdminProvince = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listProvince, setListProvince] = useState<DataType[]>(props.provinces);
  const [openModalAddProvince, setOpenModalAddProvince] = useState<boolean>(false);
  const [idEditProvince, setIdEditProvince] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleCancelModal = () => {
    setOpenModalAddProvince(false);
    setIdEditProvince('');
    form.resetFields();
  };

  const handleEditProvince = (record: DataType) => {
    setIdEditProvince(String(record.id));
    setOpenModalAddProvince(true);
    form.setFieldsValue(record);
  };

  const handleDeleteProvince = (record: DataType) => {
    confirm({
      title: 'Bạn có chắc muốn xoá tỉnh thành này không?',
      onOk: async () => {
        const user = await ApiClient.DELETE(`/api/cinema/province?id=${record.id}`)
        if (user) {
          setListProvince(prev => prev.filter(item => item.id != record.id))
          message.success('Xoá tỉnh thành thành công')
        }
      }
    })
  }

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values: CreateProvince) => {
        const newListProvince = [...listProvince];
        if (!idEditProvince) {
          const province = await ApiClient.POST('/api/cinema/province', values);
          if (province) {
            newListProvince.push(province);
          }
        } else {
          const province = await ApiClient.PUT('/api/cinema/province', { oldId: idEditProvince, ...values });
          if (province) {
            const index = newListProvince.findIndex((item) => item.id === Number(idEditProvince));
            newListProvince[index] = province;
          }
        }
        message.success(idEditProvince ? 'Cập nhật tỉnh thành thành công' : 'Thêm tỉnh thành thành công');
        setListProvince(newListProvince);
        setOpenModalAddProvince(false);
        setIdEditProvince('');
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
      title: 'Mã tỉnh thành',
      dataIndex: 'id',
      key: 'id',
      width: 150
    },
    {
      title: 'Tên tỉnh thành',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditProvince(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteProvince(record)} />
          </Flex>
        )
      },
      width: 120
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
            maxWidth: 1000,
            width: '100%',
          }}
        >
          <Flex justify="space-between" align="center">
            <Title level={3} style={{ margin: 0, fontSize: 20 }}>
              Danh sách tỉnh thành
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddProvince(true)}>
              Thêm tỉnh thành
            </Button>
          </Flex>
          <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600 }} columns={columns} dataSource={listProvince} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddProvince form={form} open={openModalAddProvince} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loading} title='Tỉnh thành' />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const provinces = await prismadbClient.province.findMany();

  return {
    props: {
      provinces: provinces,
    },
  };
}

AdminProvince.Layout = AdminLayout;

export default AdminProvince;
