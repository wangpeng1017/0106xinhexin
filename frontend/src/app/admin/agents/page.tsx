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
  Tabs,
  Statistic,
  Badge,
  Descriptions,
  List,
  Transfer,
  Checkbox,
  Divider,
} from 'antd'
import {
  PlusOutlined,
  RobotOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  SendOutlined,
  ReloadOutlined,
  HistoryOutlined,
  StarOutlined,
  StarFilled,
  EyeOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

// 智能体类型配置
const agentTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string; abilities: string[] }> = {
  general: {
    icon: <RobotOutlined />,
    color: '#1890ff',
    label: '通用助手',
    abilities: ['多轮对话', '知识问答', '文档解读'],
  },
  process: {
    icon: <ExperimentOutlined />,
    color: '#52c41a',
    label: '工艺专家',
    abilities: ['工艺参数查询', '设备操作指导', '质量标准解读'],
  },
  drawing: {
    icon: <FileImageOutlined />,
    color: '#722ed1',
    label: '图纸解读',
    abilities: ['DXF/DWG解析', 'GDS版图分析', '零件清单提取'],
  },
  onboarding: {
    icon: <TeamOutlined />,
    color: '#fa8c16',
    label: '入职助手',
    abilities: ['公司介绍', '流程指引', '规章制度'],
  },
  it: {
    icon: <DesktopOutlined />,
    color: '#13c2c2',
    label: 'IT帮助台',
    abilities: ['系统使用', '故障排查', '账号管理'],
  },
  safety: {
    icon: <SafetyCertificateOutlined />,
    color: '#ff4d4f',
    label: '安全顾问',
    abilities: ['安全规程', '应急处理', '风险评估'],
  },
}

