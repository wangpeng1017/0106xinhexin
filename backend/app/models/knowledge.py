"""
@file models/knowledge.py
@desc 知识库模块 ORM 模型
@see TECH: docs/TECH.md#1.2-知识库模块
"""
from sqlalchemy import Column, BigInteger, String, Text, Integer, SmallInteger, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class KnowledgeBase(Base):
    """知识库表"""
    __tablename__ = "knowledge_bases"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="知识库名称")
    description = Column(Text, comment="描述")
    icon = Column(String(50), comment="图标")
    color = Column(String(20), comment="颜色")
    parent_id = Column(BigInteger, ForeignKey("knowledge_bases.id", ondelete="CASCADE"), comment="上级知识库ID")
    level = Column(SmallInteger, default=1, comment="层级: 1通用 2运营 3涉密")
    domain = Column(String(50), comment="领域: research/it/production")
    access_level = Column(SmallInteger, default=1, comment="访问级别: 1公开 2部门 3指定")
    sort_order = Column(Integer, default=0, comment="排序")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    parent = relationship("KnowledgeBase", remote_side=[id], backref="children")
    documents = relationship("Document", back_populates="knowledge_base")
    permissions = relationship("KbPermission", back_populates="knowledge_base")


class KbPermission(Base):
    """知识库权限表"""
    __tablename__ = "kb_permissions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    kb_id = Column(BigInteger, ForeignKey("knowledge_bases.id", ondelete="CASCADE"), nullable=False, comment="知识库ID")
    target_type = Column(Enum("user", "role", "department"), nullable=False, comment="目标类型")
    target_id = Column(BigInteger, nullable=False, comment="目标ID")
    permission = Column(Enum("read", "write", "admin"), default="read", comment="权限")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    knowledge_base = relationship("KnowledgeBase", back_populates="permissions")


class Document(Base):
    """文档表"""
    __tablename__ = "documents"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    kb_id = Column(BigInteger, ForeignKey("knowledge_bases.id", ondelete="CASCADE"), nullable=False, comment="知识库ID")
    title = Column(String(255), nullable=False, comment="文档标题")
    file_name = Column(String(255), nullable=False, comment="原始文件名")
    file_path = Column(String(500), nullable=False, comment="存储路径(MinIO)")
    file_type = Column(String(20), nullable=False, comment="文件类型")
    file_size = Column(BigInteger, default=0, comment="文件大小(字节)")
    content_hash = Column(String(64), comment="内容哈希(SHA256)")
    text_content = Column(Text, comment="提取的文本内容")
    metadata = Column(JSON, comment="元数据")
    vector_status = Column(SmallInteger, default=0, comment="向量化状态: 0待处理 1处理中 2完成 3失败")
    vector_id = Column(String(100), comment="Milvus向量ID")
    version = Column(Integer, default=1, comment="版本号")
    status = Column(SmallInteger, default=1, comment="状态: 1正常 0删除")
    uploaded_by = Column(BigInteger, comment="上传人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    knowledge_base = relationship("KnowledgeBase", back_populates="documents")
    versions = relationship("DocumentVersion", back_populates="document")


class DocumentVersion(Base):
    """文档版本历史表"""
    __tablename__ = "document_versions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    document_id = Column(BigInteger, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, comment="文档ID")
    version = Column(Integer, nullable=False, comment="版本号")
    file_path = Column(String(500), nullable=False, comment="存储路径")
    file_size = Column(BigInteger, default=0, comment="文件大小")
    content_hash = Column(String(64), comment="内容哈希")
    change_note = Column(String(255), comment="变更说明")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    document = relationship("Document", back_populates="versions")
