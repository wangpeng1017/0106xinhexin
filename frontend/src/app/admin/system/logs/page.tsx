'use client'

import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tag,
  Modal,
  Typography,
  Descriptions,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  ExportOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

// 模拟操作日志数据
const logsData = [
  {
    id: 1,
    user_name: '张三',
    user_dept: '研发中心',
    action: 'upload',
    module: 'knowledge',
    target: '晶圆清洗工艺规程.pdf',
    ip: '192.168.1.100',
    status: 1,
    detail: '上传文件到【生产知识库】',
    created_at: '2024-01-05 10:30:25',
  },
  {
    id: 2,
    user_name: '李四',
    user_dept: '生产部',
    action: 'chat',
    module: 'agent',
    target: '工艺专家',
    ip: '192.168.1.101',
    status: 1,
    detail: '与【工艺专家】智能体进行对话',
    created_at: '2024-01-05 10:15:10',
  },
  {
    id: 3,
    user_name: '王五',
    user_dept: '质量部',
    action: 'exam',
    module: 'training',
    target: '安全生产培训考核',
    ip: '192.168.1.102',
    status: 1,
    detail: '参加考试【安全生产培训考核】，得分 92 分',
    created_at: '2024-01-05 09:45:00',
  },
  {
    id: 4,
    user_name: '赵六',
    user_dept: '信息技术部',
    action: 'create',
    module: 'user',
    target: '新用户: 孙七',
    ip: '192.168.1.103',
    status: 1,
    detail: '创建新用户【孙七】，部门：研发中心',
    created_at: '2024-01-05 09:30:00',
  },
  {
    id: 5,
    user_name: '管理员',
    user_dept: '信息技术部',
    action: 'login',
    module: 'system',
    target: '系统登录',
    ip: '192.168.1.1',
    status: 1,
    detail: '用户登录系统',
    created_at: '2024-01-05 09:00:00',
  },
  {
    id: 6,
    user_name: '周八',
    user_dept: '研发中心',
    action: 'download',
    module: 'knowledge',
    target: '芯片设计规范V3.pdf',
    ip: '192.168.1.104',
    status: 1,
    detail: '从【研发知识库】下载文件',
    created_at: '2024-01-04 16:20:00',
  },
  {
    id: 7,
    user_name: '吴九',
    user_dept: '生产部',
    action: 'delete',
    module: 'knowledge',
    target: '过期文档.docx',
    ip: '192.168.1.105',
    status: 0,
    detail: '删除文档失败：权限不足',
    created_at: '2024-01-04 15:10:00',
  },
]

// 操作类型映射
const actionMap: Record<string, { text: string; color: string }> = {
  login: { text: '登录', color: 'blue' },
  logout: { text: '退出', color: 'default' },
  create: { text: '创建', color: 'green' },
  update: { text: '更新', color: 'orange' },
  delete: { text: '删除', color: 'red' },
  upload: { text: '上传', color: 'cyan' },
  download: { text: '下载', color: 'purple' },
  chat: { text: '对话', color: 'geekblue' },
  exam: { text: '考试', color: 'gold' },
}

// 模块映射
const moduleMap: Record<string, string> = {
  system: '系统管理',
  user: '用户管理',
  knowledge: '知识库',
  agent: '智能体',
  training: '培训考试',
}

export default function LogsPage() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedLog, setSelectedLog] = useState<typeof logsData[0] | null>(null)

  // 查看详情
  const handleViewDetail = (log: typeof logsData[0]) => {
    setSelectedLog(log)
    setDetailOpen(true)
  }

  // 表格列配置
  const columns: ColumnsType<typeof logsData[0]> = [
    {
      title: '操作时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
    },
    {
      title: '操作人',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.user_name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.user_dept}</Text>
        </div>
      ),
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      width: 100,
      render: (action) => (
        <Tag color={actionMap[action]?.color || 'default'}>
          {actionMap[action]?.text || action}
        </Tag>
      ),
    },
    {
      title: '模块',
      dataIndex: 'module',
      key: 'module',
      width: 100,
      render: (module) => moduleMap[module] || module,
    },
    {
      title: '操作对象',
      dataIndex: 'target',
      key: 'target',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'error'}>
          {status === 1 ? '成功' : '失败'}
        </Tag>
      ),
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

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>操作日志</Title>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Space wrap>
            <Input.Search placeholder="搜索操作人/对象" style={{ width: 200 }} />
            <Select
              style={{ width: 120 }}
              placeholder="操作类型"
              allowClear
              options={Object.entries(actionMap).map(([value, { text }]) => ({ value, label: text }))}
            />
            <Select
              style={{ width: 120 }}
              placeholder="模块"
              allowClear
              options={Object.entries(moduleMap).map(([value, label]) => ({ value, label }))}
            />
            <Select
              style={{ width: 100 }}
              placeholder="状态"
              allowClear
              options={[
                { value: 1, label: '成功' },
                { value: 0, label: '失败' },
              ]}
            />
            <RangePicker />
          </Space>
          <Button icon={<ExportOutlined />}>导出</Button>
        </div>

        <Table
          columns={columns}
          dataSource={logsData}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 条`,
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* 日志详情弹窗 */}
      <Modal
        title="日志详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={600}
      >
        {selectedLog && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="操作时间" span={2}>
              {selectedLog.created_at}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {selectedLog.user_name}
            </Descriptions.Item>
            <Descriptions.Item label="所属部门">
              {selectedLog.user_dept}
            </Descriptions.Item>
            <Descriptions.Item label="操作类型">
              <Tag color={actionMap[selectedLog.action]?.color}>
                {actionMap[selectedLog.action]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">
              {moduleMap[selectedLog.module]}
            </Descriptions.Item>
            <Descriptions.Item label="操作对象" span={2}>
              {selectedLog.target}
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
              {selectedLog.ip}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedLog.status === 1 ? 'success' : 'error'}>
                {selectedLog.status === 1 ? '成功' : '失败'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="详细描述" span={2}>
              {selectedLog.detail}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
