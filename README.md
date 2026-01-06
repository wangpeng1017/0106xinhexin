# 新核芯知识库智能体系统

> 半导体企业知识库 + 智能体 + 培训考试一体化平台

## 项目结构

```
xinhexin-kb/
├── backend/          # Python FastAPI 后端
├── frontend/         # Next.js 前端
├── docs/             # 文档
│   ├── PRD.md        # 产品需求文档
│   └── TECH.md       # 技术文档
└── scripts/          # 部署脚本
```

## 技术栈

- **后端**: Python 3.11 + FastAPI
- **前端**: Next.js 14 + React 18 + Ant Design 5
- **数据库**: MySQL 8.0
- **向量库**: Milvus 2.x
- **文件存储**: MinIO
- **LLM**: Qwen2.5-7B + BGE-M3

## 快速开始

### 1. 后端启动

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. 前端启动

```bash
cd frontend
npm install
npm run dev
```

## 文档

- [PRD 产品需求文档](docs/PRD.md)
- [TECH 技术文档](docs/TECH.md)

## License

Proprietary - 青岛新核芯科技有限公司
