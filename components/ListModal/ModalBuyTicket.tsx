import { DatePicker, Form, Modal, ModalProps, Select, message } from 'antd';
import { MouseEvent, useState } from 'react';

export interface ModalBuyTiketProps extends ModalProps {}

export default function ModalBuyTiket(props: ModalBuyTiketProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();

  const handleBuyTicket = (e: any) => {
    setLoading(true)
    form
      .validateFields()
      .then(async (values: any) => {
        console.log(values)
        message.success('Bạn đã đặt vé thành công')
        form.resetFields();
        (props as any).onCancel()
      })
      .catch((error) => {
        console.log(error);
        if (error?.response?.data?.error) {
          message.error(error?.response?.data?.error);
        } else {
          message.error('Vui lòng điền đầy đủ thông tin');
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <Modal {...props} title="Đặt vé xem phim" width={500} centered onOk={handleBuyTicket} confirmLoading={loading} okText='Đặt vé'>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ style: { width: '100%' } }} style={{ marginTop: 24 }} initialValues={{ type: 1 }}>
        <Form.Item label="Đặt vé vào ngày" name="dayBookTicket" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
          <DatePicker placeholder="Chọn ngày" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Tỉnh thành" name="province" rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}>
          <Select
            placeholder="Chọn tỉnh"
            style={{ width: '100%' }}
            options={[
              { label: 'Hà Nội', value: 29 },
              { label: 'Quảng Ninh', value: 14 },
            ]}
          />
        </Form.Item>

        <Form.Item label="Chọn kiểu" name="type" rules={[{ required: true, message: 'Vui lòng chọn kiểu!' }]}>
          <Select
            placeholder="Chọn kiểu"
            style={{ width: '100%' }}
            options={[
              { label: '2D Phụ Đề Việt', value: 1 },
              { label: '2D Phụ Đề Anh', value: 2 },
            ]}
          />
        </Form.Item>

        <Form.Item label="Rạp chiều phim" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu phim!' }]}>
          <Select
            placeholder="Chọn rạp chiếu phim"
            style={{ width: '100%' }}
            options={[
              { label: 'CGV Menas Mall (CGV CT Plaza)', value: 1 },
              { label: 'CGV Aeon Tân Phú', value: 2 },
              { label: 'CGV Pearl Plaza', value: 3 },
              { label: 'CGV Satra Củ Chi', value: 4 },
              { label: 'CGV Giga Mall Thủ Đức', value: 5 },
            ]}
          />
        </Form.Item>

        <Form.Item label="Xuất chiếu phim" name="movieScreenTime" rules={[{ required: true, message: 'Vui lòng chọn xuất chiếu phim!' }]}>
          <Select
            placeholder="Chọn xuất chiếu phim"
            style={{ width: '100%' }}
            options={[
              { label: '17:00 PM', value: 1 },
              { label: '18:00 PM', value: 2 },
              { label: '19:00 PM', value: 3 },
              { label: '20:00 PM', value: 4 },
              { label: '21:00 PM', value: 5 },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