// 模拟智能体数据 - 增强版
const agentsData = [
  {
    id: 1,
    name: '通用知识助手',
    type: 'general',
    description: '全能型知识问答助手，可回答各类企业知识问题，支持多轮对话和上下文理解',
    icon: '🤖',
    status: 1,
    kb_names: ['通用知识库', '公司制度', '员工手册'],
    kb_ids: ['1', '1-1', '1-2'],
    model_name: 'qwen2.5-7b',
    temperature: 0.7,
    usage_count: 1256,
    favorite_count: 89,
    avg_score: 4.6,
    allowed_roles: ['全员'],
    system_prompt: '你是新核芯科技的AI助手，帮助员工解答各类问题。请基于提供的知识库内容回答问题。',
    created_at: '2024-01-01',
    updated_at: '2024-01-05',
  },
  {
    id: 2,
    name: '工艺查询专家',
    type: 'process',
    description: '半导体生产工艺专业问答助手，精通晶圆制造、封装测试等工艺流程，可查询工艺参数和设备规范',
    icon: '🔬',
    status: 1,
    kb_names: ['生产知识库', '工艺规程', '设备手册'],
    kb_ids: ['3', '2-2', '3-1'],
    model_name: 'qwen2.5-7b',
    temperature: 0.3,
    usage_count: 892,
    favorite_count: 67,
    avg_score: 4.8,
    allowed_roles: ['研发部', '生产部', '质量部'],
    system_prompt: '你是半导体工艺专家，精通晶圆制造、光刻、蚀刻、封装等工艺。回答时请引用具体的工艺参数和规范。',
    created_at: '2024-01-02',
    updated_at: '2024-01-05',
  },
  {
    id: 3,
    name: '图纸解读助手',
    type: 'drawing',
    description: '专业解读 DXF、DWG、GDS 等工程图纸，提取图层信息、零件清单、设计参数等元数据',
    icon: '📐',
    status: 1,
    kb_names: ['研发知识库', '设计图纸'],
    kb_ids: ['2', '2-1'],
    model_name: 'qwen2.5-7b',
    temperature: 0.2,
    usage_count: 456,
    favorite_count: 34,
    avg_score: 4.5,
    allowed_roles: ['研发部', '工程部'],
    system_prompt: '你是工程图纸解读专家，可以分析 DXF/DWG/GDS 等格式图纸的元数据。请提供图层、尺寸、材料等详细信息。',
    created_at: '2024-01-03',
    updated_at: '2024-01-05',
  },
  {
    id: 4,
    name: 'IT帮助台',
    type: 'it',
    description: 'IT系统使用问答助手，解决 OA、ERP、MES 等系统使用问题和常见故障排查',
    icon: '💻',
    status: 1,
    kb_names: ['IT知识库', '系统操作手册'],
    kb_ids: ['4'],
    model_name: 'qwen2.5-7b',
    temperature: 0.5,
    usage_count: 567,
    favorite_count: 45,
    avg_score: 4.3,
    allowed_roles: ['全员'],
    system_prompt: '你是 IT 支持专员，帮助员工解决系统使用问题。请提供清晰的操作步骤和截图说明位置。',
    created_at: '2024-01-02',
    updated_at: '2024-01-04',
  },
  {
    id: 5,
    name: '新员工入职助手',
    type: 'onboarding',
    description: '新员工入职引导助手，帮助新员工快速了解公司文化、组织架构、规章制度和办事流程',
    icon: '👋',
    status: 1,
    kb_names: ['员工手册', '公司制度', '入职指南'],
    kb_ids: ['1-2', '1-1'],
    model_name: 'qwen2.5-7b',
    temperature: 0.7,
    usage_count: 234,
    favorite_count: 28,
    avg_score: 4.7,
    allowed_roles: ['全员'],
    system_prompt: '你是新员工入职引导助手，热情友好地帮助新同事了解公司。回答要亲切易懂，多用示例说明。',
    created_at: '2024-01-03',
    updated_at: '2024-01-05',
  },
  {
    id: 6,
    name: '安全生产顾问',
    type: 'safety',
    description: '安全生产专业顾问，提供安全规程查询、隐患排查指导、应急处理方案等服务',
    icon: '🛡️',
    status: 1,
    kb_names: ['安全规程', '应急预案'],
    kb_ids: ['3-2'],
    model_name: 'qwen2.5-7b',
    temperature: 0.2,
    usage_count: 189,
    favorite_count: 22,
    avg_score: 4.9,
    allowed_roles: ['全员'],
    system_prompt: '你是安全生产顾问，严格遵循安全规程回答问题。涉及危险操作时必须强调安全注意事项。',
    created_at: '2024-01-04',
    updated_at: '2024-01-05',
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
      { title: '设计图纸', value: '2-1' },
      { title: '工艺规程', value: '2-2' },
    ],
  },
  {
    title: '生产知识库',
    value: '3',
    children: [
      { title: '设备手册', value: '3-1' },
      { title: '操作规程', value: '3-2' },
    ],
  },
  {
    title: 'IT知识库',
    value: '4',
  },
]

// 角色数据
const rolesData = [
  { key: 'all', title: '全员' },
  { key: 'admin', title: '管理员' },
  { key: 'rd', title: '研发部' },
  { key: 'prod', title: '生产部' },
  { key: 'qa', title: '质量部' },
  { key: 'it', title: '信息技术部' },
  { key: 'hr', title: '人力资源部' },
]

// 模拟对话历史
const mockChatHistory = [
  { role: 'assistant', content: '你好！我是工艺查询专家，可以帮你查询生产工艺参数、设备操作规范等信息。有什么可以帮助你的吗？' },
  { role: 'user', content: '晶圆清洗的 SC-1 清洗液配比是多少？' },
  { role: 'assistant', content: '根据《晶圆清洗工艺规程 V2.0》，SC-1 清洗液的配比如下：\n\n**配比**: NH₄OH : H₂O₂ : H₂O = 1 : 1 : 5\n\n**工艺参数**:\n- 温度：75-80°C\n- 时间：10分钟\n- 作用：去除有机污染物和颗粒\n\n需要我详细说明清洗流程吗？' },
]

