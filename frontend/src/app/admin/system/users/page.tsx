'use client'

import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  Select,
  TreeSelect,
  Switch,
  message,
  Popconfirm,
  Typography,
  Avatar,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { Search } = Input

// 模拟用户数据
const usersData = [
  {
    id: 1,
    username: 'admin',
    name: '系统管理员',
    email: 'admin@xinhexin.com',
    phone: '13800138000',
    dept_name: '信息技术部',
    role_names: ['超级管理员'],
    status: 1,
    last_login: '2024-01-05 10:30:00',
    created_at: '2023-01-01',
  },
  {
    id: 2,
    username: 'zhangsan',
    name: '张三',
    email: 'zhangsan@xinhexin.com',
    phone: '13800138001',
    dept_name: '研发中心',
    role_names: ['研发工程师'],
    status: 1,
    last_login: '2024-01-05 09:15:00',
    created_at: '2023-03-15',
  },
  {
    id: 3,
    username: 'lisi',
    name: '李四',
    email: 'lisi@xinhexin.com',
    phone: '13800138002',
    dept_name: '生产部',
    role_names: ['生产主管', '培训讲师'],
    status: 1,
    last_login: '2024-01-04 16:45:00',
    created_at: '2023-05-20',
  },
  {
    id: 4,
    username: 'wangwu',
    name: '王五',
    email: 'wangwu@xinhexin.com',
    phone: '13800138003',
    dept_name: '质量部',
    role_names: ['质量工程师'],
    status: 0,
    last_login: '2023-12-20 11:00:00',
    created_at: '2023-06-10',
  },
]

// 部门树数据
const deptTreeData = [
  {
    title: '新核芯科技',
    value: '1',
    children: [
      {
        title: '研发中心',
        value: '1-1',
        children: [
          { title: '芯片设计组', value: '1-1-1' },
          { title: '工艺研发组', value: '1-1-2' },
        ],
      },
      { title: '生产部', value: '1-2' },
      { title: '质量部', value: '1-3' },
      { title: '信息技术部', value: '1-4' },
      { title: '人力资源部', value: '1-5' },
    ],
  },
]

// 角色选项
const roleOptions = [
  { value: 1, label: '超级管理员' },
  { value: 2, label: '部门管理员' },
  { value: 3, label: '研发工程师' },
  { value: 4, label: '生产主管' },
  { value: 5, label: '质量工程师' },
  { value: 6, label: '培训讲师' },
  { value: 7, label: '普通员工' },
]

export default function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof usersData[0] | null>(null)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  // 打开编辑弹窗
  const handleEdit = (user: typeof usersData[0]) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalOpen(true)
  }

  // 打开新建弹窗
  const handleCreate = () => {
    setEditingUser(null)
    form.resetFields()
    setModalOpen(true)
  }

  // 打开重置密码弹窗
  const handleResetPassword = (user: typeof usersData[0]) => {
    setEditingUser(user)
    passwordForm.resetFields()
    setPasswordModalOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof usersData[0]> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div><MailOutlined style={{ marginRight: 4 }} />{record.email}</div>
          <div><PhoneOutlined style={{ marginRight: 4 }} />{record.phone}</div>
        </div>
      ),
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
      key: 'dept_name',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role_names',
      key: 'role_names',
      width: 180,
      render: (roles: string[]) => (
        <Space wrap>
          {roles.map((role) => (
            <Tag key={role} color="blue">{role}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      key: 'last_login',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="重置密码">
            <Button type="link" size="small" icon={<LockOutlined />} onClick={() => handleResetPassword(record)} />
          </Tooltip>
          <Popconfirm title="确定删除此用户？">
            <Tooltip title="删除">
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>用户管理</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Search placeholder="搜索用户名/姓名" style={{ width: 250 }} />
            <TreeSelect
              style={{ width: 180 }}
              placeholder="选择部门"
              treeData={deptTreeData}
              allowClear
            />
            <Select
              style={{ width: 150 }}
              placeholder="选择角色"
              options={roleOptions}
              allowClear
            />
            <Select
              style={{ width: 120 }}
              placeholder="状态"
              options={[
                { value: 1, label: '启用' },
                { value: 0, label: '禁用' },
              ]}
              allowClear
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建用户
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={usersData}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      {/* 新建/编辑用户弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新建用户'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingUser ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item name="dept_id" label="所属部门" rules={[{ required: true }]}>
            <TreeSelect
              treeData={deptTreeData}
              placeholder="选择部门"
            />
          </Form.Item>
          <Form.Item name="role_ids" label="角色" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              options={roleOptions}
              placeholder="选择角色"
            />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="初始密码" rules={[{ required: true }]}>
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title={`重置密码 - ${editingUser?.name}`}
        open={passwordModalOpen}
        onOk={() => {
          passwordForm.validateFields().then((values) => {
            console.log(values)
            message.success('密码重置成功')
            setPasswordModalOpen(false)
          })
        }}
        onCancel={() => setPasswordModalOpen(false)}
        width={400}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
