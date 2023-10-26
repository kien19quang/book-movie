import { Avatar, Button, Divider, Flex, Input, Typography, message } from 'antd';
import ProfileLayout from '../../layouts/ProfileLayout/ProfileLayout';
import { useSession } from 'next-auth/react';
import { stringToColor } from '../../utils';
import { useState } from 'react';
import { IProfileUser } from '../../types/auth';
import axios from 'axios';

const { Text, Title } = Typography;

const itemProfile: Array<{ key: string; label: string }> = [
  { key: 'name', label: 'Họ và tên' },
  { key: 'email', label: 'Email' },
];

export interface ProfileProps {}

const Profile = (props: ProfileProps) => {
  const { data, update } = useSession();
  const user = data?.user;
  const [keyEdit, setKeyEdit] = useState<string>('');

  const handleEditProfile = async (value: string, key: string) => {
    if (value) {
      try {
        const updateUser = await axios.put('/api/user', { ...data?.user, [key]: value })
        console.log(updateUser)
        if (updateUser) {
          update({ [key]: value });
          message.success('Cập nhật thông tin thành công')
          setKeyEdit('');
        }
      } catch (error) {
        message.error((error as any)?.response?.data?.error || 'Không thể cập nhật user');
      }
    } else {
      message.warning('Không được để trống thông tin');
    }
  };

  return (
    <Flex vertical style={{ width: '100%', height: '100%' }} justify="center" align="center">
      <Flex
        justify="center"
        align="center"
        vertical
        style={{ padding: 20, borderRadius: 16, backgroundColor: 'white', boxShadow: '0px 6px 9px 0px rgba(156, 156, 156, 0.10), 0px 3px 2px 0px rgba(156, 156, 156, 0.08)', gap: 32, width: 550 }}
      >
        <Flex vertical gap={16} align="center">
          <Avatar style={{ backgroundColor: stringToColor(user?.name as string), cursor: 'pointer', fontSize: 40 }} size={100}>
            {user?.name?.at(0)}
          </Avatar>

          <Flex vertical align="center">
            <Text style={{ fontSize: 18, fontWeight: 500 }}>{user?.name}</Text>
            <Text style={{ color: '#cbd2d9' }}>WhatMovie</Text>
          </Flex>
        </Flex>

        <Flex vertical style={{ width: '100%', borderRadius: 12, border: '1px solid #0505050f' }}>
          {itemProfile.map((item, index) => {
            return (
              <div key={item.key}>
                {index !== 0 && <Divider style={{ margin: 0 }} />}
                <Flex style={{ padding: '12px 16px', lineHeight: '28px' }} justify="space-between" align="center">
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                  {keyEdit === item.key ? (
                    <Input
                      style={{ width: 250 }}
                      autoFocus
                      defaultValue={(user as any)?.[item.key]}
                      onPressEnter={(e) => handleEditProfile(e.currentTarget.value, item.key)}
                      onBlur={() => setKeyEdit('')}
                    />
                  ) : (
                    <Flex gap={12} align="center">
                      <Text>{(user as any)?.[item.key]}</Text>
                      <Button type="link" style={{ padding: 0 }} onClick={() => setKeyEdit(item.key)}>
                        Thay đổi
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </div>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

Profile.Layout = ProfileLayout;

export default Profile;
