import { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../ultils/logout';

const { Sider } = Layout;

interface SideBarProps {
  mode: string;
  setMode: React.Dispatch<React.SetStateAction<string>>;
}

const SideBar: React.FC<SideBarProps> = ({ mode, setMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  /* --------- Khai báo item menu ---------- */
  const items: MenuProps['items'] = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Về trang chủ',
      onClick: () => navigate('/home'),
    },
    {
      key: 'account',
      icon: <UserOutlined />,
      label: 'Quản lý tài khoản',
      onClick: () => setMode('account'),
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: 'Thống kê tài chính',
      onClick: () => setMode('finance'),
    },
    {
      key: 'request',          // key “mẹ” bao 2 option con
      icon: <FileTextOutlined />,
      label: 'Thông tin tổ chức',
      children: [
        {
          key: 'create',
          icon: <MinusOutlined />,
          label: 'Yêu cầu tạo tài khoản',
          onClick: () => setMode('create'),
        },
        {
          key: 'change',
          icon: <MinusOutlined />,
          label: 'Yêu cầu đổi tên',
          onClick: () => setMode('change'),
        },
      ],
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
    },
  ];

  /* Highlight item đang chọn.
     detailCreate được quy về create để menu bật dấu ▸ đúng */
  const selected = mode === 'detailCreate' ? 'create' : mode;

  return (
    <Sider
      breakpoint="lg"         // < 992px sẽ tự collapsed
      collapsedWidth={0}      // 0 = ẩn hoàn toàn
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={280}
      className="min-h-screen bg-primary-color"
      style={{ background: '#3BA769' }}  // giữ màu thương hiệu
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selected]}
        defaultOpenKeys={['request']} // luôn mở nhóm “Thông tin tổ chức”
        items={items}
        style={{ height: '100%', borderInlineEnd: 0 , background: '#3BA769'  }}
      />
    </Sider>
  );
};

export default SideBar;
