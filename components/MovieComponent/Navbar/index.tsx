import Link from 'next/link';
import ButtonTheme from './ButtonTheme';
import ButtonToggler from './ButtonToggler';
import FormSearch from './FormSearch';
import { Avatar, Dropdown, Flex, MenuProps, Modal, Row } from 'antd';
import { stringToColor } from '../../../utils';
import { signOut, useSession } from 'next-auth/react';
import { GearSix, SignOutIcon, UserIcon } from '../../Icons';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useRouter } from 'next/router';

const { confirm } = Modal
 
const items: MenuProps['items'] = [
  {
    label: (
      <Row align="middle" style={{ gap: 8, fontSize: 15 }}>
        <UserIcon width={18} height={18} /> Xem hồ sơ
      </Row>
    ),
    key: 'profile',
  },
  // {
  //   label: (
  //     <Row align="middle" style={{ gap: 8, fontSize: 15 }}>
  //       <GearSix width={18} height={18} /> Cài đặt
  //     </Row>
  //   ),
  //   key: 'setting',
  // },
  {
    type: 'divider',
  },
  {
    label: (
      <Row align="middle" style={{ gap: 8, fontSize: 15 }}>
        <SignOutIcon width={18} height={18} /> Đăng xuất
      </Row>
    ),
    key: 'sign-out',
    danger: true,
  },
];

export default function Navbar() {
  const { data } = useSession();
  const user = data?.user;
  const router = useRouter()

  const handleClickMenu = (info: MenuInfo) => {
    if (info.key === 'sign-out') {
      confirm({
        title: 'Bạn có muốn đăng xuất không?',
        onOk: () => {
          signOut({ redirect: true, callbackUrl: '/' });
        },
      });
    }
    else if (info.key === 'profile') {
      router.push('/profile/info')
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container container-xxxl">
        <Link href="/" legacyBehavior>
          <a className="navbar-brand fs-3">
            <span className="text-purple fw-bold">What</span>
            Movie
          </a>
        </Link>
        <div className="d-block d-lg-none ms-auto">
          <ButtonTheme />
        </div>
        <ButtonToggler />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 pt-1">
            <li className="nav-item">
              <Link href="/" legacyBehavior>
                <a className="nav-link">Home</a>
              </Link>
            </li>
          </ul>
          <Flex gap={16} align='center'>
            <FormSearch />
            <ButtonTheme />
            <Dropdown menu={{ items, style: { width: 200 }, onClick: handleClickMenu }} placement='bottomRight' arrow>
              <Avatar style={{ backgroundColor: stringToColor(user?.name as string), cursor: 'pointer' }} size={32}>
                {user?.name?.at(0)}
              </Avatar>
            </Dropdown>
          </Flex>
        </div>
      </div>
    </nav>
  );
}