export default function AgentsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<typeof agentsData[0] | null>(null)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<typeof agentsData[0] | null>(null)
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState(mockChatHistory)
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [form] = Form.useForm()

  // 打开编辑弹窗
  const handleEdit = (agent: typeof agentsData[0]) => {
    setEditingAgent(agent)
    form.setFieldsValue({
      ...agent,
      status: agent.status === 1,
    })
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
    setChatMessages([
      { role: 'assistant', content: `你好！我是${agent.name}，${agent.description.slice(0, 30)}...有什么可以帮助你的吗？` }
    ])
    setChatModalOpen(true)
  }

  // 打开权限设置
  const handlePermission = (agent: typeof agentsData[0]) => {
    setSelectedAgent(agent)
    setTargetKeys(agent.allowed_roles.includes('全员') ? ['all'] : agent.allowed_roles.map(r => rolesData.find(role => role.title === r)?.key || ''))
    setPermissionModalOpen(true)
  }

  // 查看详情
  const handleViewDetail = (agent: typeof agentsData[0]) => {
    setSelectedAgent(agent)
    setDetailModalOpen(true)
  }

  // 发送消息
  const handleSendMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: chatInput },
      { role: 'assistant', content: '正在思考中...' }
    ])
    setChatInput('')

    // 模拟回复
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '这是一个模拟回复。在实际系统中，这里会调用后端 API 获取智能体的真实回答。回答会基于关联的知识库内容生成。' }
      ])
    }, 1000)
  }

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values)
      message.success(editingAgent ? '更新成功' : '创建成功')
      setModalOpen(false)
    })
  }

  // 过滤智能体
  const filteredAgents = selectedType === 'all'
    ? agentsData
    : agentsData.filter(a => a.type === selectedType)

  // 统计数据
  const stats = {
    total: agentsData.length,
    active: agentsData.filter(a => a.status === 1).length,
    totalUsage: agentsData.reduce((sum, a) => sum + a.usage_count, 0),
    avgScore: (agentsData.reduce((sum, a) => sum + a.avg_score, 0) / agentsData.length).toFixed(1),
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>智能体管理</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="智能体总数" value={stats.total} prefix={<RobotOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="已启用" value={stats.active} valueStyle={{ color: '#52c41a' }} prefix={<ThunderboltOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总使用次数" value={stats.totalUsage} prefix={<MessageOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均评分" value={stats.avgScore} prefix={<StarFilled style={{ color: '#faad14' }} />} suffix="/ 5" />
          </Card>
        </Col>
      </Row>

      {/* 智能体类型筛选 + 创建按钮 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="middle">
            <Tag
              color={selectedType === 'all' ? 'blue' : 'default'}
              style={{ cursor: 'pointer', padding: '4px 12px' }}
              onClick={() => setSelectedType('all')}
            >
              全部 ({agentsData.length})
            </Tag>
            {Object.entries(agentTypeConfig).map(([key, config]) => (
              <Tag
                key={key}
                color={selectedType === key ? config.color : 'default'}
                style={{ cursor: 'pointer', padding: '4px 12px' }}
                onClick={() => setSelectedType(key)}
              >
                {config.icon} {config.label} ({agentsData.filter(a => a.type === key).length})
              </Tag>
            ))}
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            创建智能体
          </Button>
        </div>
      </Card>

      {/* 智能体卡片列表 */}
      <Row gutter={[16, 16]}>
        {filteredAgents.map((agent) => {
          const typeConfig = agentTypeConfig[agent.type]
          return (
            <Col xs={24} sm={12} lg={8} key={agent.id}>
              <Card
                hoverable
                actions={[
                  <Tooltip title="对话测试" key="chat">
                    <MessageOutlined onClick={() => handleChat(agent)} />
                  </Tooltip>,
                  <Tooltip title="查看详情" key="detail">
                    <EyeOutlined onClick={() => handleViewDetail(agent)} />
                  </Tooltip>,
                  <Tooltip title="编辑" key="edit">
                    <EditOutlined onClick={() => handleEdit(agent)} />
                  </Tooltip>,
                  <Tooltip title="权限设置" key="permission">
                    <UserOutlined onClick={() => handlePermission(agent)} />
                  </Tooltip>,
                  <Popconfirm title="确定删除此智能体？" key="delete" onConfirm={() => message.success('删除成功')}>
                    <DeleteOutlined style={{ color: '#ff4d4f' }} />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar size={56} style={{ backgroundColor: typeConfig?.color || '#1890ff', fontSize: 28 }}>
                      {agent.icon}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <span>{agent.name}</span>
                        <Tag color={agent.status === 1 ? 'success' : 'default'}>
                          {agent.status === 1 ? '启用' : '禁用'}
                        </Tag>
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <Tag color={typeConfig?.color} style={{ marginBottom: 8 }}>{typeConfig?.label}</Tag>
                      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8, minHeight: 44 }}>
                        {agent.description}
                      </Paragraph>
                      <div style={{ marginBottom: 8 }}>
                        {agent.kb_names.slice(0, 3).map((kb) => (
                          <Tag key={kb} style={{ marginBottom: 4 }}>{kb}</Tag>
                        ))}
                        {agent.kb_names.length > 3 && <Tag>+{agent.kb_names.length - 3}</Tag>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">
                          <MessageOutlined /> {agent.usage_count}
                        </Text>
                        <Text type="secondary">
                          <StarFilled style={{ color: '#faad14' }} /> {agent.avg_score}
                        </Text>
                        <Text type="secondary">
                          <TeamOutlined /> {agent.allowed_roles.join('、')}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* 创建/编辑智能体弹窗 */}
      <Modal
        title={editingAgent ? '编辑智能体' : '创建智能体'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={720}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="icon" label="图标">
                <Input placeholder="输入 emoji，如 🤖" style={{ fontSize: 20 }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="name" label="智能体名称" rules={[{ required: true }]}>
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="类型" rules={[{ required: true }]} initialValue="general">
                <Select>
                  {Object.entries(agentTypeConfig).map(([key, config]) => (
                    <Select.Option key={key} value={key}>
                      <Space>{config.icon} {config.label}</Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item name="kb_ids" label="关联知识库" rules={[{ required: true, message: '请选择至少一个知识库' }]}>
            <TreeSelect
              treeData={kbTreeData}
              placeholder="选择关联的知识库（支持多选）"
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item name="system_prompt" label="系统提示词（定义智能体角色和行为）">
            <TextArea
              rows={4}
              placeholder="设置智能体的角色和行为规则..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="model_name" label="模型" initialValue="qwen2.5-7b">
                <Select
                  options={[
                    { value: 'qwen2.5-7b', label: 'Qwen2.5-7B (推荐)' },
                    { value: 'qwen2.5-14b', label: 'Qwen2.5-14B (高性能)' },
                    { value: 'qwen2.5-72b', label: 'Qwen2.5-72B (最强)' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="temperature" label="温度参数" initialValue={0.7}>
                <Slider min={0} max={1} step={0.1} marks={{ 0: '精确', 0.5: '平衡', 1: '创意' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 对话测试弹窗 */}
      <Modal
        title={
          <Space>
            <Avatar style={{ backgroundColor: agentTypeConfig[selectedAgent?.type || 'general']?.color }}>
              {selectedAgent?.icon}
            </Avatar>
            <div>
              <div>{selectedAgent?.name}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>{agentTypeConfig[selectedAgent?.type || 'general']?.label}</Text>
            </div>
          </Space>
        }
        open={chatModalOpen}
        onCancel={() => setChatModalOpen(false)}
        footer={null}
        width={800}
      >
        <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
          {/* 消息区域 */}
          <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
            {chatMessages.map((msg, index) => (
              <div key={index} style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8
              }}>
                {msg.role === 'assistant' && (
                  <Avatar style={{ backgroundColor: agentTypeConfig[selectedAgent?.type || 'general']?.color }}>
                    {selectedAgent?.icon}
                  </Avatar>
                )}
                <div style={{
                  background: msg.role === 'user' ? '#1890ff' : '#fff',
                  color: msg.role === 'user' ? '#fff' : 'inherit',
                  padding: '10px 14px',
                  borderRadius: 8,
                  maxWidth: '70%',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <Avatar icon={<UserOutlined />} />
                )}
              </div>
            ))}
          </div>

          {/* 快捷问题 */}
          <div style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Text type="secondary" style={{ marginRight: 8 }}>快捷问题：</Text>
            <Space wrap>
              {['晶圆清洗流程是什么？', '设备维护周期多久？', '如何查看工艺参数？'].map(q => (
                <Tag
                  key={q}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setChatInput(q)}
                >
                  {q}
                </Tag>
              ))}
            </Space>
          </div>

          {/* 输入区域 */}
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <TextArea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="输入消息... (按 Enter 发送)"
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ flex: 1 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
              发送
            </Button>
          </div>
        </div>
      </Modal>

      {/* 权限设置弹窗 */}
      <Modal
        title={<><UserOutlined /> 权限设置 - {selectedAgent?.name}</>}
        open={permissionModalOpen}
        onOk={() => {
          message.success('权限设置已保存')
          setPermissionModalOpen(false)
        }}
        onCancel={() => setPermissionModalOpen(false)}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">选择可以使用此智能体的角色：</Text>
        </div>
        <Checkbox.Group
          value={targetKeys}
          onChange={(values) => setTargetKeys(values as string[])}
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 16]}>
            {rolesData.map(role => (
              <Col span={8} key={role.key}>
                <Checkbox value={role.key}>
                  <Space>
                    <TeamOutlined />
                    {role.title}
                  </Space>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>

        <Divider />

        <div>
          <Text strong>高级设置：</Text>
          <div style={{ marginTop: 12 }}>
            <Checkbox>允许用户查看对话历史</Checkbox>
          </div>
          <div style={{ marginTop: 8 }}>
            <Checkbox>允许用户导出对话记录</Checkbox>
          </div>
          <div style={{ marginTop: 8 }}>
            <Checkbox defaultChecked>记录使用日志</Checkbox>
          </div>
        </div>
      </Modal>

      {/* 智能体详情弹窗 */}
      <Modal
        title={<><EyeOutlined /> 智能体详情</>}
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="chat" type="primary" icon={<MessageOutlined />} onClick={() => {
            setDetailModalOpen(false)
            if (selectedAgent) handleChat(selectedAgent)
          }}>
            开始对话
          </Button>,
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedAgent && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Avatar size={80} style={{ backgroundColor: agentTypeConfig[selectedAgent.type]?.color, fontSize: 40 }}>
                {selectedAgent.icon}
              </Avatar>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ marginBottom: 8 }}>{selectedAgent.name}</Title>
                <Space>
                  <Tag color={agentTypeConfig[selectedAgent.type]?.color}>
                    {agentTypeConfig[selectedAgent.type]?.label}
                  </Tag>
                  <Tag color={selectedAgent.status === 1 ? 'success' : 'default'}>
                    {selectedAgent.status === 1 ? '启用' : '禁用'}
                  </Tag>
                </Space>
                <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>{selectedAgent.description}</Paragraph>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Statistic title="使用次数" value={selectedAgent.usage_count} prefix={<MessageOutlined />} />
              </Col>
              <Col span={6}>
                <Statistic title="收藏数" value={selectedAgent.favorite_count} prefix={<StarOutlined />} />
              </Col>
              <Col span={6}>
                <Statistic title="评分" value={selectedAgent.avg_score} prefix={<StarFilled style={{ color: '#faad14' }} />} suffix="/ 5" />
              </Col>
              <Col span={6}>
                <Statistic title="可用角色" value={selectedAgent.allowed_roles.length} prefix={<TeamOutlined />} />
              </Col>
            </Row>

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="关联知识库" span={2}>
                {selectedAgent.kb_names.map(kb => <Tag key={kb} color="blue">{kb}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="使用模型">{selectedAgent.model_name}</Descriptions.Item>
              <Descriptions.Item label="温度参数">{selectedAgent.temperature}</Descriptions.Item>
              <Descriptions.Item label="可用角色" span={2}>
                {selectedAgent.allowed_roles.map(r => <Tag key={r}>{r}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{selectedAgent.created_at}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{selectedAgent.updated_at}</Descriptions.Item>
            </Descriptions>

            <Card title={<><BulbOutlined /> 能力标签</>} size="small" style={{ marginTop: 16 }}>
              <Space wrap>
                {agentTypeConfig[selectedAgent.type]?.abilities.map(ability => (
                  <Tag key={ability} color="green">{ability}</Tag>
                ))}
              </Space>
            </Card>

            <Card title={<><FileTextOutlined /> 系统提示词</>} size="small" style={{ marginTop: 16 }}>
              <Paragraph style={{ marginBottom: 0, background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {selectedAgent.system_prompt}
              </Paragraph>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  )
}
