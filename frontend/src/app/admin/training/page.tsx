'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  List,
  Tag,
  Progress,
  Space,
} from 'antd'
import {
  FileTextOutlined,
  FormOutlined,
  TeamOutlined,
  TrophyOutlined,
  RightOutlined,
} from '@ant-design/icons'
import Link from 'next/link'

const { Title, Text } = Typography

// 统计数据
const statsData = {
  sceneCount: 4,
  questionCount: 230,
  examCount: 8,
  recordCount: 156,
  passRate: 87,
}

// 最近考试
const recentExams = [
  { id: 1, title: '新员工入职培训考试', takeCount: 45, passRate: 90 },
  { id: 2, title: '安全生产培训考核', takeCount: 78, passRate: 85 },
  { id: 3, title: '质量管理体系培训', takeCount: 32, passRate: 82 },
]

// 热门培训场景
const hotScenes = [
  { id: 1, name: '新员工入职培训', questionCount: 50, examCount: 3 },
  { id: 2, name: '安全生产培训', questionCount: 80, examCount: 5 },
  { id: 3, name: '质量管理培训', questionCount: 40, examCount: 2 },
]

export default function TrainingPage() {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>培训考试概览</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="培训场景"
              value={statsData.sceneCount}
              prefix={<FileTextOutlined />}
              suffix="个"
            />
            <div style={{ marginTop: 8 }}>
              <Link href="/admin/training/scenes">
                <Text type="secondary">
                  管理场景 <RightOutlined style={{ fontSize: 10 }} />
                </Text>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="题库总数"
              value={statsData.questionCount}
              prefix={<FormOutlined />}
              suffix="题"
            />
            <div style={{ marginTop: 8 }}>
              <Link href="/admin/training/questions">
                <Text type="secondary">
                  管理题库 <RightOutlined style={{ fontSize: 10 }} />
                </Text>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="试卷数量"
              value={statsData.examCount}
              prefix={<FileTextOutlined />}
              suffix="份"
            />
            <div style={{ marginTop: 8 }}>
              <Link href="/admin/training/exams">
                <Text type="secondary">
                  管理试卷 <RightOutlined style={{ fontSize: 10 }} />
                </Text>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="考试人次"
              value={statsData.recordCount}
              prefix={<TeamOutlined />}
              suffix="次"
            />
            <div style={{ marginTop: 8 }}>
              <Link href="/admin/training/records">
                <Text type="secondary">
                  查看记录 <RightOutlined style={{ fontSize: 10 }} />
                </Text>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* 最近考试 */}
        <Col xs={24} lg={12}>
          <Card
            title="最近考试"
            extra={<Link href="/admin/training/exams">查看全部</Link>}
          >
            <List
              dataSource={recentExams}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <Space>
                        <Tag icon={<TeamOutlined />}>{item.takeCount} 人参加</Tag>
                        <Tag icon={<TrophyOutlined />} color="success">通过率 {item.passRate}%</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 热门培训场景 */}
        <Col xs={24} lg={12}>
          <Card
            title="培训场景"
            extra={<Link href="/admin/training/scenes">查看全部</Link>}
          >
            <List
              dataSource={hotScenes}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={
                      <Space>
                        <Text type="secondary">{item.questionCount} 道题目</Text>
                        <Text type="secondary">{item.examCount} 份试卷</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 整体通过率 */}
      <Card title="整体通过率" style={{ marginTop: 16 }}>
        <Row gutter={32} align="middle">
          <Col span={8}>
            <Progress
              type="circle"
              percent={statsData.passRate}
              strokeColor="#52c41a"
              format={(percent) => `${percent}%`}
            />
          </Col>
          <Col span={16}>
            <div style={{ marginBottom: 16 }}>
              <Text>新员工入职培训</Text>
              <Progress percent={90} strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text>安全生产培训</Text>
              <Progress percent={85} strokeColor="#52c41a" />
            </div>
            <div>
              <Text>质量管理培训</Text>
              <Progress percent={82} strokeColor="#faad14" />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
