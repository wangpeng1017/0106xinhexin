'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Layout,
  Card,
  Input,
  Button,
  Avatar,
  Space,
  Typography,
  Tag,
  List,
  Drawer,
  Badge,
  Tooltip,
  Empty,
  Spin,
  Dropdown,
  message,
} from 'antd'
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  MenuOutlined,
  HistoryOutlined,
  PlusOutlined,
  StarOutlined,
  StarFilled,
  DeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  CopyOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  TeamOutlined,
  DesktopOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

const { Header, Sider, Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// 智能体类型配置
const agentTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  general: { icon: <RobotOutlined />, color: '#1890ff' },
  process: { icon: <ExperimentOutlined />, color: '#52c41a' },
  drawing: { icon: <FileImageOutlined />, color: '#722ed1' },
  onboarding: { icon: <TeamOutlined />, color: '#fa8c16' },
  it: { icon: <DesktopOutlined />, color: '#13c2c2' },
  safety: { icon: <SafetyCertificateOutlined />, color: '#ff4d4f' },
}

// 模拟智能体数据
const agentsData = [
  {
    id: 1,
    name: '通用知识助手',
    type: 'general',
    description: '全能型知识问答助手，可回答各类企业知识问题',
    icon: '🤖',
    favorite: true,
  },
  {
    id: 2,
    name: '工艺查询专家',
    type: 'process',
    description: '半导体生产工艺专业问答，精通晶圆制造、封装测试',
    icon: '🔬',
    favorite: true,
  },
  {
    id: 3,
    name: '图纸解读助手',
    type: 'drawing',
    description: '专业解读 DXF、DWG、GDS 等工程图纸',
    icon: '📐',
    favorite: false,
  },
  {
    id: 4,
    name: 'IT帮助台',
    type: 'it',
    description: '解决 OA、ERP、MES 等系统使用问题',
    icon: '💻',
    favorite: false,
  },
  {
    id: 5,
    name: '新员工入职助手',
    type: 'onboarding',
    description: '帮助新员工快速了解公司文化和办事流程',
    icon: '👋',
    favorite: false,
  },
  {
    id: 6,
    name: '安全生产顾问',
    type: 'safety',
    description: '安全规程查询、隐患排查指导、应急处理',
    icon: '🛡️',
    favorite: false,
  },
]

// 模拟对话历史
const mockConversations = [
  { id: 1, agentId: 1, title: '关于公司制度的咨询', time: '今天 09:30', messageCount: 5 },
  { id: 2, agentId: 2, title: '晶圆清洗工艺参数', time: '今天 08:15', messageCount: 8 },
  { id: 3, agentId: 4, title: 'OA系统密码重置', time: '昨天', messageCount: 3 },
]

// 消息类型
interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
}

