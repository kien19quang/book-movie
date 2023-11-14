import { Button, Flex, Form, Modal, Table, Typography, message } from 'antd';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { ColumnsType } from 'antd/es/table';
import { InferGetServerSidePropsType, NextPageContext } from 'next/types';
import prismadbClient from '../../libs/prismadb';
import { useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalAddUser from '../../components/ListModal/ModalAddUser';
import { IRegisterDto } from '../../types/auth';
import ApiClient from '../../configs/axiosConfig';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { confirm } = Modal;

interface DataType {
  key: string;
  id: string;
  name: string;
  email: number;
  role: number;
  createdAt: string;
  updatedAt: string;
}

const AdminUser = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [listUser, setListUser] = useState<DataType[]>(props.users as any);
  const [openModalAddUser, setOpenModalAddUser] = useState<boolean>(false);
  const [idEditUser, setIdEditUser] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleCancelModal = () => {
    setOpenModalAddUser(false);
    setIdEditUser('');
    form.resetFields();
  };

  const handleEditUser = async (record: DataType) => {
    setIdEditUser(record.id);
    setOpenModalAddUser(true);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
    });
  };

  const handleDeleteUser = async (record: DataType) => {
    console.log(record)
    confirm({
      title: 'Bạn có chắc muốn xoá tài khoản này không?',
      onOk: async () => {
        const user = await ApiClient.DELETE(`/api/user?id=${record.id}`);
        if (user) {
          setListUser((prev) => prev.filter((item) => item.id !== record.id));
          message.success('Xoá tài khoản thành công');
        }
      },
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values: IRegisterDto) => {
        let newListUser = [...listUser];
        if (!idEditUser) {
          const user = await ApiClient.POST('/api/auth/register', values);
          if (user) {
            user.createdAt = dayjs(user.createdAt).format('DD-MM-YYYY') as any;
            user.updatedAt = dayjs(user.updatedAt).format('DD-MM-YYYY') as any;
            newListUser = [user, ...newListUser];
          }
        } else {
          const user = await ApiClient.PUT('/api/user/', { id: idEditUser, ...values });
          if (user) {
            const index = newListUser.findIndex((item) => item.id === user.id);
            newListUser[index] = {
              email: user.email,
              name: user.name,
              key: user.id,
              id: user.id,
              role: user.role,
              createdAt: dayjs(user.createdAt).format('DD-MM-YYYY'),
              updatedAt: dayjs(user.updatedAt).format('DD-MM-YYYY'),
            };
          }
        }
        message.success(idEditUser ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản thành công');
        setListUser(newListUser);
        setOpenModalAddUser(false);
        setIdEditUser('');
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
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Ngày tạo',
      key: 'createdAt',
      dataIndex: 'createdAt',
    },
    {
      title: 'Ngày cập nhật',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        return (
          <Flex gap={16}>
            <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)} />
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteUser(record)} />
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
              Danh sách người dùng
            </Title>

            <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpenModalAddUser(true)}>
              Thêm tài khoản
            </Button>
          </Flex>
          <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600, x: 1200 }} columns={columns} dataSource={listUser} bordered={false} style={{ width: '100%' }} />
        </Flex>
      </Flex>
      <ModalAddUser form={form} open={openModalAddUser} onCancel={handleCancelModal} onOk={handleSubmit} confirmLoading={loading} type={idEditUser ? 'edit' : 'create'} title="Tài khoản" />
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const users = await prismadbClient.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  users.forEach((item) => {
    item.createdAt = dayjs(item.createdAt).format('DD-MM-YYYY') as any;
    item.updatedAt = dayjs(item.updatedAt).format('DD-MM-YYYY') as any;
  });

  return {
    props: {
      users: users,
    },
  };
}

AdminUser.Layout = AdminLayout;

export default AdminUser;
