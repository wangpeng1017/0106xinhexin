# 新核芯知识库智能体系统 技术文档 (TECH)

> 最后更新: 2026-01-06 | 版本: 1.0

---

## 一、数据库设计 (MySQL 8.0)

### 1.1 用户与权限模块

```sql
-- 部门表
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '部门名称',
    parent_id BIGINT DEFAULT NULL COMMENT '上级部门ID',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 角色表
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '角色名称',
    code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(255) COMMENT '角色描述',
    permissions JSON COMMENT '权限列表',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(bcrypt)',
    real_name VARCHAR(50) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(255) COMMENT '头像URL',
    department_id BIGINT COMMENT '部门ID',
    role_id BIGINT COMMENT '角色ID',
    dingtalk_user_id VARCHAR(100) COMMENT '钉钉用户ID',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX idx_department (department_id),
    INDEX idx_role (role_id),
    INDEX idx_dingtalk (dingtalk_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 1.2 知识库模块

```sql
-- 知识库分类表
CREATE TABLE knowledge_bases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '知识库名称',
    description TEXT COMMENT '描述',
    icon VARCHAR(50) COMMENT '图标',
    color VARCHAR(20) COMMENT '颜色',
    parent_id BIGINT DEFAULT NULL COMMENT '上级知识库ID',
    level TINYINT DEFAULT 1 COMMENT '层级: 1通用 2运营 3涉密',
    domain VARCHAR(50) COMMENT '领域: research/it/production',
    access_level TINYINT DEFAULT 1 COMMENT '访问级别: 1公开 2部门 3指定',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id),
    INDEX idx_level (level),
    INDEX idx_domain (domain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库表';

-- 知识库访问权限表
CREATE TABLE kb_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    kb_id BIGINT NOT NULL COMMENT '知识库ID',
    target_type ENUM('user', 'role', 'department') NOT NULL COMMENT '目标类型',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    permission ENUM('read', 'write', 'admin') DEFAULT 'read' COMMENT '权限',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    UNIQUE KEY uk_kb_target (kb_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库权限表';

-- 文档表
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    kb_id BIGINT NOT NULL COMMENT '知识库ID',
    title VARCHAR(255) NOT NULL COMMENT '文档标题',
    file_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '存储路径(MinIO)',
    file_type VARCHAR(20) NOT NULL COMMENT '文件类型: pdf/docx/xlsx/pptx/mp4/dxf/dwg/gds',
    file_size BIGINT DEFAULT 0 COMMENT '文件大小(字节)',
    content_hash VARCHAR(64) COMMENT '内容哈希(SHA256)',
    text_content LONGTEXT COMMENT '提取的文本内容',
    metadata JSON COMMENT '元数据(图纸参数等)',
    vector_status TINYINT DEFAULT 0 COMMENT '向量化状态: 0待处理 1处理中 2完成 3失败',
    vector_id VARCHAR(100) COMMENT 'Milvus向量ID',
    version INT DEFAULT 1 COMMENT '版本号',
    status TINYINT DEFAULT 1 COMMENT '状态: 1正常 0删除',
    uploaded_by BIGINT COMMENT '上传人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    INDEX idx_kb (kb_id),
    INDEX idx_type (file_type),
    INDEX idx_vector_status (vector_status),
    FULLTEXT INDEX ft_content (title, text_content) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档表';

-- 文档版本历史表
CREATE TABLE document_versions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL COMMENT '文档ID',
    version INT NOT NULL COMMENT '版本号',
    file_path VARCHAR(500) NOT NULL COMMENT '存储路径',
    file_size BIGINT DEFAULT 0 COMMENT '文件大小',
    content_hash VARCHAR(64) COMMENT '内容哈希',
    change_note VARCHAR(255) COMMENT '变更说明',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    UNIQUE KEY uk_doc_version (document_id, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文档版本历史表';
```

### 1.3 智能体模块

```sql
-- 智能体表
CREATE TABLE agents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '智能体名称',
    description TEXT COMMENT '描述',
    icon VARCHAR(50) COMMENT '图标',
    system_prompt TEXT COMMENT '系统提示词',
    model_name VARCHAR(50) DEFAULT 'qwen2.5-7b' COMMENT '模型名称',
    temperature DECIMAL(2,1) DEFAULT 0.7 COMMENT '温度参数',
    max_tokens INT DEFAULT 2048 COMMENT '最大token数',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能体表';

-- 智能体关联知识库表
CREATE TABLE agent_knowledge_bases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL COMMENT '智能体ID',
    kb_id BIGINT NOT NULL COMMENT '知识库ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    UNIQUE KEY uk_agent_kb (agent_id, kb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能体知识库关联表';

-- 智能体访问权限表
CREATE TABLE agent_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL COMMENT '智能体ID',
    target_type ENUM('user', 'role', 'department') NOT NULL COMMENT '目标类型',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    UNIQUE KEY uk_agent_target (agent_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能体权限表';

-- 对话表
CREATE TABLE conversations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    agent_id BIGINT NOT NULL COMMENT '智能体ID',
    title VARCHAR(100) COMMENT '对话标题',
    status TINYINT DEFAULT 1 COMMENT '状态: 1进行中 0已结束',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_agent (agent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='对话表';

-- 消息表
CREATE TABLE messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL COMMENT '对话ID',
    role ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
    content TEXT NOT NULL COMMENT '消息内容',
    tokens INT DEFAULT 0 COMMENT 'token数量',
    references JSON COMMENT '引用的文档列表',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';
```

### 1.4 培训考试模块

```sql
-- 培训场景表
CREATE TABLE training_scenes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '场景名称',
    description TEXT COMMENT '描述',
    icon VARCHAR(50) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='培训场景表';

-- 题目表
CREATE TABLE questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    scene_id BIGINT NOT NULL COMMENT '场景ID',
    type ENUM('single', 'multiple', 'judge', 'fill') NOT NULL COMMENT '题型',
    content TEXT NOT NULL COMMENT '题目内容',
    options JSON COMMENT '选项(选择题)',
    answer TEXT NOT NULL COMMENT '答案',
    analysis TEXT COMMENT '解析',
    difficulty TINYINT DEFAULT 2 COMMENT '难度: 1简单 2中等 3困难',
    score INT DEFAULT 1 COMMENT '分值',
    tags JSON COMMENT '标签/知识点',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scene_id) REFERENCES training_scenes(id) ON DELETE CASCADE,
    INDEX idx_scene (scene_id),
    INDEX idx_type (type),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题目表';

-- 试卷表
CREATE TABLE exams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    scene_id BIGINT NOT NULL COMMENT '场景ID',
    title VARCHAR(200) NOT NULL COMMENT '试卷标题',
    description TEXT COMMENT '描述',
    duration INT DEFAULT 60 COMMENT '考试时长(分钟)',
    total_score INT DEFAULT 100 COMMENT '总分',
    pass_score INT DEFAULT 60 COMMENT '及格分',
    question_ids JSON COMMENT '题目ID列表',
    shuffle_questions TINYINT DEFAULT 0 COMMENT '是否打乱题目顺序',
    shuffle_options TINYINT DEFAULT 0 COMMENT '是否打乱选项顺序',
    show_answer TINYINT DEFAULT 1 COMMENT '交卷后是否显示答案',
    allow_retry TINYINT DEFAULT 1 COMMENT '是否允许重考',
    max_retry INT DEFAULT 3 COMMENT '最大重考次数',
    start_time DATETIME COMMENT '开始时间',
    end_time DATETIME COMMENT '结束时间',
    status TINYINT DEFAULT 1 COMMENT '状态: 1启用 0禁用',
    created_by BIGINT COMMENT '创建人',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scene_id) REFERENCES training_scenes(id) ON DELETE CASCADE,
    INDEX idx_scene (scene_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷表';

-- 考试记录表
CREATE TABLE exam_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    exam_id BIGINT NOT NULL COMMENT '试卷ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    score INT COMMENT '得分',
    answers JSON COMMENT '用户答案',
    correct_count INT DEFAULT 0 COMMENT '正确题数',
    wrong_count INT DEFAULT 0 COMMENT '错误题数',
    start_time DATETIME COMMENT '开始时间',
    submit_time DATETIME COMMENT '提交时间',
    duration INT COMMENT '实际用时(秒)',
    status TINYINT DEFAULT 0 COMMENT '状态: 0进行中 1已完成 2已放弃',
    retry_count INT DEFAULT 0 COMMENT '重考次数',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_exam (exam_id),
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考试记录表';

-- 证书表
CREATE TABLE certificates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    scene_id BIGINT NOT NULL COMMENT '场景ID',
    exam_record_id BIGINT COMMENT '考试记录ID',
    cert_no VARCHAR(50) NOT NULL UNIQUE COMMENT '证书编号',
    cert_name VARCHAR(200) NOT NULL COMMENT '证书名称',
    issue_date DATE NOT NULL COMMENT '颁发日期',
    expire_date DATE COMMENT '过期日期',
    cert_url VARCHAR(500) COMMENT '证书图片URL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (scene_id) REFERENCES training_scenes(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_scene (scene_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='证书表';
```

### 1.5 系统日志模块

```sql
-- 审计日志表
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    action VARCHAR(50) NOT NULL COMMENT '操作类型',
    target_type VARCHAR(50) COMMENT '目标类型',
    target_id BIGINT COMMENT '目标ID',
    detail JSON COMMENT '详情',
    ip VARCHAR(50) COMMENT 'IP地址',
    user_agent VARCHAR(255) COMMENT '浏览器UA',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='审计日志表';

-- 系统配置表
CREATE TABLE system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    description VARCHAR(255) COMMENT '描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
```

---

## 二、API 接口规范

### 2.1 通用规范

**Base URL**: `http://localhost:8000/api/v1`

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <token>
```

**响应格式**:
```json
{
    "code": 0,           // 0成功, 非0失败
    "message": "success",
    "data": {}           // 业务数据
}
```

**分页参数**:
```
?page=1&page_size=20
```

**分页响应**:
```json
{
    "code": 0,
    "data": {
        "list": [],
        "total": 100,
        "page": 1,
        "page_size": 20
    }
}
```

### 2.2 认证模块

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/login | 用户登录 |
| POST | /auth/logout | 用户登出 |
| GET | /auth/profile | 获取当前用户信息 |
| PUT | /auth/password | 修改密码 |
| POST | /auth/dingtalk/login | 钉钉扫码登录 |

#### POST /auth/login
```json
// Request
{
    "username": "admin",
    "password": "123456"
}

// Response
{
    "code": 0,
    "data": {
        "token": "eyJ...",
        "expires_in": 86400,
        "user": {
            "id": 1,
            "username": "admin",
            "real_name": "管理员",
            "role": "admin"
        }
    }
}
```

### 2.3 用户管理模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /users | 用户列表 |
| POST | /users | 创建用户 |
| GET | /users/:id | 用户详情 |
| PUT | /users/:id | 更新用户 |
| DELETE | /users/:id | 删除用户 |
| GET | /departments | 部门列表(树形) |
| POST | /departments | 创建部门 |
| PUT | /departments/:id | 更新部门 |
| DELETE | /departments/:id | 删除部门 |
| GET | /roles | 角色列表 |
| POST | /roles | 创建角色 |
| PUT | /roles/:id | 更新角色 |
| DELETE | /roles/:id | 删除角色 |

### 2.4 知识库模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /knowledge-bases | 知识库列表(树形) |
| POST | /knowledge-bases | 创建知识库 |
| GET | /knowledge-bases/:id | 知识库详情 |
| PUT | /knowledge-bases/:id | 更新知识库 |
| DELETE | /knowledge-bases/:id | 删除知识库 |
| GET | /knowledge-bases/:id/documents | 文档列表 |
| POST | /knowledge-bases/:id/documents | 上传文档 |
| GET | /documents/:id | 文档详情 |
| DELETE | /documents/:id | 删除文档 |
| GET | /documents/:id/download | 下载文档 |
| POST | /documents/search | 搜索文档 |

#### POST /knowledge-bases/:id/documents
```
Content-Type: multipart/form-data

file: (binary)
title: "设备操作手册"
```

#### POST /documents/search
```json
// Request
{
    "query": "晶圆清洗工艺参数",
    "kb_ids": [1, 2],      // 可选，限定知识库
    "file_types": ["pdf"], // 可选，限定文件类型
    "page": 1,
    "page_size": 10
}

// Response
{
    "code": 0,
    "data": {
        "list": [
            {
                "id": 1,
                "title": "晶圆清洗操作规程",
                "snippet": "...清洗工艺参数包括温度、时间...",
                "score": 0.95,
                "file_type": "pdf",
                "kb_name": "生产工艺"
            }
        ],
        "total": 5
    }
}
```

### 2.5 智能体模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /agents | 智能体列表 |
| POST | /agents | 创建智能体 |
| GET | /agents/:id | 智能体详情 |
| PUT | /agents/:id | 更新智能体 |
| DELETE | /agents/:id | 删除智能体 |
| GET | /agents/:id/permissions | 权限列表 |
| PUT | /agents/:id/permissions | 更新权限 |
| GET | /conversations | 对话列表 |
| POST | /conversations | 创建对话 |
| GET | /conversations/:id | 对话详情(含消息) |
| DELETE | /conversations/:id | 删除对话 |
| POST | /conversations/:id/messages | 发送消息 |

#### POST /conversations/:id/messages
```json
// Request
{
    "content": "晶圆清洗的温度参数是多少？"
}

// Response (SSE流式)
event: message
data: {"content": "根据", "done": false}

event: message
data: {"content": "知识库", "done": false}

event: message
data: {"content": "...", "done": true, "references": [{"doc_id": 1, "title": "清洗规程"}]}
```

### 2.6 培训考试模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /training/scenes | 培训场景列表 |
| POST | /training/scenes | 创建场景 |
| PUT | /training/scenes/:id | 更新场景 |
| DELETE | /training/scenes/:id | 删除场景 |
| GET | /training/questions | 题目列表 |
| POST | /training/questions | 创建题目 |
| POST | /training/questions/import | 批量导入题目 |
| PUT | /training/questions/:id | 更新题目 |
| DELETE | /training/questions/:id | 删除题目 |
| GET | /training/exams | 试卷列表 |
| POST | /training/exams | 创建试卷 |
| POST | /training/exams/generate | 智能组卷 |
| GET | /training/exams/:id | 试卷详情 |
| PUT | /training/exams/:id | 更新试卷 |
| DELETE | /training/exams/:id | 删除试卷 |
| POST | /training/exams/:id/start | 开始考试 |
| POST | /training/exams/:id/submit | 提交答案 |
| GET | /training/records | 考试记录列表 |
| GET | /training/records/:id | 考试记录详情 |
| GET | /training/statistics | 培训统计 |
| GET | /certificates | 证书列表 |
| GET | /certificates/:id/download | 下载证书 |

#### POST /training/exams/generate
```json
// Request - 智能组卷
{
    "scene_id": 1,
    "title": "安全培训考试",
    "question_count": 20,
    "difficulty_ratio": {
        "easy": 0.3,
        "medium": 0.5,
        "hard": 0.2
    },
    "duration": 60,
    "pass_score": 60
}
```

#### POST /training/exams/:id/submit
```json
// Request
{
    "answers": {
        "1": "A",
        "2": ["A", "C"],
        "3": true,
        "4": "答案文本"
    }
}

// Response
{
    "code": 0,
    "data": {
        "score": 85,
        "total_score": 100,
        "pass": true,
        "correct_count": 17,
        "wrong_count": 3,
        "duration": 1800
    }
}
```

### 2.7 系统管理模块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /system/configs | 系统配置列表 |
| PUT | /system/configs | 更新系统配置 |
| GET | /system/audit-logs | 审计日志列表 |
| GET | /system/statistics | 系统统计 |

---

## 三、向量检索设计

### 3.1 Milvus Collection 设计

```python
from pymilvus import CollectionSchema, FieldSchema, DataType

# 文档向量集合
document_vectors_schema = CollectionSchema(
    fields=[
        FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
        FieldSchema(name="doc_id", dtype=DataType.INT64),  # MySQL documents.id
        FieldSchema(name="chunk_index", dtype=DataType.INT32),  # 分块索引
        FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1024),  # BGE-M3
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=8000),  # 分块文本
    ],
    description="Document embeddings"
)

# 创建索引
index_params = {
    "metric_type": "COSINE",
    "index_type": "IVF_FLAT",
    "params": {"nlist": 1024}
}
```

### 3.2 文档向量化流程

```
1. 文档上传 → 2. 文本提取 → 3. 文本分块 → 4. 向量化 → 5. 存入Milvus

分块策略:
- 每块最大 500 tokens
- 重叠 50 tokens
- 保留段落完整性
```

---

## 四、项目目录结构

```
xinhexin-kb/
├── backend/                    # 后端代码
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI 入口
│   │   ├── config.py          # 配置
│   │   ├── database.py        # 数据库连接
│   │   ├── models/            # ORM 模型
│   │   │   ├── user.py
│   │   │   ├── knowledge.py
│   │   │   ├── agent.py
│   │   │   └── training.py
│   │   ├── schemas/           # Pydantic 模型
│   │   ├── routers/           # API 路由
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── knowledge.py
│   │   │   ├── agents.py
│   │   │   └── training.py
│   │   ├── services/          # 业务逻辑
│   │   │   ├── auth.py
│   │   │   ├── knowledge.py
│   │   │   ├── llm.py
│   │   │   ├── vector.py
│   │   │   └── document.py
│   │   └── utils/             # 工具函数
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                   # 前端代码
│   ├── src/
│   │   ├── api/               # API 调用
│   │   ├── components/        # 组件
│   │   ├── views/             # 页面
│   │   ├── stores/            # Pinia 状态
│   │   ├── router/            # 路由
│   │   └── utils/             # 工具
│   ├── package.json
│   └── Dockerfile
│
├── docs/                       # 文档
│   ├── PRD.md
│   ├── TECH.md
│   └── DEPLOY.md
│
├── scripts/                    # 脚本
│   ├── init_db.sql            # 数据库初始化
│   └── deploy.sh              # 部署脚本
│
├── docker-compose.yml          # Docker 编排
└── README.md
```

---

## 五、变更历史

| 日期 | 版本 | 变更内容 | 操作人 |
|------|------|----------|--------|
| 2026-01-06 | 1.0 | 初始版本，数据库设计 + API 设计 | AI |
