'use client'

import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  TreeSelect,
  Tag,
  Avatar,
  Space,
  Typography,
  Switch,
  Slider,
  message,
  Popconfirm,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  RobotOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

// 模拟智能体数据
const agentsData = [
  {
    id: 1,
    name: '通用助手',
    description: '全能型知识问答助手，可回答各类企业知识问题',
    icon: '🤖',
    status: 1,
    kb_names: ['通用知识库', '公司制度'],
    model_name: 'qwen2.5-7b',
    usage_count: 1256,
  },
  {
    id: 2,
    name: '工艺专家',
    description: '半导体生产工艺专业问答助手，帮助解答生产工艺相关问题',
    icon: '🔬',
    status: 1,
    kb_names: ['生产知识库', '工艺规程'],
    model_name: 'qwen2.5-7b',
    usage_count: 892,
  },
  {
    id: 3,
    name: 'IT帮助台',
    description: 'IT系统使用问答助手，解决IT系统使用问题和故障排查',
    icon: '💻',
    status: 1,
    kb_names: ['IT知识库'],
    model_name: 'qwen2.5-7b',
    usage_count: 567,
  },
  {
    id: 4,
    name: '入职助手',
    description: '新员工入职引导助手，帮助新员工快速了解公司',
    icon: '👋',
    status: 0,
    kb_names: ['员工手册', '公司制度'],
    model_name: 'qwen2.5-7b',
    usage_count: 234,
  },
]

// 知识库树数据
const kbTreeData = [
  {
    title: '通用知识库',
    value: '1',
    children: [
      { title: '公司制度', value: '1-1' },
      { title: '员工手册', value: '1-2' },
    ],
  },
  {
    title: '研发知识库',
    value: '2',
    children: [
      { title: '设计文档', value: '2-1' },
      { title: '工艺规程', value: '2-2' },
    ],
  },
  {
    title: '生产知识库',
    value: '3',
  },
  {
    title: 'IT知识库',
    value: '4',
  },
]

export default function AgentsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<typeof agentsData[0] | null>(null)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<typeof agentsData[0] | null>(null)
  const [form] = Form.useForm()

  // 打开编辑弹窗
  const handleEdit = (agent: typeof agentsData[0]) => {
    setEditingAgent(agent)
    form.setFieldsValue(agent)
    setModalOpen(true)
  }

  // 打开新建弹窗
  const handleCreate = () => {
    setEditingAgent(null)
    form.resetFields()
    setModalOpen(true)
  }

  // 打开对话窗口
  const handleChat = (agent: typeof agentsData[0]) => {
    setSelectedAgent(agent)
    setChatModalOpen(true)
  }

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values)
      message.success(editingAgent ? '更新成功' : '创建成功')
      setModalOpen(false)
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>智能体管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建智能体
        </Button>
      </div>

      {/* 智能体卡片列表 */}
      <Row gutter={[16, 16]}>
        {agentsData.map((agent) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={agent.id}>
            <Card
              hoverable
              actions={[
                <Tooltip title="对话测试" key="chat">
                  <MessageOutlined onClick={() => handleChat(agent)} />
                </Tooltip>,
                <Tooltip title="编辑" key="edit">
                  <EditOutlined onClick={() => handleEdit(agent)} />
                </Tooltip>,
                <Tooltip title="权限设置" key="permission">
                  <UserOutlined />
                </Tooltip>,
                <Popconfirm title="确定删除此智能体？" key="delete">
                  <DeleteOutlined style={{ color: '#ff4d4f' }} />
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                avatar={
                  <Avatar size={48} style={{ backgroundColor: '#f0f0f0', fontSize: 24 }}>
                    {agent.icon}
                  </Avatar>
                }
                title={
                  <Space>
                    {agent.name}
                    <Tag color={agent.status === 1 ? 'success' : 'default'}>
                      {agent.status === 1 ? '启用' : '禁用'}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                      {agent.description}
                    </Paragraph>
                    <div style={{ marginBottom: 8 }}>
                      {agent.kb_names.map((kb) => (
                        <Tag key={kb} color="blue" style={{ marginBottom: 4 }}>{kb}</Tag>
                      ))}
                    </div>
                    <Text type="secondary">使用次数: {agent.usage_count}</Text>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 创建/编辑智能体弹窗 */}
      <Modal
        title={editingAgent ? '编辑智能体' : '创建智能体'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="智能体名称" rules={[{ required: true }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="icon" label="图标">
                <Input placeholder="输入 emoji，如 🤖" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item name="kb_ids" label="关联知识库" rules={[{ required: true }]}>
            <TreeSelect
              treeData={kbTreeData}
              placeholder="选择关联的知识库"
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
            />
          </Form.Item>

          <Form.Item name="system_prompt" label="系统提示词">
            <TextArea
              rows={4}
              placeholder="设置智能体的角色和行为规则..."
              defaultValue="你是新核芯科技的AI助手，帮助员工解答各类问题。请基于提供的知识库内容回答问题，如果无法从知识库中找到答案，请如实告知。"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="model_name" label="模型" initialValue="qwen2.5-7b">
                <Select
                  options={[
                    { value: 'qwen2.5-7b', label: 'Qwen2.5-7B (推荐)' },
                    { value: 'qwen2.5-14b', label: 'Qwen2.5-14B' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="temperature" label="温度参数" initialValue={0.7}>
                <Slider min={0} max={1} step={0.1} marks={{ 0: '精确', 0.5: '平衡', 1: '创意' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 对话测试弹窗 */}
      <Modal
        title={
          <Space>
            <Avatar style={{ backgroundColor: '#f0f0f0' }}>{selectedAgent?.icon}</Avatar>
            {selectedAgent?.name}
          </Space>
        }
        open={chatModalOpen}
        onCancel={() => setChatModalOpen(false)}
        footer={null}
        width={720}
      >
        <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
          {/* 消息区域 */}
          <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Avatar style={{ backgroundColor: '#f0f0f0' }}>{selectedAgent?.icon}</Avatar>
                <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 8, maxWidth: '80%' }}>
                  你好！我是{selectedAgent?.name}，有什么可以帮助你的吗？
                </div>
              </div>
            </div>
          </div>

          {/* 输入区域 */}
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <Input.TextArea
              placeholder="输入消息..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ flex: 1 }}
            />
            <Button type="primary">发送</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
