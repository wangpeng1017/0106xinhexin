'use client'

import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Tree,
  message,
  Popconfirm,
  Typography,
  Switch,
  Descriptions,
  Badge,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'

const { Title, Text } = Typography

// 模拟角色数据
const rolesData = [
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '系统超级管理员，拥有所有权限',
    user_count: 2,
    status: 1,
    is_system: true,
    created_at: '2023-01-01',
  },
  {
    id: 2,
    name: '部门管理员',
    code: 'dept_admin',
    description: '部门管理员，管理本部门用户和资源',
    user_count: 5,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
  {
    id: 3,
    name: '研发工程师',
    code: 'rd_engineer',
    description: '研发人员，可访问研发知识库',
    user_count: 15,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
  {
    id: 4,
    name: '生产主管',
    code: 'prod_supervisor',
    description: '生产管理人员，可访问生产知识库',
    user_count: 8,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
  {
    id: 5,
    name: '质量工程师',
    code: 'qa_engineer',
    description: '质量管理人员',
    user_count: 6,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
  {
    id: 6,
    name: '培训讲师',
    code: 'trainer',
    description: '培训管理人员，可创建培训和考试',
    user_count: 3,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
  {
    id: 7,
    name: '普通员工',
    code: 'employee',
    description: '普通员工，基础访问权限',
    user_count: 47,
    status: 1,
    is_system: false,
    created_at: '2023-01-01',
  },
]

// 权限树数据
const permissionTree: DataNode[] = [
  {
    title: '系统管理',
    key: 'system',
    children: [
      { title: '用户管理', key: 'system:user' },
      { title: '部门管理', key: 'system:dept' },
      { title: '角色管理', key: 'system:role' },
      { title: '操作日志', key: 'system:log' },
    ],
  },
  {
    title: '知识库管理',
    key: 'kb',
    children: [
      { title: '查看知识库', key: 'kb:view' },
      { title: '创建知识库', key: 'kb:create' },
      { title: '编辑知识库', key: 'kb:edit' },
      { title: '删除知识库', key: 'kb:delete' },
      { title: '上传文档', key: 'kb:upload' },
      { title: '下载文档', key: 'kb:download' },
    ],
  },
  {
    title: '智能体管理',
    key: 'agent',
    children: [
      { title: '查看智能体', key: 'agent:view' },
      { title: '创建智能体', key: 'agent:create' },
      { title: '编辑智能体', key: 'agent:edit' },
      { title: '删除智能体', key: 'agent:delete' },
      { title: '对话测试', key: 'agent:chat' },
    ],
  },
  {
    title: '培训考试',
    key: 'training',
    children: [
      { title: '查看培训', key: 'training:view' },
      { title: '创建培训', key: 'training:create' },
      { title: '管理题库', key: 'training:question' },
      { title: '创建试卷', key: 'training:exam' },
      { title: '查看成绩', key: 'training:score' },
    ],
  },
]

// 角色权限映射
const rolePermissions: Record<number, string[]> = {
  1: ['system', 'system:user', 'system:dept', 'system:role', 'system:log', 'kb', 'kb:view', 'kb:create', 'kb:edit', 'kb:delete', 'kb:upload', 'kb:download', 'agent', 'agent:view', 'agent:create', 'agent:edit', 'agent:delete', 'agent:chat', 'training', 'training:view', 'training:create', 'training:question', 'training:exam', 'training:score'],
  2: ['system:user', 'system:dept', 'kb:view', 'kb:upload', 'kb:download', 'agent:view', 'agent:chat', 'training:view', 'training:score'],
  3: ['kb:view', 'kb:upload', 'kb:download', 'agent:view', 'agent:chat', 'training:view'],
  7: ['kb:view', 'kb:download', 'agent:view', 'agent:chat', 'training:view'],
}

export default function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [permModalOpen, setPermModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<typeof rolesData[0] | null>(null)
  const [selectedRole, setSelectedRole] = useState<typeof rolesData[0] | null>(null)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [form] = Form.useForm()

  // 新建角色
  const handleCreate = () => {
    setEditingRole(null)
    form.resetFields()
    setModalOpen(true)
  }

  // 编辑角色
  const handleEdit = (role: typeof rolesData[0]) => {
    setEditingRole(role)
    form.setFieldsValue(role)
    setModalOpen(true)
  }

  // 配置权限
  const handlePermission = (role: typeof rolesData[0]) => {
    setSelectedRole(role)
    setCheckedKeys(rolePermissions[role.id] || [])
    setPermModalOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof rolesData[0]> = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {text}
          {record.is_system && <Tag color="red">系统</Tag>}
        </Space>
      ),
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Text code>{text}</Text>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'user_count',
      key: 'user_count',
      width: 100,
      render: (count) => (
        <Space>
          <UserOutlined />
          {count}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Badge status={status === 1 ? 'success' : 'default'} text={status === 1 ? '启用' : '禁用'} />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handlePermission(record)}
          >
            权限
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.is_system}
          >
            编辑
          </Button>
          <Popconfirm title="确定删除此角色？" disabled={record.is_system}>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={record.is_system}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>角色管理</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建角色
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={rolesData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 新建/编辑角色弹窗 */}
      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingRole ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item name="code" label="角色编码" rules={[{ required: true }]}>
            <Input placeholder="请输入角色编码（英文）" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 权限配置弹窗 */}
      <Modal
        title={`配置权限 - ${selectedRole?.name}`}
        open={permModalOpen}
        onOk={() => {
          console.log('已选权限:', checkedKeys)
          message.success('权限配置成功')
          setPermModalOpen(false)
        }}
        onCancel={() => setPermModalOpen(false)}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">勾选需要授予该角色的权限</Text>
        </div>
        <Tree
          checkable
          defaultExpandAll
          treeData={permissionTree}
          checkedKeys={checkedKeys}
          onCheck={(checked) => setCheckedKeys(checked as string[])}
        />
      </Modal>
    </div>
  )
}
