-- ===========================================
-- 新核芯知识库智能体系统 - 数据库初始化脚本
-- 数据库: MySQL 8.0
-- ===========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS xinhexin_kb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE xinhexin_kb;

-- ===========================================
-- 1. 用户与权限模块
-- ===========================================

-- 部门表
CREATE TABLE IF NOT EXISTS departments (
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
CREATE TABLE IF NOT EXISTS roles (
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
CREATE TABLE IF NOT EXISTS users (
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

-- ===========================================
-- 2. 知识库模块
-- ===========================================

-- 知识库表
CREATE TABLE IF NOT EXISTS knowledge_bases (
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

-- 知识库权限表
CREATE TABLE IF NOT EXISTS kb_permissions (
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
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    kb_id BIGINT NOT NULL COMMENT '知识库ID',
    title VARCHAR(255) NOT NULL COMMENT '文档标题',
    file_name VARCHAR(255) NOT NULL COMMENT '原始文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '存储路径(MinIO)',
    file_type VARCHAR(20) NOT NULL COMMENT '文件类型',
    file_size BIGINT DEFAULT 0 COMMENT '文件大小(字节)',
    content_hash VARCHAR(64) COMMENT '内容哈希(SHA256)',
    text_content LONGTEXT COMMENT '提取的文本内容',
    metadata JSON COMMENT '元数据',
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
CREATE TABLE IF NOT EXISTS document_versions (
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

-- ===========================================
-- 3. 智能体模块
-- ===========================================

-- 智能体表
CREATE TABLE IF NOT EXISTS agents (
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

-- 智能体知识库关联表
CREATE TABLE IF NOT EXISTS agent_knowledge_bases (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL COMMENT '智能体ID',
    kb_id BIGINT NOT NULL COMMENT '知识库ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id) ON DELETE CASCADE,
    UNIQUE KEY uk_agent_kb (agent_id, kb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能体知识库关联表';

-- 智能体权限表
CREATE TABLE IF NOT EXISTS agent_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    agent_id BIGINT NOT NULL COMMENT '智能体ID',
    target_type ENUM('user', 'role', 'department') NOT NULL COMMENT '目标类型',
    target_id BIGINT NOT NULL COMMENT '目标ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
    UNIQUE KEY uk_agent_target (agent_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='智能体权限表';

-- 对话表
CREATE TABLE IF NOT EXISTS conversations (
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
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL COMMENT '对话ID',
    role ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
    content TEXT NOT NULL COMMENT '消息内容',
    tokens INT DEFAULT 0 COMMENT 'token数量',
    `references` JSON COMMENT '引用的文档列表',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- ===========================================
-- 4. 培训考试模块
-- ===========================================

-- 培训场景表
CREATE TABLE IF NOT EXISTS training_scenes (
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
CREATE TABLE IF NOT EXISTS questions (
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
CREATE TABLE IF NOT EXISTS exams (
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
CREATE TABLE IF NOT EXISTS exam_records (
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
CREATE TABLE IF NOT EXISTS certificates (
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

-- ===========================================
-- 5. 系统模块
-- ===========================================

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
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
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    description VARCHAR(255) COMMENT '描述',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- ===========================================
-- 6. 初始数据
-- ===========================================

-- 插入默认角色
INSERT INTO roles (name, code, description, permissions) VALUES
('超级管理员', 'admin', '系统超级管理员，拥有所有权限', '["*"]'),
('知识管理员', 'kb_admin', '知识库管理员，管理知识库和文档', '["kb:*", "doc:*"]'),
('培训管理员', 'train_admin', '培训管理员，管理培训和考试', '["train:*", "exam:*"]'),
('普通用户', 'user', '普通用户，可查看知识库和参与培训', '["kb:read", "agent:use", "train:take"]');

-- 插入默认管理员 (密码: admin123)
INSERT INTO users (username, password, real_name, role_id, status) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X3Qnq1Y/PSp3b.Kqa', '系统管理员', 1, 1);

-- 插入默认部门
INSERT INTO departments (name, sort_order) VALUES
('总公司', 0);

INSERT INTO departments (name, parent_id, sort_order) VALUES
('研发部', 1, 1),
('生产部', 1, 2),
('IT部', 1, 3),
('人力资源部', 1, 4);

-- 插入默认知识库分类
INSERT INTO knowledge_bases (name, description, level, domain, sort_order) VALUES
('通用知识库', '全员可访问的通用知识', 1, NULL, 1),
('研发知识库', '研发相关技术文档', 1, 'research', 2),
('生产知识库', '生产工艺和设备文档', 1, 'production', 3),
('IT知识库', 'IT系统使用和运维文档', 1, 'it', 4);

-- 插入默认培训场景
INSERT INTO training_scenes (name, description, sort_order) VALUES
('新员工入职培训', '新员工入职必修培训课程', 1),
('安全生产培训', '安全生产相关培训课程', 2),
('质量管理培训', '质量管理体系培训课程', 3);

-- 插入默认智能体
INSERT INTO agents (name, description, system_prompt, status) VALUES
('通用助手', '全能型知识问答助手', '你是新核芯科技的AI助手，帮助员工解答各类问题。请基于提供的知识库内容回答问题，如果无法从知识库中找到答案，请如实告知。', 1),
('工艺专家', '生产工艺专业问答助手', '你是半导体生产工艺专家，帮助员工解答生产工艺相关问题。请基于提供的工艺文档回答问题，注意提供准确的参数和步骤。', 1),
('IT帮助台', 'IT系统使用问答助手', '你是IT帮助台助手，帮助员工解决IT系统使用问题。请基于IT知识库提供操作指导和故障排查建议。', 1);

COMMIT;
