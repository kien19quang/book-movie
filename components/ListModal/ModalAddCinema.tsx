import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Form, FormInstance, Input, Modal, ModalProps, Rate, Select, message } from "antd";
import { useEffect, useState } from "react";
import CinemaService from "../../services/cinemaService";
import { ICinema } from "../../types/cinema";

export interface ModalAddCinemaProps extends ModalProps {
  form: FormInstance<any>,
  listProvince: Array<{ id: number, name: string }>
}

export default function ModalAddCinema ({form, listProvince, ...props}: ModalAddCinemaProps) {
  return (
    <Modal {...props} >
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} style={{ marginTop: 24 }} initialValues={{ role: 'CUSTOMER' }}>
        <Form.Item label="Tỉnh thành" name="provinceId" rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!', }]}>
          <Select 
            options={listProvince.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })}
          />
        </Form.Item>

        <Form.Item label="Tên rạp chiếu" name="name" rules={[{ required: true, message: 'Vui lòng điền tên rạp phim!' }]}>
          <Input placeholder="Example: CGV Rice City"/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
