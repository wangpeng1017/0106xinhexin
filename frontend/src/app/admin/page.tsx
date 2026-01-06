'use client'

import { useState } from 'react'
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Typography,
  Tag,
  Progress,
  Space,
  Avatar,
  Table,
  Badge,
  Tooltip,
  Timeline,
} from 'antd'
import {
  BookOutlined,
  RobotOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  FormOutlined,
  RiseOutlined,
  FallOutlined,
  MessageOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  StarFilled,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  DesktopOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text, Paragraph } = Typography

// 核心统计数据
const coreStats = [
  { title: '知识库', value: 12, icon: <BookOutlined />, color: '#1890ff', trend: 8, link: '/admin/knowledge' },
  { title: '文档总数', value: 1256, icon: <FileTextOutlined />, color: '#52c41a', trend: 15, link: '/admin/knowledge' },
  { title: '智能体', value: 6, icon: <RobotOutlined />, color: '#722ed1', trend: 0, link: '/admin/agents' },
  { title: '活跃用户', value: 78, icon: <UserOutlined />, color: '#fa8c16', trend: -3, link: '/admin/system/users' },
]

// 智能体使用排行
const agentRanking = [
  { rank: 1, name: '通用知识助手', icon: '🤖', type: '通用助手', usageToday: 156, usageTotal: 1256, trend: 12 },
  { rank: 2, name: '工艺查询专家', icon: '🔬', type: '工艺专家', usageToday: 89, usageTotal: 892, trend: 8 },
  { rank: 3, name: 'IT帮助台', icon: '💻', type: 'IT帮助台', usageToday: 67, usageTotal: 567, trend: -5 },
  { rank: 4, name: '图纸解读助手', icon: '📐', type: '图纸解读', usageToday: 45, usageTotal: 456, trend: 20 },
  { rank: 5, name: '新员工入职助手', icon: '👋', type: '入职助手', usageToday: 23, usageTotal: 234, trend: 15 },
]

// 最近文档上传
const recentDocs = [
  { id: 1, title: '晶圆清洗工艺规程 V2.0', type: 'pdf', kb: '生产知识库', status: 'completed', time: '10分钟前' },
  { id: 2, title: 'A1024芯片版图设计', type: 'gds', kb: '研发知识库', status: 'completed', time: '30分钟前' },
  { id: 3, title: '光刻机操作培训视频', type: 'mp4', kb: '培训资料库', status: 'processing', time: '1小时前' },
  { id: 4, title: '封装设备CAD图纸', type: 'dwg', kb: '设备知识库', status: 'completed', time: '2小时前' },
  { id: 5, title: '安全生产培训录音', type: 'mp3', kb: '培训资料库', status: 'pending', time: '3小时前' },
]

// 文件类型图标
const fileTypeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  pdf: { icon: <FilePdfOutlined />, color: '#ff4d4f' },
  gds: { icon: <FileTextOutlined />, color: '#eb2f96' },
  dwg: { icon: <FileImageOutlined />, color: '#722ed1' },
  mp4: { icon: <PlayCircleOutlined />, color: '#fa8c16' },
  mp3: { icon: <SoundOutlined />, color: '#13c2c2' },
}

// AI处理状态
const aiStatusConfig: Record<string, { icon: React.ReactNode; color: string; text: string }> = {
  pending: { icon: <ClockCircleOutlined />, color: 'default', text: '待处理' },
  processing: { icon: <SyncOutlined spin />, color: 'processing', text: '处理中' },
  completed: { icon: <CheckCircleOutlined />, color: 'success', text: '已完成' },
}

// 培训统计
const trainingStats = [
  { name: '新员工入职培训', total: 50, passed: 45, color: '#1890ff' },
  { name: '安全生产培训', total: 86, passed: 78, color: '#52c41a' },
  { name: '质量管理培训', total: 32, passed: 28, color: '#faad14' },
  { name: '设备操作培训', total: 24, passed: 22, color: '#722ed1' },
]

