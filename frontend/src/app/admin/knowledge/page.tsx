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
  Tree,
  Tabs,
  Progress,
  Descriptions,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
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
  SoundOutlined,
  EyeOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadProps } from 'antd'

const { Title, Text, Paragraph } = Typography
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
      { title: '设计图纸', key: '2-1', icon: <FolderOutlined /> },
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
    title: '培训资料库',
    key: '4',
    icon: <FolderOutlined />,
    children: [
      { title: '培训视频', key: '4-1', icon: <FolderOutlined /> },
      { title: '培训音频', key: '4-2', icon: <FolderOutlined /> },
    ],
  },
]

// 文件类型配置
const fileTypeConfig: Record<string, { icon: React.ReactNode; color: string; label: string; aiExtract: string }> = {
  pdf: { icon: <FilePdfOutlined />, color: '#ff4d4f', label: 'PDF文档', aiExtract: '文本提取 + OCR识别' },
  docx: { icon: <FileWordOutlined />, color: '#1890ff', label: 'Word文档', aiExtract: '文本提取 + 格式解析' },
  doc: { icon: <FileWordOutlined />, color: '#1890ff', label: 'Word文档', aiExtract: '文本提取 + 格式解析' },
  xlsx: { icon: <FileExcelOutlined />, color: '#52c41a', label: 'Excel表格', aiExtract: '表格数据提取' },
  dxf: { icon: <FileOutlined />, color: '#722ed1', label: 'DXF图纸', aiExtract: '图层解析 + 元数据提取' },
  dwg: { icon: <FileOutlined />, color: '#722ed1', label: 'DWG图纸', aiExtract: '图层解析 + 元数据提取' },
  gds: { icon: <FileOutlined />, color: '#eb2f96', label: 'GDS版图', aiExtract: '版图结构 + 元数据提取' },
  mp4: { icon: <PlayCircleOutlined />, color: '#fa8c16', label: '视频文件', aiExtract: '语音转文字 + 关键帧提取' },
  avi: { icon: <PlayCircleOutlined />, color: '#fa8c16', label: '视频文件', aiExtract: '语音转文字 + 关键帧提取' },
  mp3: { icon: <SoundOutlined />, color: '#13c2c2', label: '音频文件', aiExtract: '语音转文字 (ASR)' },
  wav: { icon: <SoundOutlined />, color: '#13c2c2', label: '音频文件', aiExtract: '语音转文字 (ASR)' },
  png: { icon: <FileImageOutlined />, color: '#faad14', label: '图片文件', aiExtract: 'OCR文字识别' },
  jpg: { icon: <FileImageOutlined />, color: '#faad14', label: '图片文件', aiExtract: 'OCR文字识别' },
}

