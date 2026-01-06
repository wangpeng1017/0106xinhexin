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
  Form,
  Select,
  TreeSelect,
  Upload,
  message,
  Popconfirm,
  Typography,
  Tabs,
  Tree,
  Empty,
} from 'antd'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FolderOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  FileImageOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadProps } from 'antd'

const { Title } = Typography
const { Search } = Input

// 模拟知识库树形数据
const knowledgeTreeData = [
  {
    title: '通用知识库',
    key: '1',
    icon: <FolderOutlined />,
    children: [
      { title: '公司制度', key: '1-1', icon: <FolderOutlined /> },
      { title: '员工手册', key: '1-2', icon: <FolderOutlined /> },
    ],
  },
  {
    title: '研发知识库',
    key: '2',
    icon: <FolderOutlined />,
    children: [
      { title: '设计文档', key: '2-1', icon: <FolderOutlined /> },
      { title: '工艺规程', key: '2-2', icon: <FolderOutlined /> },
    ],
  },
  {
    title: '生产知识库',
    key: '3',
    icon: <FolderOutlined />,
    children: [
      { title: '设备手册', key: '3-1', icon: <FolderOutlined /> },
      { title: '操作规程', key: '3-2', icon: <FolderOutlined /> },
    ],
  },
  {
    title: 'IT知识库',
    key: '4',
    icon: <FolderOutlined />,
  },
]

// 模拟文档数据
const documentsData = [
  {
    id: 1,
    title: '晶圆清洗工艺规程 V2.0',
    file_name: '晶圆清洗工艺规程.pdf',
    file_type: 'pdf',
    file_size: 2048000,
    kb_name: '生产知识库',
    vector_status: 2,
    uploaded_by: '张三',
    created_at: '2024-01-05 10:30',
  },
  {
    id: 2,
    title: '设备维护手册 - 光刻机',
    file_name: '光刻机维护手册.docx',
    file_type: 'docx',
    file_size: 5120000,
    kb_name: '设备知识库',
    vector_status: 2,
    uploaded_by: '李四',
    created_at: '2024-01-04 15:20',
  },
  {
    id: 3,
    title: '芯片设计图纸 A1024',
    file_name: 'A1024_layout.gds',
    file_type: 'gds',
    file_size: 10240000,
    kb_name: '研发知识库',
    vector_status: 1,
    uploaded_by: '王五',
    created_at: '2024-01-03 09:15',
  },
]

// 文件类型图标
const getFileIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    pdf: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
    docx: <FileWordOutlined style={{ color: '#1890ff' }} />,
    doc: <FileWordOutlined style={{ color: '#1890ff' }} />,
    xlsx: <FileExcelOutlined style={{ color: '#52c41a' }} />,
    xls: <FileExcelOutlined style={{ color: '#52c41a' }} />,
    mp4: <PlayCircleOutlined style={{ color: '#722ed1' }} />,
    png: <FileImageOutlined style={{ color: '#fa8c16' }} />,
    jpg: <FileImageOutlined style={{ color: '#fa8c16' }} />,
  }
  return icons[type] || <FileTextOutlined />
}

// 向量化状态
const vectorStatusMap: Record<number, { text: string; color: string }> = {
  0: { text: '待处理', color: 'default' },
  1: { text: '处理中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '失败', color: 'error' },
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

export default function KnowledgePage() {
  const [selectedKb, setSelectedKb] = useState<string>('1')
  const [kbModalOpen, setKbModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [kbForm] = Form.useForm()
  const [uploadForm] = Form.useForm()

  // 文档表格列配置
  const columns: ColumnsType<typeof documentsData[0]> = [
    {
      title: '文档名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {getFileIcon(record.file_type)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '所属知识库',
      dataIndex: 'kb_name',
      key: 'kb_name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size) => formatFileSize(size),
    },
    {
      title: '向量化状态',
      dataIndex: 'vector_status',
      key: 'vector_status',
      render: (status) => (
        <Tag color={vectorStatusMap[status].color}>
          {vectorStatusMap[status].text}
        </Tag>
      ),
    },
    {
      title: '上传人',
      dataIndex: 'uploaded_by',
      key: 'uploaded_by',
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">下载</Button>
          <Popconfirm title="确定删除此文档？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/v1/documents/upload',
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>知识库管理</Title>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* 左侧知识库树 */}
        <Card
          title="知识库分类"
          style={{ width: 280, flexShrink: 0 }}
          extra={
            <Button type="link" icon={<PlusOutlined />} onClick={() => setKbModalOpen(true)}>
              新建
            </Button>
          }
        >
          <Tree
            showIcon
            defaultExpandAll
            treeData={knowledgeTreeData}
            selectedKeys={[selectedKb]}
            onSelect={(keys) => keys[0] && setSelectedKb(keys[0] as string)}
          />
        </Card>

        {/* 右侧文档列表 */}
        <Card style={{ flex: 1 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Search placeholder="搜索文档" style={{ width: 300 }} />
            </Space>
            <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>
              上传文档
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={documentsData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      {/* 新建知识库弹窗 */}
      <Modal
        title="新建知识库"
        open={kbModalOpen}
        onOk={() => {
          kbForm.validateFields().then((values) => {
            console.log(values)
            message.success('创建成功')
            setKbModalOpen(false)
            kbForm.resetFields()
          })
        }}
        onCancel={() => setKbModalOpen(false)}
      >
        <Form form={kbForm} layout="vertical">
          <Form.Item name="name" label="知识库名称" rules={[{ required: true }]}>
            <Input placeholder="请输入知识库名称" />
          </Form.Item>
          <Form.Item name="parent_id" label="上级知识库">
            <TreeSelect
              treeData={knowledgeTreeData}
              placeholder="选择上级知识库（可选）"
              allowClear
            />
          </Form.Item>
          <Form.Item name="level" label="安全级别" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 1, label: '通用（全员可见）' },
                { value: 2, label: '运营（部门可见）' },
                { value: 3, label: '涉密（指定人员）' },
              ]}
            />
          </Form.Item>
          <Form.Item name="domain" label="所属领域">
            <Select
              options={[
                { value: 'research', label: '研发' },
                { value: 'production', label: '生产' },
                { value: 'it', label: 'IT' },
                { value: 'hr', label: '人力资源' },
              ]}
              allowClear
            />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 上传文档弹窗 */}
      <Modal
        title="上传文档"
        open={uploadModalOpen}
        onOk={() => {
          message.success('上传成功')
          setUploadModalOpen(false)
        }}
        onCancel={() => setUploadModalOpen(false)}
        width={600}
      >
        <Form form={uploadForm} layout="vertical">
          <Form.Item name="kb_id" label="目标知识库" rules={[{ required: true }]}>
            <TreeSelect
              treeData={knowledgeTreeData}
              placeholder="选择目标知识库"
            />
          </Form.Item>
          <Form.Item label="选择文件">
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">
                支持 PDF、Word、Excel、PPT、视频、DXF、DWG、GDS 等格式
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
