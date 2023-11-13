import { DatePicker, Form, InputNumber, Modal, ModalProps, Select, message } from 'antd';
import { MouseEvent, useEffect, useState } from 'react';
import { ICinema, IProvince, IScreening } from '../../types/cinema';
import CinemaService from '../../services/cinemaService';
import { CreateCinemaTicketDto, ICinemaTicket, StatusCinemaTicket } from '../../types/user';
import { useSession } from 'next-auth/react';
import { DetailMovieTypes } from '../../services/data_types';
import UserService from '../../services/userService';
import dayjs from 'dayjs';

export interface ModalBuyTiketProps extends ModalProps {
  movie: DetailMovieTypes;
  type?: 'book' | 'reset';
  onChange?: (value: ICinemaTicket[]) => void;
}

export default function ModalBuyTiket({ movie, type, onChange = () => {}, ...props }: ModalBuyTiketProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [listProvince, setListProvince] = useState<IProvince[]>([]);
  const [listCinema, setListCinema] = useState<ICinema[]>([]);
  const [screening, setScreening] = useState<IScreening>();
  const { data } = useSession();
  const user = data?.user;
  const [form] = Form.useForm();

  useEffect(() => {
    const _getProvince = async () => {
      const response = await CinemaService.getProvince();
      if (response) {
        setListProvince(response);
      }
    };

    _getProvince();
  }, []);

  const handleBuyTicket = (e: any) => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values: any) => {
        console.log(values);
        const newTicket: CreateCinemaTicketDto = {
          userId: user?.id as string,
          movieId: movie.id,
          title: movie.title,
          overview: movie.overview,
          thumbnailUrl: movie.backdrop_path,
          status: StatusCinemaTicket['active'],
          voteCount: movie.vote_count,
          voteAverage: movie.vote_average,
          quantity: values.quantity,
          ticketPrice: 150000,
          provinceId: Number(values.province),
          cinemaId: values.cinema,
          dayBookTicket: dayjs(values.dayBookTicket).format('DD-MM-YYYY'),
          type: values.type,
          movieScreenTime: values.movieScreenTime,
        };
        const response = type ? await UserService.updateCinemaTicket(newTicket, type) : await UserService.addCinemaTicket(newTicket);
        message.success('Bạn đã đặt vé thành công');
        onChange(response);
        (props as any).onCancel();
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
      .finally(() => setLoading(false));
  };

  const handleChangeProvince = (value: number) => {
    const province = listProvince.find((item) => item.id === value);
    if (province) {
      setListCinema(province.cinema);
    }
  };

  const handleFieldsChange = async (changeValues: any) => {
    if (changeValues.dayBookTicket || changeValues.province || changeValues.cinema) {
      const value = form.getFieldsValue();
      if (value.dayBookTicket && value.province && value.cinema) {
        const screening = await CinemaService.getScreening(value.province, value.cinema, dayjs(value.dayBookTicket).format('DD-MM-YYYY'));
        if (screening) {
          setScreening(screening);
        }
      }
    }
  };

  return (
    <Modal {...props} title="Đặt vé xem phim" width={500} centered onOk={handleBuyTicket} confirmLoading={loading} okText="Đặt vé">
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ style: { width: '100%' } }} style={{ marginTop: 24 }} onValuesChange={handleFieldsChange} initialValues={{ quantity: 1 }}>
        <Form.Item label="Đặt vé vào ngày" name="dayBookTicket" rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}>
          <DatePicker placeholder="Chọn ngày" style={{ width: '100%' }} format="DD-MM-YYYY" />
        </Form.Item>

        <Form.Item label="Tỉnh thành" name="province" rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}>
          <Select
            placeholder="Chọn tỉnh"
            style={{ width: '100%' }}
            options={listProvince.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })}
            onChange={handleChangeProvince}
          />
        </Form.Item>

        <Form.Item label="Rạp chiều phim" name="cinema" rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu phim!' }]}>
          <Select
            placeholder="Chọn rạp chiếu phim"
            style={{ width: '100%' }}
            options={listCinema.map((item) => {
              return {
                value: item.id,
                label: item.name,
              };
            })}
          />
        </Form.Item>

        <Form.Item label="Số lượng vé" name="quantity" rules={[{ required: true, message: 'Vui lòng chọn tỉnh thành!' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Chọn kiểu" name="type" rules={[{ required: true, message: 'Vui lòng chọn kiểu!' }]} shouldUpdate>
          <Select
            placeholder="Chọn kiểu"
            style={{ width: '100%' }}
            disabled={!screening?.types?.length}
            options={screening?.types.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
          />
        </Form.Item>

        <Form.Item label="Suất chiếu phim" name="movieScreenTime" rules={[{ required: true, message: 'Vui lòng chọn xuất chiếu phim!' }]}>
          <Select
            placeholder="Chọn suất chiếu phim"
            style={{ width: '100%' }}
            disabled={!screening?.movieScreenTimes?.length}
            options={screening?.movieScreenTimes.map((item) => {
              return {
                value: item,
                label: item,
              };
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
