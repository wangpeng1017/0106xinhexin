"""
@file models/system.py
@desc 系统模块 ORM 模型
@see TECH: docs/TECH.md#1.5-系统日志模块
"""
from sqlalchemy import Column, BigInteger, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from ..database import Base


class AuditLog(Base):
    """审计日志表"""
    __tablename__ = "audit_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, comment="用户ID")
    username = Column(String(50), comment="用户名")
    action = Column(String(50), nullable=False, comment="操作类型")
    target_type = Column(String(50), comment="目标类型")
    target_id = Column(BigInteger, comment="目标ID")
    detail = Column(JSON, comment="详情")
    ip = Column(String(50), comment="IP地址")
    user_agent = Column(String(255), comment="浏览器UA")
    created_at = Column(DateTime, server_default=func.now())


class SystemConfig(Base):
    """系统配置表"""
    __tablename__ = "system_configs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    config_key = Column(String(100), nullable=False, unique=True, comment="配置键")
    config_value = Column(Text, comment="配置值")
    description = Column(String(255), comment="描述")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
