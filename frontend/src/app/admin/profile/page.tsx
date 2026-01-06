'use client'

import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  message,
  Typography,
  Descriptions,
  Tag,
  Tabs,
  Table,
  Progress,
  Statistic,
  Space,
  List,
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined,
  RobotOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Title, Text, Paragraph } = Typography

// 模拟用户数据
const userData = {
  id: 1,
  username: 'zhangsan',
  name: '张三',
  email: 'zhangsan@xinhexin.com',
  phone: '13800138001',
  avatar: '',
  dept_name: '研发中心 / 芯片设计组',
  role_names: ['研发工程师'],
  created_at: '2023-03-15',
  last_login: '2024-01-05 09:15:00',
}

// 学习记录
const learningRecords = [
  { id: 1, title: '新员工入职培训', type: '培训', score: 95, status: '已完成', date: '2024-01-03' },
  { id: 2, title: '安全生产培训考核', type: '考试', score: 92, status: '已通过', date: '2024-01-04' },
  { id: 3, title: '质量管理体系培训', type: '培训', score: null, status: '进行中', date: '2024-01-05' },
]

// 对话记录
const chatRecords = [
  { id: 1, agent: '工艺专家', question: '晶圆清洗的主要步骤有哪些？', date: '2024-01-05 10:30' },
  { id: 2, agent: 'IT帮助台', question: '如何重置VPN密码？', date: '2024-01-04 15:20' },
  { id: 3, agent: '通用助手', question: '公司年假政策是怎样的？', date: '2024-01-04 09:10' },
]

// 证书列表
const certificates = [
  { id: 1, name: '新员工入职培训合格证', date: '2024-01-03', valid_until: '2025-01-03' },
  { id: 2, name: '安全生产培训合格证', date: '2024-01-04', valid_until: '2025-01-04' },
]

export default function ProfilePage() {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [editForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  // 编辑信息
  const handleEdit = () => {
    editForm.setFieldsValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    })
    setEditModalOpen(true)
  }

  // 学习记录表格列
  const learningColumns: ColumnsType<typeof learningRecords[0]> = [
    { title: '培训/考试', dataIndex: 'title', key: 'title' },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === '培训' ? 'blue' : 'purple'}>{type}</Tag>,
    },
    {
      title: '成绩',
      dataIndex: 'score',
      key: 'score',
      render: (score) => score ? `${score}分` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          '已完成': 'success',
          '已通过': 'success',
          '进行中': 'processing',
          '未通过': 'error',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      },
    },
    { title: '日期', dataIndex: 'date', key: 'date' },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>个人中心</Title>

      <Row gutter={[16, 16]}>
        {/* 左侧个人信息 */}
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                {userData.name.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{userData.name}</Title>
              <Text type="secondary">{userData.username}</Text>
              <div style={{ marginTop: 8 }}>
                {userData.role_names.map((role) => (
                  <Tag key={role} color="blue">{role}</Tag>
                ))}
              </div>
            </div>

            <Descriptions column={1} size="small">
              <Descriptions.Item label={<><MailOutlined /> 邮箱</>}>
                {userData.email}
              </Descriptions.Item>
              <Descriptions.Item label={<><PhoneOutlined /> 手机</>}>
                {userData.phone}
              </Descriptions.Item>
              <Descriptions.Item label={<><TeamOutlined /> 部门</>}>
                {userData.dept_name}
              </Descriptions.Item>
              <Descriptions.Item label="入职时间">
                {userData.created_at}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录">
                {userData.last_login}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Space style={{ width: '100%' }} direction="vertical">
                <Button block icon={<EditOutlined />} onClick={handleEdit}>
                  编辑信息
                </Button>
                <Button block icon={<LockOutlined />} onClick={() => setPasswordModalOpen(true)}>
                  修改密码
                </Button>
              </Space>
            </div>
          </Card>

          {/* 证书卡片 */}
          <Card title={<><SafetyCertificateOutlined /> 我的证书</>} style={{ marginTop: 16 }}>
            <List
              dataSource={certificates}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />}
                    title={item.name}
                    description={`获得日期: ${item.date} | 有效期至: ${item.valid_until}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 右侧统计和记录 */}
        <Col xs={24} lg={16}>
          {/* 统计卡片 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="完成培训"
                  value={5}
                  prefix={<FileTextOutlined />}
                  suffix="门"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="AI对话"
                  value={23}
                  prefix={<RobotOutlined />}
                  suffix="次"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="获得证书"
                  value={2}
                  prefix={<TrophyOutlined />}
                  suffix="个"
                />
              </Card>
            </Col>
          </Row>

          {/* 学习进度 */}
          <Card title="学习进度" style={{ marginBottom: 16 }}>
            <Row gutter={32}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text>新员工必修课程</Text>
                    <Text style={{ float: 'right' }}>3/5</Text>
                  </div>
                  <Progress percent={60} strokeColor="#1890ff" />
                </div>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text>安全生产课程</Text>
                    <Text style={{ float: 'right' }}>2/3</Text>
                  </div>
                  <Progress percent={66} strokeColor="#52c41a" />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text>质量管理课程</Text>
                    <Text style={{ float: 'right' }}>1/4</Text>
                  </div>
                  <Progress percent={25} strokeColor="#faad14" />
                </div>
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text>专业技能课程</Text>
                    <Text style={{ float: 'right' }}>0/6</Text>
                  </div>
                  <Progress percent={0} strokeColor="#ff4d4f" />
                </div>
              </Col>
            </Row>
          </Card>

          {/* 详细记录 */}
          <Card>
            <Tabs
              items={[
                {
                  key: 'learning',
                  label: '学习记录',
                  children: (
                    <Table
                      columns={learningColumns}
                      dataSource={learningRecords}
                      rowKey="id"
                      pagination={{ pageSize: 5 }}
                    />
                  ),
                },
                {
                  key: 'chat',
                  label: 'AI对话记录',
                  children: (
                    <List
                      dataSource={chatRecords}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                            title={
                              <Space>
                                <Tag color="blue">{item.agent}</Tag>
                                <Text type="secondary">{item.date}</Text>
                              </Space>
                            }
                            description={item.question}
                          />
                        </List.Item>
                      )}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 编辑信息弹窗 */}
      <Modal
        title="编辑个人信息"
        open={editModalOpen}
        onOk={() => {
          editForm.validateFields().then((values) => {
            console.log(values)
            message.success('更新成功')
            setEditModalOpen(false)
          })
        }}
        onCancel={() => setEditModalOpen(false)}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalOpen}
        onOk={() => {
          passwordForm.validateFields().then((values) => {
            console.log(values)
            message.success('密码修改成功')
            setPasswordModalOpen(false)
            passwordForm.resetFields()
          })
        }}
        onCancel={() => setPasswordModalOpen(false)}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
