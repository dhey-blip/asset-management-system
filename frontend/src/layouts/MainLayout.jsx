import { useState } from 'react'
import { Layout, Menu, Button, Flex, Typography, Avatar, Dropdown } from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/authService'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/assets', icon: <AppstoreOutlined />, label: 'Assets' },
  { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' },
]

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        theme="dark"
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#fff',
            fontWeight: 600,
            fontSize: collapsed ? 18 : 16,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'AMS' : 'Asset Management'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Flex justify="space-between" align="center" style={{ height: '100%' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Flex align="center" gap="small" style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} size="small" />
                <Text strong style={{ display: 'inline-block' }}>
                  {user?.username}
                </Text>
              </Flex>
            </Dropdown>
          </Flex>
        </Header>

        <Content style={{ margin: 16 }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 8, minHeight: '100%' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout