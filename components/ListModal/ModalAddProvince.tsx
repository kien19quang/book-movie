import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Rate, Select, message } from "antd";

export interface ModalAddProvinceProps extends ModalProps {
  form: FormInstance<any>,
}

export default function ModalAddProvince ({form, ...props}: ModalAddProvinceProps) {
  return (
    <Modal {...props} >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ role: 'CUSTOMER' }}>
        <Form.Item label="Mã tỉnh thành" name="id" rules={[{ required: true, message: 'Vui lòng nhập mã tỉnh thành!', }]}>
          <Input placeholder="Example: 14" />
        </Form.Item>

        <Form.Item label="Tên tỉnh thành" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên tỉnh thành!' }]}>
          <Input placeholder="Example: Quảng Ninh"/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
