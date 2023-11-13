import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { DatePicker, Form, FormInstance, Input, Modal, ModalProps, Rate, Select, message } from "antd";
import { ICinema, IProvince } from "../../types/cinema";
import { useEffect, useState } from "react";

export interface ModalAddScreeningProps extends ModalProps {
  form: FormInstance<any>,
  listProvince: IProvince[]
}

export default function ModalAddScreening ({form, listProvince, ...props}: ModalAddScreeningProps) {
  const [listCinema, setListCinema] = useState<ICinema[]>([]);

  useEffect(() => {
    const provinceId = form.getFieldValue('provinceId')
    if (provinceId) {
      const province = listProvince.find((item) => item.id === provinceId);
      if (province) {
        setListCinema(province.cinema);
      }
    }
  }, [form, listProvince])

  const handleChangeProvince = (value: number) => {
    const province = listProvince.find((item) => item.id === value);
    if (province) {
      setListCinema(province.cinema);
    }
  };

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
            onChange={handleChangeProvince}
          />
        </Form.Item>

        <Form.Item label="Rạp chiếu phim" name="cinemaId" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu phim!', }]}>
          <Select 
            options={listCinema.map(item => {
              return {
                label: item.name,
                value: item.id
              }
            })}
          />
        </Form.Item>

        <Form.Item label="Ngày chiếu" name="dayBookTicket" rules={[{ required: true, message: 'Vui lòng chọn ngày chiếu!', }]}>
          <DatePicker style={{ width: '100%' }} format='DD-MM-YYYY' />
        </Form.Item>

        <Form.Item label="Kiêu chiếu" name="types" rules={[{ required: true, message: 'Vui lòng thêm kiểu chiếu!' }]}>
          <Select mode='tags' maxTagCount='responsive' onChange={value => console.log(value)} />
        </Form.Item>

        <Form.Item label="Suất chiếu" name="movieScreenTimes" rules={[{ required: true, message: 'Vui lòng thêm suất chiếu phim!' }]}>
          <Select mode='tags' maxTagCount='responsive'/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