export default function ChatPage() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agentsData[0] | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 选择智能体
  const handleSelectAgent = (agent: typeof agentsData[0]) => {
    setSelectedAgent(agent)
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `你好！我是${agent.name}，${agent.description}。有什么可以帮助你的吗？`,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
    ])
  }

  // 发送消息
  const handleSend = () => {
    if (!inputValue.trim() || !selectedAgent || loading) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    // 模拟 AI 回复
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getSimulatedResponse(inputValue, selectedAgent),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  // 模拟回复
  const getSimulatedResponse = (question: string, agent: typeof agentsData[0]): string => {
    const responses: Record<string, string[]> = {
      general: [
        '根据公司知识库的相关内容，我来为你解答这个问题...',
        '这是一个很好的问题。根据我的了解...',
        '让我查阅一下相关资料后为你解答...',
      ],
      process: [
        '根据《晶圆清洗工艺规程 V2.0》，相关工艺参数如下...\n\n**SC-1 清洗液配比**: NH₄OH : H₂O₂ : H₂O = 1 : 1 : 5\n**温度**: 75-80°C\n**时间**: 10分钟',
        '这个工艺问题涉及到半导体制造的关键环节。让我详细说明...',
        '关于这个工艺参数，建议参考设备操作手册第 5 章...',
      ],
      drawing: [
        '我已解析了该图纸的元数据。图层信息如下...\n\n**图层数**: 12\n**零件数**: 45\n**材料**: 304不锈钢、铝合金7075',
        '根据图纸解析结果，这是一个封装设备的机械结构图...',
        '该 GDS 文件包含 32 层结构，设计规则检查已通过...',
      ],
      it: [
        '关于这个系统问题，请按以下步骤操作：\n\n1. 打开系统设置\n2. 点击「账号管理」\n3. 选择「修改密码」\n\n如果问题仍未解决，请联系 IT 部门。',
        '这个问题可能是由于网络连接导致的。请先检查网络状态...',
        'OA 系统登录问题，请先清除浏览器缓存后重试...',
      ],
      onboarding: [
        '欢迎加入新核芯科技！关于你的问题...\n\n作为新员工，你需要了解以下重要信息：\n- 公司作息时间：9:00-18:00\n- 午休时间：12:00-13:30\n- 考勤系统：钉钉打卡',
        '新员工入职流程包括：人事报到 → 部门培训 → 安全培训 → 系统开通...',
        '关于公司福利，你可以在员工手册第 3 章找到详细信息...',
      ],
      safety: [
        '⚠️ **安全提醒**\n\n进入洁净室必须严格遵守以下规程：\n1. 穿戴完整防护装备\n2. 通过风淋室除尘\n3. 禁止携带食品饮料\n\n详细规程请参考《洁净室安全管理规定》',
        '关于化学品安全，请务必遵守 MSDS 规定...',
        '设备操作前，请确认已完成安全培训并取得上岗证书...',
      ],
    }

    const agentResponses = responses[agent.type] || responses.general
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }

  // 复制消息
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  // 用户下拉菜单
  const userMenuItems = [
    { key: 'home', icon: <HomeOutlined />, label: <Link href="/admin">管理后台</Link> },
    { type: 'divider' as const },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
  ]

  return (
    <Layout style={{ height: '100vh' }}>
      {/* 左侧智能体列表 */}
      <Sider
        width={280}
        collapsedWidth={0}
        collapsed={siderCollapsed}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          overflow: 'auto',
        }}
      >
        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <RobotOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <Title level={5} style={{ margin: 0 }}>新核芯智能助手</Title>
          </div>

          {/* 收藏的智能体 */}
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>常用智能体</Text>
            <List
              dataSource={agentsData.filter(a => a.favorite)}
              renderItem={(agent) => (
                <List.Item
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: 8,
                    marginTop: 4,
                    background: selectedAgent?.id === agent.id ? '#e6f7ff' : 'transparent',
                  }}
                  onClick={() => handleSelectAgent(agent)}
                >
                  <Space>
                    <Avatar style={{ backgroundColor: agentTypeConfig[agent.type]?.color }}>
                      {agent.icon}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 500 }}>{agent.name}</div>
                      <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                        {agent.description.slice(0, 15)}...
                      </Text>
                    </div>
                  </Space>
                </List.Item>
              )}
            />
          </div>

          {/* 所有智能体 */}
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>全部智能体</Text>
            <List
              dataSource={agentsData}
              renderItem={(agent) => (
                <List.Item
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderRadius: 8,
                    marginTop: 4,
                    background: selectedAgent?.id === agent.id ? '#e6f7ff' : 'transparent',
                  }}
                  onClick={() => handleSelectAgent(agent)}
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      <Avatar style={{ backgroundColor: agentTypeConfig[agent.type]?.color }}>
                        {agent.icon}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 500 }}>{agent.name}</div>
                        <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                          {agent.description.slice(0, 15)}...
                        </Text>
                      </div>
                    </Space>
                    {agent.favorite && <StarFilled style={{ color: '#faad14' }} />}
                  </Space>
                </List.Item>
              )}
            />
          </div>
        </div>
      </Sider>

      {/* 主内容区 */}
      <Layout>
        {/* 顶部导航 */}
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setSiderCollapsed(!siderCollapsed)}
            />
            {selectedAgent && (
              <Space>
                <Avatar style={{ backgroundColor: agentTypeConfig[selectedAgent.type]?.color }}>
                  {selectedAgent.icon}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 500 }}>{selectedAgent.name}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>{selectedAgent.description.slice(0, 30)}...</Text>
                </div>
              </Space>
            )}
          </Space>

          <Space>
            <Tooltip title="历史对话">
              <Button type="text" icon={<HistoryOutlined />} onClick={() => setHistoryDrawerOpen(true)} />
            </Tooltip>
            <Tooltip title="新对话">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={() => selectedAgent && handleSelectAgent(selectedAgent)}
              />
            </Tooltip>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>

        {/* 对话区域 */}
        <Content style={{ display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
          {selectedAgent ? (
            <>
              {/* 消息列表 */}
              <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 16,
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <Avatar style={{ marginRight: 8, backgroundColor: agentTypeConfig[selectedAgent.type]?.color }}>
                        {selectedAgent.icon}
                      </Avatar>
                    )}
                    <div style={{ maxWidth: '70%' }}>
                      <div
                        style={{
                          background: msg.role === 'user' ? '#1890ff' : '#fff',
                          color: msg.role === 'user' ? '#fff' : 'inherit',
                          padding: '12px 16px',
                          borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.content}
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginTop: 4,
                        gap: 8,
                      }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{msg.time}</Text>
                        {msg.role === 'assistant' && (
                          <Space size={4}>
                            <Tooltip title="复制">
                              <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={() => handleCopy(msg.content)}
                                style={{ fontSize: 12, padding: '0 4px', height: 20 }}
                              />
                            </Tooltip>
                          </Space>
                        )}
                      </div>
                    </div>
                    {msg.role === 'user' && (
                      <Avatar icon={<UserOutlined />} style={{ marginLeft: 8 }} />
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', marginBottom: 16 }}>
                    <Avatar style={{ marginRight: 8, backgroundColor: agentTypeConfig[selectedAgent.type]?.color }}>
                      {selectedAgent.icon}
                    </Avatar>
                    <div style={{
                      background: '#fff',
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}>
                      <Spin size="small" /> <Text type="secondary">正在思考...</Text>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 快捷问题 */}
              {messages.length === 1 && (
                <div style={{ padding: '0 24px 12px' }}>
                  <Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: 'block' }}>
                    <QuestionCircleOutlined /> 你可以问我：
                  </Text>
                  <Space wrap>
                    {selectedAgent.type === 'process' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('晶圆清洗的SC-1配比是多少？')}>
                          晶圆清洗的SC-1配比是多少？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('光刻工艺的关键参数有哪些？')}>
                          光刻工艺的关键参数有哪些？
                        </Tag>
                      </>
                    )}
                    {selectedAgent.type === 'general' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('公司的考勤制度是什么？')}>
                          公司的考勤制度是什么？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('如何申请年假？')}>
                          如何申请年假？
                        </Tag>
                      </>
                    )}
                    {selectedAgent.type === 'it' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('如何重置OA系统密码？')}>
                          如何重置OA系统密码？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('VPN连接失败怎么办？')}>
                          VPN连接失败怎么办？
                        </Tag>
                      </>
                    )}
                    {selectedAgent.type === 'onboarding' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('新员工入职流程是什么？')}>
                          新员工入职流程是什么？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('公司福利有哪些？')}>
                          公司福利有哪些？
                        </Tag>
                      </>
                    )}
                    {selectedAgent.type === 'safety' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('进入洁净室的安全规程？')}>
                          进入洁净室的安全规程？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('化学品泄漏如何处理？')}>
                          化学品泄漏如何处理？
                        </Tag>
                      </>
                    )}
                    {selectedAgent.type === 'drawing' && (
                      <>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('如何解读DWG图纸？')}>
                          如何解读DWG图纸？
                        </Tag>
                        <Tag style={{ cursor: 'pointer' }} onClick={() => setInputValue('GDS版图包含哪些信息？')}>
                          GDS版图包含哪些信息？
                        </Tag>
                      </>
                    )}
                  </Space>
                </div>
              )}

              {/* 输入区域 */}
              <div style={{ padding: '12px 24px 24px', background: '#f5f5f5' }}>
                <div style={{
                  display: 'flex',
                  gap: 12,
                  background: '#fff',
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  <TextArea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="输入你的问题..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1, border: 'none', resize: 'none' }}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={loading}
                    disabled={!inputValue.trim()}
                  >
                    发送
                  </Button>
                </div>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block', textAlign: 'center' }}>
                  按 Enter 发送，Shift + Enter 换行
                </Text>
              </div>
            </>
          ) : (
            /* 未选择智能体时显示欢迎页面 */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}>
              <RobotOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
              <Title level={3}>欢迎使用新核芯智能助手</Title>
              <Paragraph type="secondary" style={{ textAlign: 'center', maxWidth: 500 }}>
                请从左侧选择一个智能体开始对话，或点击下方卡片快速开始
              </Paragraph>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
                {agentsData.slice(0, 4).map((agent) => (
                  <Card
                    key={agent.id}
                    hoverable
                    style={{ width: 200 }}
                    onClick={() => handleSelectAgent(agent)}
                  >
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                      <Avatar size={48} style={{ backgroundColor: agentTypeConfig[agent.type]?.color, fontSize: 24 }}>
                        {agent.icon}
                      </Avatar>
                      <Text strong>{agent.name}</Text>
                      <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                        {agent.description.slice(0, 20)}...
                      </Text>
                    </Space>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Content>
      </Layout>

      {/* 历史对话抽屉 */}
      <Drawer
        title="历史对话"
        placement="right"
        onClose={() => setHistoryDrawerOpen(false)}
        open={historyDrawerOpen}
        width={320}
      >
        <List
          dataSource={mockConversations}
          renderItem={(item) => {
            const agent = agentsData.find(a => a.id === item.agentId)
            return (
              <List.Item
                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8 }}
                onClick={() => {
                  if (agent) {
                    handleSelectAgent(agent)
                    setHistoryDrawerOpen(false)
                  }
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: agentTypeConfig[agent?.type || 'general']?.color }}>
                      {agent?.icon}
                    </Avatar>
                  }
                  title={item.title}
                  description={
                    <Space>
                      <Text type="secondary">{item.time}</Text>
                      <Text type="secondary">{item.messageCount} 条消息</Text>
                    </Space>
                  }
                />
              </List.Item>
            )
          }}
        />
      </Drawer>
    </Layout>
  )
}
