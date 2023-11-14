import { FacebookOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, Row, Typography, message } from 'antd';
import { useRouter } from 'next/router';
import { GoogleIcon } from '../Icons';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import axios from 'axios';
import { IRegisterDto } from '../../types/auth';

const { Text, Title } = Typography;

export interface FormRegisterProps {
  onChangeForm: () => void;
}

export default function FormRegister({ onChangeForm }: FormRegisterProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const register = useCallback(async () => {
    try {
      setLoading(true);
      form
        .validateFields()
        .then(async (values: IRegisterDto) => {
          const resRegister = await axios.post('/api/auth/register', values);
          console.log(resRegister.data);

          const response = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/',
          });
          if (response?.error) {
            return message.error(response.error);
          }

          router.push('/');
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
    } catch (error: any) {
      console.log(error);
    }
  }, [form, router]);

  return (
    <Row
      style={{
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
      }}
      justify="center"
      align="middle"
    >
      <Row style={{ flexDirection: 'column', flexGrow: 1, position: 'relative' }} justify="center" align="middle">
        {/* <Row onClick={() => router.back()} style={{ position: 'absolute', top: '5%', left: 60, cursor: 'pointer' }}>
          <Ornament />
        </Row> */}

        <Row style={{ flexDirection: 'column', gap: 32 }} align="middle">
          <Title level={3} style={{ margin: 0, fontSize: 20 }}>
            Register your account
          </Title>

          <Form form={form} layout="vertical" style={{ width: 400 }}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Vui lòng điền đầy đủ tên của bạn' }]}>
              <Input placeholder="Your full name" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Vui lòng điền email' }]}>
              <Input placeholder="example@gmail.com" prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng điền mật khẩu' }, { min: 6, message: 'Mật khẩu cần ít nhất 6 ký tự' }]}>
              <Input.Password placeholder="Password" prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  loading={loading}
                  onClick={register}
                  type="primary"
                  htmlType="submit"
                  disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                  block
                  style={{ marginTop: 16 }}
                >
                  Create Account
                </Button>
              )}
            </Form.Item>

            <Row style={{ flexDirection: 'column', gap: 24 }}>
              <Row align="middle" justify="center" style={{ gap: 4 }}>
                <Text>Already have an account?</Text>
                <Row className="hover-color-primary" style={{ color: '#6f57eb', cursor: 'pointer' }} onClick={onChangeForm}>
                  Login Here
                </Row>
              </Row>
            </Row>
          </Form>
        </Row>
      </Row>
    </Row>
  );
}
