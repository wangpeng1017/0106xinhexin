"""
@file models/agent.py
@desc 智能体模块 ORM 模型
@see TECH: docs/TECH.md#1.3-智能体模块
"""
from sqlalchemy import Column, BigInteger, String, Text, Integer, SmallInteger, DateTime, ForeignKey, JSON, Enum, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Agent(Base):
    """智能体表"""
    __tablename__ = "agents"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="智能体名称")
    description = Column(Text, comment="描述")
    icon = Column(String(50), comment="图标")
    system_prompt = Column(Text, comment="系统提示词")
    model_name = Column(String(50), default="qwen2.5-7b", comment="模型名称")
    temperature = Column(DECIMAL(2, 1), default=0.7, comment="温度参数")
    max_tokens = Column(Integer, default=2048, comment="最大token数")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    knowledge_bases = relationship("AgentKnowledgeBase", back_populates="agent")
    permissions = relationship("AgentPermission", back_populates="agent")
    conversations = relationship("Conversation", back_populates="agent")


class AgentKnowledgeBase(Base):
    """智能体知识库关联表"""
    __tablename__ = "agent_knowledge_bases"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(BigInteger, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, comment="智能体ID")
    kb_id = Column(BigInteger, ForeignKey("knowledge_bases.id", ondelete="CASCADE"), nullable=False, comment="知识库ID")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    agent = relationship("Agent", back_populates="knowledge_bases")


class AgentPermission(Base):
    """智能体权限表"""
    __tablename__ = "agent_permissions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    agent_id = Column(BigInteger, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, comment="智能体ID")
    target_type = Column(Enum("user", "role", "department"), nullable=False, comment="目标类型")
    target_id = Column(BigInteger, nullable=False, comment="目标ID")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    agent = relationship("Agent", back_populates="permissions")


class Conversation(Base):
    """对话表"""
    __tablename__ = "conversations"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    agent_id = Column(BigInteger, ForeignKey("agents.id", ondelete="CASCADE"), nullable=False, comment="智能体ID")
    title = Column(String(100), comment="对话标题")
    status = Column(SmallInteger, default=1, comment="状态: 1进行中 0已结束")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    user = relationship("User", back_populates="conversations")
    agent = relationship("Agent", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")


class Message(Base):
    """消息表"""
    __tablename__ = "messages"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    conversation_id = Column(BigInteger, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, comment="对话ID")
    role = Column(Enum("user", "assistant", "system"), nullable=False, comment="角色")
    content = Column(Text, nullable=False, comment="消息内容")
    tokens = Column(Integer, default=0, comment="token数量")
    references = Column(JSON, comment="引用的文档列表")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    conversation = relationship("Conversation", back_populates="messages")
