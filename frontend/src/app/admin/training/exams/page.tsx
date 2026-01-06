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
  Row,
  Col,
  Progress,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { TextArea } = Input

// 模拟试卷数据
const examsData = [
  {
    id: 1,
    title: '新员工入职培训考试',
    scene_name: '新员工入职培训',
    question_count: 20,
    duration: 60,
    total_score: 100,
    pass_score: 60,
    status: 1,
    take_count: 45,
    pass_rate: 90,
    created_at: '2024-01-01',
  },
  {
    id: 2,
    title: '安全生产培训考核',
    scene_name: '安全生产培训',
    question_count: 30,
    duration: 90,
    total_score: 100,
    pass_score: 80,
    status: 1,
    take_count: 78,
    pass_rate: 85,
    created_at: '2024-01-02',
  },
  {
    id: 3,
    title: '质量管理体系培训',
    scene_name: '质量管理培训',
    question_count: 25,
    duration: 60,
    total_score: 100,
    pass_score: 70,
    status: 0,
    take_count: 0,
    pass_rate: 0,
    created_at: '2024-01-03',
  },
]

// 场景选项
const sceneOptions = [
  { value: 1, label: '新员工入职培训' },
  { value: 2, label: '安全生产培训' },
  { value: 3, label: '质量管理培训' },
  { value: 4, label: '设备操作培训' },
]

export default function ExamsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<typeof examsData[0] | null>(null)
  const [form] = Form.useForm()
  const [generateForm] = Form.useForm()

  // 新建
  const handleCreate = () => {
    setEditingExam(null)
    form.resetFields()
    setModalOpen(true)
  }

  // 编辑
  const handleEdit = (exam: typeof examsData[0]) => {
    setEditingExam(exam)
    form.setFieldsValue(exam)
    setModalOpen(true)
  }

  // 试卷表格列
  const columns: ColumnsType<typeof examsData[0]> = [
    {
      title: '试卷名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '培训场景',
      dataIndex: 'scene_name',
      key: 'scene_name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '题目数',
      dataIndex: 'question_count',
      key: 'question_count',
      width: 80,
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
    },
    {
      title: '及格分',
      dataIndex: 'pass_score',
      key: 'pass_score',
      width: 100,
      render: (score, record) => `${score}/${record.total_score}`,
    },
    {
      title: '参考人数',
      dataIndex: 'take_count',
      key: 'take_count',
      width: 100,
    },
    {
      title: '通过率',
      dataIndex: 'pass_rate',
      key: 'pass_rate',
      width: 120,
      render: (rate) => (
        <Progress percent={rate} size="small" style={{ width: 80 }} />
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
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>预览</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除此试卷？">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>试卷管理</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Select
              style={{ width: 180 }}
              placeholder="培训场景"
              options={sceneOptions}
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
          <Space>
            <Button icon={<PlayCircleOutlined />} onClick={() => setGenerateModalOpen(true)}>
              智能组卷
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建试卷
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={examsData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 新建/编辑试卷弹窗 */}
      <Modal
        title={editingExam ? '编辑试卷' : '新建试卷'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingExam ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="试卷名称" rules={[{ required: true }]}>
            <Input placeholder="请输入试卷名称" />
          </Form.Item>
          <Form.Item name="scene_id" label="培训场景" rules={[{ required: true }]}>
            <Select options={sceneOptions} placeholder="选择培训场景" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="duration" label="考试时长(分钟)" rules={[{ required: true }]}>
                <InputNumber min={10} max={180} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="total_score" label="总分" rules={[{ required: true }]}>
                <InputNumber min={10} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pass_score" label="及格分" rules={[{ required: true }]}>
                <InputNumber min={0} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 智能组卷弹窗 */}
      <Modal
        title="智能组卷"
        open={generateModalOpen}
        onOk={() => {
          generateForm.validateFields().then((values) => {
            console.log(values)
            message.success('生成成功')
            setGenerateModalOpen(false)
          })
        }}
        onCancel={() => setGenerateModalOpen(false)}
        width={500}
      >
        <Form form={generateForm} layout="vertical">
          <Form.Item name="scene_id" label="培训场景" rules={[{ required: true }]}>
            <Select options={sceneOptions} placeholder="选择培训场景" />
          </Form.Item>
          <Form.Item name="title" label="试卷名称" rules={[{ required: true }]}>
            <Input placeholder="请输入试卷名称" />
          </Form.Item>
          <Form.Item name="question_count" label="题目数量" rules={[{ required: true }]}>
            <InputNumber min={5} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="难度比例">
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item name={['difficulty_ratio', 'easy']} noStyle initialValue={30}>
                  <InputNumber min={0} max={100} addonAfter="% 简单" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['difficulty_ratio', 'medium']} noStyle initialValue={50}>
                  <InputNumber min={0} max={100} addonAfter="% 中等" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['difficulty_ratio', 'hard']} noStyle initialValue={20}>
                  <InputNumber min={0} max={100} addonAfter="% 困难" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
