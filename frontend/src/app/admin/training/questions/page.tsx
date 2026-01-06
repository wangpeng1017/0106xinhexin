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
  Radio,
  message,
  Popconfirm,
  Typography,
  Checkbox,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title } = Typography
const { TextArea } = Input
const { Search } = Input

// 模拟题目数据
const questionsData = [
  {
    id: 1,
    content: '半导体生产中，晶圆清洗的主要目的是什么？',
    type: 'single',
    scene_name: '安全生产培训',
    options: ['去除杂质', '增加厚度', '改变颜色', '降低温度'],
    answer: 'A',
    difficulty: 2,
    created_at: '2024-01-01',
  },
  {
    id: 2,
    content: '以下哪些是光刻工艺的关键参数？（多选）',
    type: 'multiple',
    scene_name: '安全生产培训',
    options: ['曝光时间', '显影温度', '光刻胶厚度', '对准精度'],
    answer: 'ABCD',
    difficulty: 3,
    created_at: '2024-01-02',
  },
  {
    id: 3,
    content: '进入洁净室前必须穿戴防护服。',
    type: 'judge',
    scene_name: '新员工入职培训',
    options: ['正确', '错误'],
    answer: 'A',
    difficulty: 1,
    created_at: '2024-01-03',
  },
  {
    id: 4,
    content: '芯片封装的主要目的包括____和____。',
    type: 'fill',
    scene_name: '设备操作培训',
    options: [],
    answer: '保护芯片,电气连接',
    difficulty: 2,
    created_at: '2024-01-04',
  },
]

// 题型映射
const questionTypeMap: Record<string, { text: string; color: string }> = {
  single: { text: '单选题', color: 'blue' },
  multiple: { text: '多选题', color: 'purple' },
  judge: { text: '判断题', color: 'green' },
  fill: { text: '填空题', color: 'orange' },
}

// 难度映射
const difficultyMap: Record<number, { text: string; color: string }> = {
  1: { text: '简单', color: 'success' },
  2: { text: '中等', color: 'warning' },
  3: { text: '困难', color: 'error' },
}

// 场景选项
const sceneOptions = [
  { value: 1, label: '新员工入职培训' },
  { value: 2, label: '安全生产培训' },
  { value: 3, label: '质量管理培训' },
  { value: 4, label: '设备操作培训' },
]

export default function QuestionsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<typeof questionsData[0] | null>(null)
  const [questionType, setQuestionType] = useState<string>('single')
  const [form] = Form.useForm()

  // 新建
  const handleCreate = () => {
    setEditingQuestion(null)
    setQuestionType('single')
    form.resetFields()
    setModalOpen(true)
  }

  // 编辑
  const handleEdit = (question: typeof questionsData[0]) => {
    setEditingQuestion(question)
    setQuestionType(question.type)
    form.setFieldsValue(question)
    setModalOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof questionsData[0]> = [
    {
      title: '题目内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={questionTypeMap[type].color}>
          {questionTypeMap[type].text}
        </Tag>
      ),
    },
    {
      title: '培训场景',
      dataIndex: 'scene_name',
      key: 'scene_name',
      width: 150,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 80,
      render: (d) => (
        <Tag color={difficultyMap[d].color}>
          {difficultyMap[d].text}
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
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？">
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>题库管理</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Search placeholder="搜索题目" style={{ width: 250 }} />
            <Select
              style={{ width: 150 }}
              placeholder="培训场景"
              options={sceneOptions}
              allowClear
            />
            <Select
              style={{ width: 120 }}
              placeholder="题型"
              options={Object.entries(questionTypeMap).map(([value, { text }]) => ({ value, label: text }))}
              allowClear
            />
            <Select
              style={{ width: 100 }}
              placeholder="难度"
              options={Object.entries(difficultyMap).map(([value, { text }]) => ({ value: Number(value), label: text }))}
              allowClear
            />
          </Space>
          <Space>
            <Button icon={<ImportOutlined />}>批量导入</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              添加题目
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={questionsData}
          rowKey="id"
          pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 题` }}
        />
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingQuestion ? '编辑题目' : '添加题目'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingQuestion ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="scene_id" label="培训场景" rules={[{ required: true }]}>
            <Select options={sceneOptions} placeholder="选择培训场景" />
          </Form.Item>

          <Form.Item name="type" label="题型" rules={[{ required: true }]} initialValue="single">
            <Radio.Group onChange={(e) => setQuestionType(e.target.value)}>
              <Radio.Button value="single">单选题</Radio.Button>
              <Radio.Button value="multiple">多选题</Radio.Button>
              <Radio.Button value="judge">判断题</Radio.Button>
              <Radio.Button value="fill">填空题</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="content" label="题目内容" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入题目内容" />
          </Form.Item>

          {(questionType === 'single' || questionType === 'multiple') && (
            <>
              <Form.Item name="option_a" label="选项A" rules={[{ required: true }]}>
                <Input placeholder="选项A" />
              </Form.Item>
              <Form.Item name="option_b" label="选项B" rules={[{ required: true }]}>
                <Input placeholder="选项B" />
              </Form.Item>
              <Form.Item name="option_c" label="选项C">
                <Input placeholder="选项C（可选）" />
              </Form.Item>
              <Form.Item name="option_d" label="选项D">
                <Input placeholder="选项D（可选）" />
              </Form.Item>
            </>
          )}

          <Form.Item name="answer" label="正确答案" rules={[{ required: true }]}>
            {questionType === 'single' && (
              <Radio.Group>
                <Radio value="A">A</Radio>
                <Radio value="B">B</Radio>
                <Radio value="C">C</Radio>
                <Radio value="D">D</Radio>
              </Radio.Group>
            )}
            {questionType === 'multiple' && (
              <Checkbox.Group>
                <Checkbox value="A">A</Checkbox>
                <Checkbox value="B">B</Checkbox>
                <Checkbox value="C">C</Checkbox>
                <Checkbox value="D">D</Checkbox>
              </Checkbox.Group>
            )}
            {questionType === 'judge' && (
              <Radio.Group>
                <Radio value="A">正确</Radio>
                <Radio value="B">错误</Radio>
              </Radio.Group>
            )}
            {questionType === 'fill' && (
              <Input placeholder="多个答案用逗号分隔" />
            )}
          </Form.Item>

          <Form.Item name="difficulty" label="难度" rules={[{ required: true }]} initialValue={2}>
            <Radio.Group>
              <Radio.Button value={1}>简单</Radio.Button>
              <Radio.Button value={2}>中等</Radio.Button>
              <Radio.Button value={3}>困难</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="analysis" label="答案解析">
            <TextArea rows={2} placeholder="请输入答案解析（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
