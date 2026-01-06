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
  Select,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Switch,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { TextArea } = Input

// 模拟培训场景数据
const scenesData = [
  {
    id: 1,
    name: '新员工入职培训',
    description: '面向新入职员工的基础培训，包含公司制度、安全规范等内容',
    kb_names: ['员工手册', '公司制度'],
    question_count: 50,
    exam_count: 3,
    status: 1,
    created_at: '2024-01-01',
  },
  {
    id: 2,
    name: '安全生产培训',
    description: '生产线安全操作规范培训，定期考核',
    kb_names: ['安全规程', '操作手册'],
    question_count: 80,
    exam_count: 5,
    status: 1,
    created_at: '2024-01-02',
  },
  {
    id: 3,
    name: '质量管理培训',
    description: '质量管理体系和流程培训',
    kb_names: ['质量手册'],
    question_count: 40,
    exam_count: 2,
    status: 1,
    created_at: '2024-01-03',
  },
  {
    id: 4,
    name: '设备操作培训',
    description: '生产设备操作技能培训',
    kb_names: ['设备手册', '操作规程'],
    question_count: 60,
    exam_count: 4,
    status: 0,
    created_at: '2024-01-04',
  },
]

// 知识库选项
const kbOptions = [
  { value: 1, label: '员工手册' },
  { value: 2, label: '公司制度' },
  { value: 3, label: '安全规程' },
  { value: 4, label: '操作手册' },
  { value: 5, label: '质量手册' },
  { value: 6, label: '设备手册' },
  { value: 7, label: '操作规程' },
]

export default function ScenesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingScene, setEditingScene] = useState<typeof scenesData[0] | null>(null)
  const [form] = Form.useForm()

  // 新建
  const handleCreate = () => {
    setEditingScene(null)
    form.resetFields()
    setModalOpen(true)
  }

  // 编辑
  const handleEdit = (scene: typeof scenesData[0]) => {
    setEditingScene(scene)
    form.setFieldsValue(scene)
    setModalOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof scenesData[0]> = [
    {
      title: '场景名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
        </div>
      ),
    },
    {
      title: '关联知识库',
      dataIndex: 'kb_names',
      key: 'kb_names',
      width: 200,
      render: (names: string[]) => (
        <Space wrap>
          {names.map((name) => (
            <Tag key={name} color="blue">{name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '题目数',
      dataIndex: 'question_count',
      key: 'question_count',
      width: 100,
    },
    {
      title: '试卷数',
      dataIndex: 'exam_count',
      key: 'exam_count',
      width: 100,
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此培训场景？">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>培训场景管理</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建场景
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={scenesData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingScene ? '编辑培训场景' : '新建培训场景'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingScene ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="场景名称" rules={[{ required: true }]}>
            <Input placeholder="请输入培训场景名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="kb_ids" label="关联知识库" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              options={kbOptions}
              placeholder="选择关联的知识库"
            />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
