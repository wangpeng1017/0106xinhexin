'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Button,
  theme,
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  RobotOutlined,
  FormOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import Link from 'next/link'
import { useUserStore } from '@/stores/user'

const { Header, Sider, Content } = Layout

// 菜单配置
const menuItems: MenuProps['items'] = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: <Link href="/admin">控制台</Link>,
  },
  {
    key: '/admin/knowledge',
    icon: <BookOutlined />,
    label: <Link href="/admin/knowledge">知识库</Link>,
  },
  {
    key: '/admin/agents',
    icon: <RobotOutlined />,
    label: <Link href="/admin/agents">智能体</Link>,
  },
  {
    key: '/admin/training',
    icon: <FormOutlined />,
    label: '培训考试',
    children: [
      {
        key: '/admin/training/overview',
        label: <Link href="/admin/training">培训概览</Link>,
      },
      {
        key: '/admin/training/scenes',
        label: <Link href="/admin/training/scenes">培训场景</Link>,
      },
      {
        key: '/admin/training/questions',
        label: <Link href="/admin/training/questions">题库管理</Link>,
      },
      {
        key: '/admin/training/exams',
        label: <Link href="/admin/training/exams">试卷管理</Link>,
      },
      {
        key: '/admin/training/records',
        label: <Link href="/admin/training/records">考试记录</Link>,
      },
    ],
  },
  {
    key: '/admin/system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/admin/system/users',
        icon: <UserOutlined />,
        label: <Link href="/admin/system/users">用户管理</Link>,
      },
      {
        key: '/admin/system/departments',
        icon: <TeamOutlined />,
        label: <Link href="/admin/system/departments">部门管理</Link>,
      },
      {
        key: '/admin/system/roles',
        label: <Link href="/admin/system/roles">角色管理</Link>,
      },
      {
        key: '/admin/system/logs',
        label: <Link href="/admin/system/logs">操作日志</Link>,
      },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { token } = theme.useToken()
  const { user, logout } = useUserStore()

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link href="/admin/profile">个人中心</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout()
        router.push('/login')
      },
    },
  ]

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    // 精确匹配或找父级
    const keys = [pathname]
    // 处理子菜单展开
    if (pathname.startsWith('/admin/training')) {
      keys.push('/admin/training')
    }
    if (pathname.startsWith('/admin/system')) {
      keys.push('/admin/system')
    }
    return keys
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1890ff',
            fontSize: collapsed ? 16 : 18,
            fontWeight: 600,
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {collapsed ? '新核芯' : '新核芯知识库'}
        </div>

        {/* 菜单 */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={['/admin/training', '/admin/system']}
          items={menuItems}
        />
      </Sider>

      {/* 主内容区 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />

          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.real_name || user?.username || '用户'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区 */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 'calc(100vh - 64px - 48px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
