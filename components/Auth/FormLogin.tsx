import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, Row, Typography, message } from "antd";
import Link from "next/link";
import { FacebookCircleIcon, GoogleIcon } from "../Icons";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { ILoginDto } from "../../types/auth";

const { Text, Title } = Typography

export interface FormLoginProps {
  onChangeForm: () => void
}

export default function FormLogin ({ onChangeForm }: FormLoginProps) {
  const router = useRouter()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const handleOAuth = (type: 'facebook' | 'google') => {
    message.warning('Tính năng đang bảo trì')
    // signIn(type, { callbackUrl: `/`, redirect: false, })
  }

  const login = useCallback(async () => {
    try {
      setLoading(true)
      form
        .validateFields()
        .then(async (values: ILoginDto) => {
          const response = await signIn('credentials', {
            ...values,
            redirect: false,
            callbackUrl: '/'
          });
          if (response?.error) {
            return message.warning(response.error)
          }

          router.push('/')
        })
        .catch((error) => {
          console.log(error)
          if (error?.response?.data?.error) {
            message.error(error?.response?.data?.error)
          }
          else {
            message.error('Vui lòng điền đầy đủ thông tin');
          }
        })
        .finally(() => {
          setLoading(false)
        });

    } catch (error) {
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
        boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)' 
      }} 
      justify="center" 
      align="middle"
    >
      {/* <Row onClick={() => router.back()} style={{ position: 'absolute', top: '5%', left: 60, cursor: 'pointer' }}>
        <Ornament />
      </Row> */}

      <Row style={{ flexDirection: 'column', gap: 32 }} align="middle">
        <Title level={3} style={{ margin: 0, fontSize: 20 }}>
          Login first to your account
        </Title>

        <Form form={form} layout="vertical" style={{ width: 400 }}>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Vui lòng điền email' }]}>
            <Input placeholder="example@gmail.com" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Vui lòng điền mật khẩu' }]}>
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item required={false}>
            <Form.Item name="remember" valuePropName="checked" noStyle required={false}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Link href="" style={{ float: 'right' }}>
              Forgot password
            </Link>
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button loading={loading} type="primary" onClick={login} htmlType="submit" disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length} block>
                Log in
              </Button>
            )}
          </Form.Item>

          <Row style={{ flexDirection: 'column', gap: 24 }}>
            <Divider style={{ margin: 0, color: '#687588', fontWeight: 400, fontSize: 14 }}>Or login with</Divider>

            <Row style={{ gap: 16 }}>
              <Row style={{ flex: 1 }}>
                <Button onClick={() => handleOAuth('facebook')} block icon={<FacebookCircleIcon width={18} height={18} />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  Facebook
                </Button>
              </Row>

              <Row style={{ flex: 1 }}>
                <Button onClick={() => handleOAuth('google')} block icon={<GoogleIcon width={18} height={18} />} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                  Google
                </Button>
              </Row>
            </Row>

            <Row align='middle' justify='center' style={{ gap: 4 }}>
              <Text>You’re new in here?</Text>
              <Row className="hover-color-primary" style={{ color: '#27A376', cursor: 'pointer' }} onClick={onChangeForm}>Create Account</Row>
            </Row>
          </Row>
        </Form>
      </Row>
    </Row>
  );
}
