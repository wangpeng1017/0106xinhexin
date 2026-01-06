"""
@file models/__init__.py
@desc ORM 模型导出
"""
from .user import User, Department, Role
from .knowledge import KnowledgeBase, KbPermission, Document, DocumentVersion
from .agent import Agent, AgentKnowledgeBase, AgentPermission, Conversation, Message
from .training import TrainingScene, Question, Exam, ExamRecord, Certificate
from .system import AuditLog, SystemConfig

__all__ = [
    # 用户模块
    "User", "Department", "Role",
    # 知识库模块
    "KnowledgeBase", "KbPermission", "Document", "DocumentVersion",
    # 智能体模块
    "Agent", "AgentKnowledgeBase", "AgentPermission", "Conversation", "Message",
    # 培训模块
    "TrainingScene", "Question", "Exam", "ExamRecord", "Certificate",
    # 系统模块
    "AuditLog", "SystemConfig",
]
