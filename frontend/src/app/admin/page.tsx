'use client'

import { Row, Col, Card, Statistic, List, Typography, Tag, Progress } from 'antd'
import {
  BookOutlined,
  RobotOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  FormOutlined,
  RiseOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

// 模拟数据
const statsData = [
  { title: '知识库数量', value: 12, icon: <BookOutlined />, color: '#1890ff' },
  { title: '文档总数', value: 1256, icon: <FileTextOutlined />, color: '#52c41a' },
  { title: '智能体数量', value: 8, icon: <RobotOutlined />, color: '#722ed1' },
  { title: '用户总数', value: 86, icon: <UserOutlined />, color: '#fa8c16' },
]

const recentDocs = [
  { id: 1, title: '晶圆清洗工艺规程 V2.0', kb: '生产知识库', time: '10分钟前' },
  { id: 2, title: '设备维护手册 - 光刻机', kb: '设备知识库', time: '1小时前' },
  { id: 3, title: '新员工入职培训指南', kb: '通用知识库', time: '2小时前' },
  { id: 4, title: 'IT系统使用手册', kb: 'IT知识库', time: '3小时前' },
]

const trainingStats = [
  { name: '新员工入职培训', total: 50, passed: 45 },
  { name: '安全生产培训', total: 86, passed: 78 },
  { name: '质量管理培训', total: 32, passed: 28 },
]

export default function AdminDashboard() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>控制台</Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        {statsData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={<span style={{ color: item.color }}>{item.icon}</span>}
                suffix={
                  <Text type="success" style={{ fontSize: 14 }}>
                    <RiseOutlined /> 12%
                  </Text>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 最近文档 */}
        <Col xs={24} lg={12}>
          <Card title="最近上传文档" extra={<a href="/admin/knowledge">查看全部</a>}>
            <List
              dataSource={recentDocs}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                    title={item.title}
                    description={
                      <span>
                        <Tag color="blue">{item.kb}</Tag>
                        <Text type="secondary">{item.time}</Text>
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 培训统计 */}
        <Col xs={24} lg={12}>
          <Card title="培训完成情况" extra={<a href="/admin/training/records">查看全部</a>}>
            <List
              dataSource={trainingStats}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{item.name}</span>
                      <span>{item.passed}/{item.total} 人通过</span>
                    </div>
                    <Progress
                      percent={Math.round((item.passed / item.total) * 100)}
                      status={item.passed / item.total >= 0.9 ? 'success' : 'normal'}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷入口 */}
      <Card title="快捷入口" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/admin/knowledge'}>
              <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>知识库管理</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/admin/agents'}>
              <RobotOutlined style={{ fontSize: 32, color: '#722ed1' }} />
              <div style={{ marginTop: 8 }}>智能体管理</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/admin/training/exams'}>
              <FormOutlined style={{ fontSize: 32, color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>培训考试</div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/admin/system/users'}>
              <TeamOutlined style={{ fontSize: 32, color: '#fa8c16' }} />
              <div style={{ marginTop: 8 }}>用户管理</div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
