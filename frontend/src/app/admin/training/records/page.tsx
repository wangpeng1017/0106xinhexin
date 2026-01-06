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
  Typography,
  Select,
  DatePicker,
  Descriptions,
  Progress,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  EyeOutlined,
  ExportOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Search } = Input

// 模拟考试记录数据
const recordsData = [
  {
    id: 1,
    user_name: '张三',
    dept_name: '研发中心',
    exam_title: '新员工入职培训考试',
    score: 95,
    pass_score: 60,
    total_score: 100,
    duration: 45,
    status: 'passed',
    submit_at: '2024-01-05 10:45:00',
  },
  {
    id: 2,
    user_name: '李四',
    dept_name: '生产部',
    exam_title: '安全生产培训考核',
    score: 88,
    pass_score: 80,
    total_score: 100,
    duration: 72,
    status: 'passed',
    submit_at: '2024-01-05 11:30:00',
  },
  {
    id: 3,
    user_name: '王五',
    dept_name: '质量部',
    exam_title: '安全生产培训考核',
    score: 75,
    pass_score: 80,
    total_score: 100,
    duration: 85,
    status: 'failed',
    submit_at: '2024-01-05 14:20:00',
  },
  {
    id: 4,
    user_name: '赵六',
    dept_name: '研发中心',
    exam_title: '新员工入职培训考试',
    score: 82,
    pass_score: 60,
    total_score: 100,
    duration: 38,
    status: 'passed',
    submit_at: '2024-01-04 16:00:00',
  },
  {
    id: 5,
    user_name: '钱七',
    dept_name: '生产部',
    exam_title: '质量管理体系培训',
    score: 68,
    pass_score: 70,
    total_score: 100,
    duration: 55,
    status: 'failed',
    submit_at: '2024-01-04 15:30:00',
  },
]

// 试卷选项
const examOptions = [
  { value: 1, label: '新员工入职培训考试' },
  { value: 2, label: '安全生产培训考核' },
  { value: 3, label: '质量管理体系培训' },
]

export default function RecordsPage() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<typeof recordsData[0] | null>(null)

  // 查看详情
  const handleViewDetail = (record: typeof recordsData[0]) => {
    setSelectedRecord(record)
    setDetailOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof recordsData[0]> = [
    {
      title: '考生',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.user_name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.dept_name}</Text>
        </div>
      ),
    },
    {
      title: '试卷名称',
      dataIndex: 'exam_title',
      key: 'exam_title',
    },
    {
      title: '得分',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      render: (score, record) => (
        <Space>
          <Text
            strong
            style={{ color: score >= record.pass_score ? '#52c41a' : '#ff4d4f' }}
          >
            {score}
          </Text>
          <Text type="secondary">/ {record.total_score}</Text>
        </Space>
      ),
    },
    {
      title: '用时',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => `${duration} 分钟`,
    },
    {
      title: '结果',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag
          icon={status === 'passed' ? <TrophyOutlined /> : <CloseCircleOutlined />}
          color={status === 'passed' ? 'success' : 'error'}
        >
          {status === 'passed' ? '通过' : '未通过'}
        </Tag>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'submit_at',
      key: 'submit_at',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ]

  // 统计数据
  const totalCount = recordsData.length
  const passedCount = recordsData.filter((r) => r.status === 'passed').length
  const avgScore = Math.round(recordsData.reduce((sum, r) => sum + r.score, 0) / totalCount)

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>考试记录</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="考试总人次" value={totalCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="通过人数" value={passedCount} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="通过率"
              value={Math.round((passedCount / totalCount) * 100)}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均分" value={avgScore} suffix="分" />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Space wrap>
            <Search placeholder="搜索考生姓名" style={{ width: 180 }} />
            <Select
              style={{ width: 200 }}
              placeholder="选择试卷"
              options={examOptions}
              allowClear
            />
            <Select
              style={{ width: 120 }}
              placeholder="考试结果"
              options={[
                { value: 'passed', label: '通过' },
                { value: 'failed', label: '未通过' },
              ]}
              allowClear
            />
            <RangePicker />
          </Space>
          <Button icon={<ExportOutlined />}>导出</Button>
        </div>

        <Table
          columns={columns}
          dataSource={recordsData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="考试详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="考生姓名">{selectedRecord.user_name}</Descriptions.Item>
              <Descriptions.Item label="所属部门">{selectedRecord.dept_name}</Descriptions.Item>
              <Descriptions.Item label="试卷名称" span={2}>{selectedRecord.exam_title}</Descriptions.Item>
              <Descriptions.Item label="考试得分">
                <Text
                  strong
                  style={{ fontSize: 18, color: selectedRecord.score >= selectedRecord.pass_score ? '#52c41a' : '#ff4d4f' }}
                >
                  {selectedRecord.score}
                </Text>
                <Text type="secondary"> / {selectedRecord.total_score}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="及格分数">{selectedRecord.pass_score} 分</Descriptions.Item>
              <Descriptions.Item label="考试用时">{selectedRecord.duration} 分钟</Descriptions.Item>
              <Descriptions.Item label="考试结果">
                <Tag
                  icon={selectedRecord.status === 'passed' ? <TrophyOutlined /> : <CloseCircleOutlined />}
                  color={selectedRecord.status === 'passed' ? 'success' : 'error'}
                >
                  {selectedRecord.status === 'passed' ? '通过' : '未通过'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交时间" span={2}>{selectedRecord.submit_at}</Descriptions.Item>
            </Descriptions>

            <Card title="答题详情" size="small" style={{ marginTop: 16 }}>
              <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                答题详情需要从后端 API 获取
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  )
}