// 模拟文档数据 - 增加更多类型
const documentsData = [
  {
    id: 1,
    title: '晶圆清洗工艺规程 V2.0',
    file_name: '晶圆清洗工艺规程.pdf',
    file_type: 'pdf',
    file_size: 2048000,
    kb_name: '生产知识库',
    ai_status: 'completed',
    extract_summary: '包含清洗流程、化学品配比、设备参数等内容，共提取 156 个知识片段',
    chunk_count: 156,
    uploaded_by: '张三',
    created_at: '2024-01-05 10:30',
  },
  {
    id: 2,
    title: 'A1024芯片版图设计',
    file_name: 'A1024_layout.gds',
    file_type: 'gds',
    file_size: 15360000,
    kb_name: '研发知识库',
    ai_status: 'completed',
    extract_summary: '提取版图元数据：32层结构、1024个单元、设计规则检查通过',
    chunk_count: 32,
    uploaded_by: '李四',
    created_at: '2024-01-05 09:15',
  },
  {
    id: 3,
    title: '封装设备CAD图纸',
    file_name: '封装设备_001.dwg',
    file_type: 'dwg',
    file_size: 8192000,
    kb_name: '设备知识库',
    ai_status: 'completed',
    extract_summary: '提取图层信息：机械结构层、电气层、标注层，共 45 个零件信息',
    chunk_count: 45,
    uploaded_by: '王五',
    created_at: '2024-01-04 16:20',
  },
  {
    id: 4,
    title: '光刻机操作培训视频',
    file_name: '光刻机操作培训.mp4',
    file_type: 'mp4',
    file_size: 524288000,
    kb_name: '培训资料库',
    ai_status: 'completed',
    extract_summary: '视频时长 45 分钟，语音转文字 12,350 字，提取关键帧 89 张',
    chunk_count: 89,
    uploaded_by: '赵六',
    created_at: '2024-01-04 14:00',
  },
  {
    id: 5,
    title: '安全生产培训录音',
    file_name: '安全培训_2024.mp3',
    file_type: 'mp3',
    file_size: 45678000,
    kb_name: '培训资料库',
    ai_status: 'completed',
    extract_summary: '音频时长 32 分钟，语音识别转文字 8,920 字',
    chunk_count: 28,
    uploaded_by: '钱七',
    created_at: '2024-01-04 11:30',
  },
  {
    id: 6,
    title: '测试夹具设计图',
    file_name: '测试夹具_v3.dxf',
    file_type: 'dxf',
    file_size: 3072000,
    kb_name: '研发知识库',
    ai_status: 'processing',
    extract_summary: '正在解析图层和元数据...',
    chunk_count: 0,
    uploaded_by: '孙八',
    created_at: '2024-01-05 11:00',
  },
  {
    id: 7,
    title: '新员工入职手册',
    file_name: '入职手册2024.pdf',
    file_type: 'pdf',
    file_size: 5120000,
    kb_name: '通用知识库',
    ai_status: 'pending',
    extract_summary: '等待 AI 处理...',
    chunk_count: 0,
    uploaded_by: '周九',
    created_at: '2024-01-05 11:30',
  },
]

// AI处理状态配置
const aiStatusConfig: Record<string, { icon: React.ReactNode; color: string; text: string }> = {
  pending: { icon: <ClockCircleOutlined />, color: 'default', text: '待处理' },
  processing: { icon: <SyncOutlined spin />, color: 'processing', text: 'AI提取中' },
  completed: { icon: <CheckCircleOutlined />, color: 'success', text: '已完成' },
  failed: { icon: <CloseCircleOutlined />, color: 'error', text: '处理失败' },
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}

