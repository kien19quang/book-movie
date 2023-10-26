import { Flex, Typography, Table } from 'antd';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';

const { Text, Title } = Typography;

export interface PurchaseHistoryProps {}

interface DataType {
  key: string;
  id: number;
  nameMovie: string;
  quantity: number;
  createdAt: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'ID Movie',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Tên bộ phim',
    dataIndex: 'nameMovie',
    key: 'nameMovie',
  },
  {
    title: 'Số lượng vé đã mua',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Ngày mua',
    key: 'createdAt',
    dataIndex: 'createdAt',
  },
];

const data: DataType[] = [];

for (let i = 0; i < 20; i++) {
  data.push({
    key: `${i}`,
    id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
    nameMovie: 'Quỷ Ám: Tín Đồ',
    quantity: 1,
    createdAt: moment().format('DD-MM-YYYY'),
  });
}

const PurchaseHistory = (props: PurchaseHistoryProps) => {
  return (
    <Flex vertical style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Flex
        gap={16}
        vertical
        style={{
          padding: 20,
          borderRadius: 16,
          backgroundColor: 'white',
          boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)',
          maxWidth: 1200,
          width: '100%',
        }}
      >
        <Title level={3} style={{ margin: 0, fontSize: 20 }}>
          Lịch sử mua hàng
        </Title>
        <Table pagination={{ showSizeChanger: true }} scroll={{ y: 600 }} columns={columns} dataSource={data} bordered={false} style={{ width: '100%' }} />
      </Flex>
    </Flex>
  );
};

PurchaseHistory.Layout = ProfileLayout;

export default PurchaseHistory;