// 系统运行状态
const systemStatus = [
  { name: 'LLM 推理服务', status: 'running', cpu: 45, memory: 68, gpu: 72 },
  { name: '向量数据库', status: 'running', cpu: 12, memory: 35, gpu: 0 },
  { name: '文件存储服务', status: 'running', cpu: 8, memory: 22, gpu: 0 },
  { name: 'API 网关', status: 'running', cpu: 15, memory: 28, gpu: 0 },
]

// 最近活动
const recentActivities = [
  { time: '09:30', user: '张三', action: '上传了文档', target: '晶圆清洗工艺规程 V2.0' },
  { time: '09:15', user: '李四', action: '创建了智能体', target: '安全生产顾问' },
  { time: '09:00', user: '王五', action: '完成了考试', target: '新员工入职培训考试' },
  { time: '08:45', user: '赵六', action: '提问了智能体', target: '工艺查询专家' },
  { time: '08:30', user: '钱七', action: '上传了视频', target: '光刻机操作培训' },
]

// 今日数据
const todayStats = {
  questions: 234,
  questionsChange: 18,
  uploads: 12,
  uploadsChange: -2,
  exams: 8,
  examsChange: 3,
  newUsers: 2,
  newUsersChange: 0,
}

export default function AdminDashboard() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>控制台</Title>
        <Text type="secondary">最后更新: {new Date().toLocaleString('zh-CN')}</Text>
      </div>

      {/* 核心统计卡片 */}
      <Row gutter={[16, 16]}>
        {coreStats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Link href={item.link}>
              <Card hoverable>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={<span style={{ color: item.color }}>{item.icon}</span>}
                  suffix={
                    item.trend !== 0 && (
                      <Text type={item.trend > 0 ? 'success' : 'danger'} style={{ fontSize: 14 }}>
                        {item.trend > 0 ? <RiseOutlined /> : <FallOutlined />} {Math.abs(item.trend)}%
                      </Text>
                    )
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* 今日数据 */}
      <Card title="今日数据" style={{ marginTop: 16 }}>
        <Row gutter={[32, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="智能体问答"
              value={todayStats.questions}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Text type={todayStats.questionsChange >= 0 ? 'success' : 'danger'} style={{ fontSize: 12 }}>
                  {todayStats.questionsChange >= 0 ? '+' : ''}{todayStats.questionsChange}
                </Text>
              }
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="文档上传"
              value={todayStats.uploads}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Text type={todayStats.uploadsChange >= 0 ? 'success' : 'danger'} style={{ fontSize: 12 }}>
                  {todayStats.uploadsChange >= 0 ? '+' : ''}{todayStats.uploadsChange}
                </Text>
              }
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="考试完成"
              value={todayStats.exams}
              prefix={<FormOutlined style={{ color: '#722ed1' }} />}
              suffix={
                <Text type={todayStats.examsChange >= 0 ? 'success' : 'danger'} style={{ fontSize: 12 }}>
                  {todayStats.examsChange >= 0 ? '+' : ''}{todayStats.examsChange}
                </Text>
              }
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="新增用户"
              value={todayStats.newUsers}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
              suffix={
                todayStats.newUsersChange !== 0 && (
                  <Text type={todayStats.newUsersChange >= 0 ? 'success' : 'danger'} style={{ fontSize: 12 }}>
                    {todayStats.newUsersChange >= 0 ? '+' : ''}{todayStats.newUsersChange}
                  </Text>
                )
              }
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 智能体使用排行 */}
        <Col xs={24} lg={12}>
          <Card title={<><StarFilled style={{ color: '#faad14' }} /> 智能体使用排行</>} extra={<Link href="/admin/agents">查看全部</Link>}>
            <Table
              dataSource={agentRanking}
              rowKey="rank"
              pagination={false}
              size="small"
              columns={[
                {
                  title: '排名',
                  dataIndex: 'rank',
                  width: 50,
                  render: (rank) => (
                    <span style={{
                      color: rank <= 3 ? '#faad14' : '#999',
                      fontWeight: rank <= 3 ? 600 : 400,
                    }}>
                      {rank}
                    </span>
                  ),
                },
                {
                  title: '智能体',
                  dataIndex: 'name',
                  render: (name, record) => (
                    <Space>
                      <span style={{ fontSize: 18 }}>{record.icon}</span>
                      <div>
                        <div>{name}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.type}</Text>
                      </div>
                    </Space>
                  ),
                },
                {
                  title: '今日',
                  dataIndex: 'usageToday',
                  width: 70,
                  render: (v) => <Text strong>{v}</Text>,
                },
                {
                  title: '趋势',
                  dataIndex: 'trend',
                  width: 70,
                  render: (trend) => (
                    <Text type={trend >= 0 ? 'success' : 'danger'}>
                      {trend >= 0 ? '+' : ''}{trend}%
                    </Text>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* 最近文档 */}
        <Col xs={24} lg={12}>
          <Card title={<><FileTextOutlined /> 最近上传文档</>} extra={<Link href="/admin/knowledge">查看全部</Link>}>
            <List
              dataSource={recentDocs}
              renderItem={(item) => {
                const fileType = fileTypeIcons[item.type] || { icon: <FileTextOutlined />, color: '#666' }
                const aiStatus = aiStatusConfig[item.status]
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <span style={{ fontSize: 24, color: fileType.color }}>{fileType.icon}</span>
                      }
                      title={
                        <Space>
                          <span>{item.title}</span>
                          <Tag icon={aiStatus.icon} color={aiStatus.color}>{aiStatus.text}</Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <Tag color="blue">{item.kb}</Tag>
                          <Text type="secondary">{item.time}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 培训统计 */}
        <Col xs={24} lg={12}>
          <Card title={<><FormOutlined /> 培训完成情况</>} extra={<Link href="/admin/training">查看全部</Link>}>
            {trainingStats.map((item, index) => (
              <div key={index} style={{ marginBottom: index < trainingStats.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>{item.name}</Text>
                  <Space>
                    <Text type="secondary">{item.passed}/{item.total}</Text>
                    <Text strong style={{ color: item.color }}>
                      {Math.round((item.passed / item.total) * 100)}%
                    </Text>
                  </Space>
                </div>
                <Progress
                  percent={Math.round((item.passed / item.total) * 100)}
                  strokeColor={item.color}
                  showInfo={false}
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card title={<><ClockCircleOutlined /> 最近活动</>}>
            <Timeline
              items={recentActivities.map((item) => ({
                children: (
                  <div>
                    <Text type="secondary">{item.time}</Text>
                    <span style={{ margin: '0 8px' }}>{item.user}</span>
                    <Text>{item.action}</Text>
                    <Text strong style={{ marginLeft: 8 }}>{item.target}</Text>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统状态 */}
      <Card title={<><CloudServerOutlined /> 系统运行状态</>} style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          {systemStatus.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text strong>{item.name}</Text>
                  <Badge status="success" text="运行中" />
                </div>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div>
                    <Text type="secondary">CPU</Text>
                    <Progress percent={item.cpu} size="small" strokeColor={item.cpu > 80 ? '#ff4d4f' : '#1890ff'} />
                  </div>
                  <div>
                    <Text type="secondary">内存</Text>
                    <Progress percent={item.memory} size="small" strokeColor={item.memory > 80 ? '#ff4d4f' : '#52c41a'} />
                  </div>
                  {item.gpu > 0 && (
                    <div>
                      <Text type="secondary">GPU</Text>
                      <Progress percent={item.gpu} size="small" strokeColor={item.gpu > 80 ? '#ff4d4f' : '#722ed1'} />
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 快捷入口 */}
      <Card title={<><ThunderboltOutlined /> 快捷入口</>} style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Link href="/admin/knowledge">
              <Card hoverable style={{ textAlign: 'center' }}>
                <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>知识库管理</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href="/admin/agents">
              <Card hoverable style={{ textAlign: 'center' }}>
                <RobotOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                <div style={{ marginTop: 8 }}>智能体管理</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href="/admin/training/exams">
              <Card hoverable style={{ textAlign: 'center' }}>
                <FormOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <div style={{ marginTop: 8 }}>培训考试</div>
              </Card>
            </Link>
          </Col>
          <Col xs={12} sm={6}>
            <Link href="/admin/system/users">
              <Card hoverable style={{ textAlign: 'center' }}>
                <TeamOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
                <div style={{ marginTop: 8 }}>用户管理</div>
              </Card>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
