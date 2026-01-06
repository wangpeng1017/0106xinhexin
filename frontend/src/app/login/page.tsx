'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, DingdingOutlined } from '@ant-design/icons'
import { useUserStore } from '@/stores/user'
import { post } from '@/lib/request'

interface LoginForm {
  username: string
  password: string
}

interface LoginResponse {
  token: string
  expires_in: number
  user: {
    id: number
    username: string
    real_name: string
    role: string
  }
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setToken, setUser } = useUserStore()

  const onFinish = async (values: LoginForm) => {
    setLoading(true)
    try {
      const res = await post<LoginResponse>('/auth/login', values)
      setToken(res.token)
      setUser(res.user)
      message.success('登录成功')
      router.push('/admin')
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
            新核芯知识库智能体系统
          </h1>
          <p style={{ color: '#666' }}>企业知识管理与智能问答平台</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>其他登录方式</Divider>

        <Button
          icon={<DingdingOutlined />}
          block
          style={{ marginBottom: 16 }}
        >
          钉钉扫码登录
        </Button>

        <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
          默认管理员账号: admin / admin123
        </div>
      </Card>
    </div>
  )
}