export default function KnowledgePage() {
  const [selectedKb, setSelectedKb] = useState<string>('1')
  const [kbModalOpen, setKbModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<typeof documentsData[0] | null>(null)
  const [kbForm] = Form.useForm()
  const [uploadForm] = Form.useForm()

  // 查看文档详情
  const handleViewDetail = (doc: typeof documentsData[0]) => {
    setSelectedDoc(doc)
    setDetailModalOpen(true)
  }

  // 文档表格列配置
  const columns: ColumnsType<typeof documentsData[0]> = [
    {
      title: '文档名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => {
        const config = fileTypeConfig[record.file_type] || { icon: <FileTextOutlined />, color: '#666' }
        return (
          <Space>
            <span style={{ color: config.color, fontSize: 18 }}>{config.icon}</span>
            <div>
              <div style={{ fontWeight: 500 }}>{text}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record.file_name}</Text>
            </div>
          </Space>
        )
      },
    },
    {
      title: '文件类型',
      dataIndex: 'file_type',
      key: 'file_type',
      width: 120,
      render: (type) => {
        const config = fileTypeConfig[type] || { label: type.toUpperCase(), color: '#666' }
        return <Tag color={config.color}>{config.label}</Tag>
      },
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      key: 'file_size',
      width: 100,
      render: (size) => formatFileSize(size),
    },
    {
      title: 'AI提取状态',
      dataIndex: 'ai_status',
      key: 'ai_status',
      width: 130,
      render: (status, record) => {
        const config = aiStatusConfig[status]
        return (
          <Tooltip title={record.extract_summary}>
            <Tag icon={config.icon} color={config.color}>
              {config.text}
            </Tag>
          </Tooltip>
        )
      },
    },
    {
      title: '知识片段',
      dataIndex: 'chunk_count',
      key: 'chunk_count',
      width: 100,
      render: (count, record) => (
        record.ai_status === 'completed' ? (
          <Badge count={count} style={{ backgroundColor: '#52c41a' }} overflowCount={999} />
        ) : '-'
      ),
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看详情">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          </Tooltip>
          <Tooltip title="重新提取">
            <Button type="link" size="small" icon={<RobotOutlined />} disabled={record.ai_status === 'processing'} />
          </Tooltip>
          <Popconfirm title="确定删除此文档？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
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
    accept: '.pdf,.doc,.docx,.xlsx,.xls,.dxf,.dwg,.gds,.mp4,.avi,.mp3,.wav,.png,.jpg,.jpeg',
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功，AI 正在提取内容...`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  // 统计数据
  const stats = {
    total: documentsData.length,
    completed: documentsData.filter(d => d.ai_status === 'completed').length,
    processing: documentsData.filter(d => d.ai_status === 'processing').length,
    chunks: documentsData.reduce((sum, d) => sum + d.chunk_count, 0),
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>知识库管理</Title>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="文档总数" value={stats.total} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="AI已处理" value={stats.completed} valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="处理中" value={stats.processing} valueStyle={{ color: '#1890ff' }} prefix={<SyncOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="知识片段" value={stats.chunks} prefix={<RobotOutlined />} />
          </Card>
        </Col>
      </Row>

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
          <Tabs
            items={[
              {
                key: 'all',
                label: '全部文档',
                children: (
                  <>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                      <Space>
                        <Search placeholder="搜索文档" style={{ width: 250 }} />
                        <Select
                          style={{ width: 140 }}
                          placeholder="文件类型"
                          allowClear
                          options={[
                            { value: 'pdf', label: 'PDF文档' },
                            { value: 'dwg', label: 'DWG图纸' },
                            { value: 'dxf', label: 'DXF图纸' },
                            { value: 'gds', label: 'GDS版图' },
                            { value: 'mp4', label: '视频文件' },
                            { value: 'mp3', label: '音频文件' },
                          ]}
                        />
                        <Select
                          style={{ width: 130 }}
                          placeholder="AI状态"
                          allowClear
                          options={[
                            { value: 'completed', label: '已完成' },
                            { value: 'processing', label: '处理中' },
                            { value: 'pending', label: '待处理' },
                          ]}
                        />
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
                  </>
                ),
              },
              {
                key: 'formats',
                label: '支持格式',
                children: (
                  <div>
                    <Row gutter={[16, 16]}>
                      {Object.entries(fileTypeConfig).map(([type, config]) => (
                        <Col span={8} key={type}>
                          <Card size="small" hoverable>
                            <Space>
                              <span style={{ fontSize: 24, color: config.color }}>{config.icon}</span>
                              <div>
                                <div style={{ fontWeight: 500 }}>{config.label}</div>
                                <Text type="secondary" style={{ fontSize: 12 }}>.{type}</Text>
                              </div>
                            </Space>
                            <div style={{ marginTop: 8 }}>
                              <Tag icon={<RobotOutlined />} color="blue">{config.aiExtract}</Tag>
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ),
              },
            ]}
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
          message.success('上传成功，AI 开始提取内容')
          setUploadModalOpen(false)
        }}
        onCancel={() => setUploadModalOpen(false)}
        width={700}
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
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">
                支持格式：PDF、Word、Excel、DXF、DWG、GDS、MP4、MP3 等
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Space>
              <RobotOutlined style={{ color: '#52c41a', fontSize: 20 }} />
              <div>
                <div style={{ fontWeight: 500 }}>AI 智能提取</div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  上传后系统将自动进行：文本提取、OCR识别、语音转文字、元数据解析，并生成可检索的知识片段
                </Text>
              </div>
            </Space>
          </Card>
        </Form>
      </Modal>

      {/* 文档详情弹窗 */}
      <Modal
        title="文档详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        width={700}
      >
        {selectedDoc && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="文档名称" span={2}>{selectedDoc.title}</Descriptions.Item>
              <Descriptions.Item label="文件名">{selectedDoc.file_name}</Descriptions.Item>
              <Descriptions.Item label="文件类型">
                <Tag color={fileTypeConfig[selectedDoc.file_type]?.color}>
                  {fileTypeConfig[selectedDoc.file_type]?.label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="文件大小">{formatFileSize(selectedDoc.file_size)}</Descriptions.Item>
              <Descriptions.Item label="所属知识库">{selectedDoc.kb_name}</Descriptions.Item>
              <Descriptions.Item label="上传人">{selectedDoc.uploaded_by}</Descriptions.Item>
              <Descriptions.Item label="上传时间">{selectedDoc.created_at}</Descriptions.Item>
            </Descriptions>

            <Card title={<><RobotOutlined /> AI 提取结果</>} size="small" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="处理状态">
                  <Tag icon={aiStatusConfig[selectedDoc.ai_status].icon} color={aiStatusConfig[selectedDoc.ai_status].color}>
                    {aiStatusConfig[selectedDoc.ai_status].text}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="提取方式">
                  {fileTypeConfig[selectedDoc.file_type]?.aiExtract}
                </Descriptions.Item>
                <Descriptions.Item label="知识片段数">
                  <Badge count={selectedDoc.chunk_count} style={{ backgroundColor: '#52c41a' }} showZero />
                </Descriptions.Item>
                <Descriptions.Item label="提取摘要">
                  {selectedDoc.extract_summary}
                </Descriptions.Item>
              </Descriptions>

              {selectedDoc.ai_status === 'completed' && (
                <div style={{ marginTop: 16 }}>
                  <Text strong>示例知识片段：</Text>
                  <Card size="small" style={{ marginTop: 8, background: '#fafafa' }}>
                    <Paragraph ellipsis={{ rows: 3 }} style={{ marginBottom: 0 }}>
                      {selectedDoc.file_type === 'pdf' && '晶圆清洗工艺流程包括：1. SC-1清洗（NH4OH:H2O2:H2O = 1:1:5），温度75-80°C，时间10分钟；2. SC-2清洗（HCl:H2O2:H2O = 1:1:6），温度75-80°C，时间10分钟...'}
                      {selectedDoc.file_type === 'gds' && '版图层级结构：METAL1 (层号: 1), METAL2 (层号: 2), VIA1 (层号: 51), POLY (层号: 13)... 设计规则：最小线宽 0.18um, 最小间距 0.22um...'}
                      {selectedDoc.file_type === 'dwg' && '零件清单：主体框架 (304不锈钢), 定位销 (45#钢淬火), 压紧块 (铝合金7075)... 装配关系：主体框架 -> 定位销 x4 -> 压紧块 x2...'}
                      {selectedDoc.file_type === 'mp4' && '【00:05:30】讲师：光刻机的主要组成部分包括光源系统、照明系统、掩模台、投影物镜和工件台。下面我们详细介绍每个部分的功能...'}
                      {selectedDoc.file_type === 'mp3' && '【00:02:15】安全注意事项第一条：进入洁净室前必须穿戴完整的防护装备，包括洁净服、手套、口罩和鞋套...'}
                      {selectedDoc.file_type === 'dxf' && '图层信息：0 (默认层), DIMENSION (标注层), HIDDEN (隐藏线层)... 实体统计：LINE 1256个, CIRCLE 89个, ARC 234个...'}
                    </Paragraph>
                  </Card>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  )
}
