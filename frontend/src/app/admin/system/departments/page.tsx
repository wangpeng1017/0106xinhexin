'use client'

import { useState } from 'react'
import {
  Card,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  TreeSelect,
  message,
  Popconfirm,
  Typography,
  Descriptions,
  Tag,
  Empty,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'

const { Title, Text } = Typography

// 模拟部门树数据
const departmentsData: DataNode[] = [
  {
    title: '新核芯科技有限公司',
    key: '1',
    icon: <TeamOutlined />,
    children: [
      {
        title: '研发中心',
        key: '1-1',
        icon: <TeamOutlined />,
        children: [
          { title: '芯片设计组', key: '1-1-1', icon: <TeamOutlined /> },
          { title: '工艺研发组', key: '1-1-2', icon: <TeamOutlined /> },
          { title: '封装测试组', key: '1-1-3', icon: <TeamOutlined /> },
        ],
      },
      {
        title: '生产部',
        key: '1-2',
        icon: <TeamOutlined />,
        children: [
          { title: '晶圆生产线', key: '1-2-1', icon: <TeamOutlined /> },
          { title: '封装生产线', key: '1-2-2', icon: <TeamOutlined /> },
        ],
      },
      {
        title: '质量部',
        key: '1-3',
        icon: <TeamOutlined />,
      },
      {
        title: '信息技术部',
        key: '1-4',
        icon: <TeamOutlined />,
      },
      {
        title: '人力资源部',
        key: '1-5',
        icon: <TeamOutlined />,
      },
      {
        title: '财务部',
        key: '1-6',
        icon: <TeamOutlined />,
      },
    ],
  },
]

// 部门详情数据
const deptDetails: Record<string, any> = {
  '1': { name: '新核芯科技有限公司', leader: '王总', member_count: 86, sort: 1, status: 1, description: '公司总部' },
  '1-1': { name: '研发中心', leader: '张工', member_count: 25, sort: 1, status: 1, description: '负责芯片研发设计' },
  '1-1-1': { name: '芯片设计组', leader: '李工', member_count: 10, sort: 1, status: 1, description: '负责芯片电路设计' },
  '1-1-2': { name: '工艺研发组', leader: '赵工', member_count: 8, sort: 2, status: 1, description: '负责生产工艺研发' },
  '1-1-3': { name: '封装测试组', leader: '钱工', member_count: 7, sort: 3, status: 1, description: '负责芯片封装与测试' },
  '1-2': { name: '生产部', leader: '孙主管', member_count: 35, sort: 2, status: 1, description: '负责生产制造' },
  '1-2-1': { name: '晶圆生产线', leader: '周组长', member_count: 20, sort: 1, status: 1, description: '晶圆生产' },
  '1-2-2': { name: '封装生产线', leader: '吴组长', member_count: 15, sort: 2, status: 1, description: '芯片封装' },
  '1-3': { name: '质量部', leader: '郑经理', member_count: 8, sort: 3, status: 1, description: '负责产品质量管控' },
  '1-4': { name: '信息技术部', leader: '陈经理', member_count: 6, sort: 4, status: 1, description: '负责IT系统建设与维护' },
  '1-5': { name: '人力资源部', leader: '林经理', member_count: 5, sort: 5, status: 1, description: '负责人事管理与培训' },
  '1-6': { name: '财务部', leader: '黄经理', member_count: 7, sort: 6, status: 1, description: '负责财务管理' },
}

export default function DepartmentsPage() {
  const [selectedKey, setSelectedKey] = useState<string>('1')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<any>(null)
  const [form] = Form.useForm()

  const selectedDept = deptDetails[selectedKey]

  // 新建部门
  const handleCreate = (parentKey?: string) => {
    setEditingDept(null)
    form.resetFields()
    if (parentKey) {
      form.setFieldsValue({ parent_id: parentKey })
    }
    setModalOpen(true)
  }

  // 编辑部门
  const handleEdit = () => {
    if (!selectedDept) return
    setEditingDept(selectedDept)
    form.setFieldsValue({
      ...selectedDept,
      parent_id: selectedKey.includes('-') ? selectedKey.slice(0, selectedKey.lastIndexOf('-')) : undefined,
    })
    setModalOpen(true)
  }

  // 删除部门
  const handleDelete = () => {
    message.success('删除成功')
  }

  // 树形选择数据
  const treeSelectData: any[] = departmentsData.map((node) => ({
    title: node.title as string,
    value: node.key as string,
    children: (node.children as DataNode[])?.map((child) => ({
      title: child.title as string,
      value: child.key as string,
      children: (child.children as DataNode[])?.map((grandChild) => ({
        title: grandChild.title as string,
        value: grandChild.key as string,
      })),
    })),
  }))

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>部门管理</Title>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* 左侧部门树 */}
        <Card
          title="组织架构"
          style={{ width: 320, flexShrink: 0 }}
          extra={
            <Button type="link" icon={<PlusOutlined />} onClick={() => handleCreate()}>
              新建
            </Button>
          }
        >
          <Tree
            showIcon
            defaultExpandAll
            treeData={departmentsData}
            selectedKeys={[selectedKey]}
            onSelect={(keys) => keys[0] && setSelectedKey(keys[0] as string)}
          />
        </Card>

        {/* 右侧部门详情 */}
        <Card
          title="部门详情"
          style={{ flex: 1 }}
          extra={
            selectedDept && (
              <Space>
                <Button icon={<PlusOutlined />} onClick={() => handleCreate(selectedKey)}>
                  添加子部门
                </Button>
                <Button icon={<EditOutlined />} onClick={handleEdit}>
                  编辑
                </Button>
                <Popconfirm title="确定删除此部门？删除后不可恢复" onConfirm={handleDelete}>
                  <Button danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )
          }
        >
          {selectedDept ? (
            <div>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="部门名称">{selectedDept.name}</Descriptions.Item>
                <Descriptions.Item label="部门负责人">{selectedDept.leader}</Descriptions.Item>
                <Descriptions.Item label="人员数量">
                  <Space>
                    <UserOutlined />
                    {selectedDept.member_count} 人
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={selectedDept.status === 1 ? 'success' : 'default'}>
                    {selectedDept.status === 1 ? '正常' : '停用'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="排序">{selectedDept.sort}</Descriptions.Item>
                <Descriptions.Item label="部门描述" span={2}>
                  {selectedDept.description || '-'}
                </Descriptions.Item>
              </Descriptions>

              <Card title="部门成员" style={{ marginTop: 16 }} size="small">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Array.from({ length: Math.min(selectedDept.member_count, 10) }).map((_, i) => (
                    <Tag key={i} icon={<UserOutlined />}>
                      员工{i + 1}
                    </Tag>
                  ))}
                  {selectedDept.member_count > 10 && (
                    <Tag>+{selectedDept.member_count - 10} 人</Tag>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Empty description="请选择部门" />
          )}
        </Card>
      </div>

      {/* 新建/编辑部门弹窗 */}
      <Modal
        title={editingDept ? '编辑部门' : '新建部门'}
        open={modalOpen}
        onOk={() => {
          form.validateFields().then((values) => {
            console.log(values)
            message.success(editingDept ? '更新成功' : '创建成功')
            setModalOpen(false)
          })
        }}
        onCancel={() => setModalOpen(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="parent_id" label="上级部门">
            <TreeSelect
              treeData={treeSelectData}
              placeholder="选择上级部门（可选）"
              allowClear
            />
          </Form.Item>
          <Form.Item name="name" label="部门名称" rules={[{ required: true }]}>
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item name="leader" label="负责人">
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入部门描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
