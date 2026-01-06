"""
@file models/user.py
@desc 用户与权限模块 ORM 模型
@see TECH: docs/TECH.md#1.1-用户与权限模块
"""
from sqlalchemy import Column, BigInteger, String, Text, Integer, SmallInteger, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Department(Base):
    """部门表"""
    __tablename__ = "departments"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="部门名称")
    parent_id = Column(BigInteger, ForeignKey("departments.id", ondelete="SET NULL"), comment="上级部门ID")
    sort_order = Column(Integer, default=0, comment="排序")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    parent = relationship("Department", remote_side=[id], backref="children")
    users = relationship("User", back_populates="department")


class Role(Base):
    """角色表"""
    __tablename__ = "roles"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False, comment="角色名称")
    code = Column(String(50), nullable=False, unique=True, comment="角色编码")
    description = Column(String(255), comment="角色描述")
    permissions = Column(JSON, comment="权限列表")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    users = relationship("User", back_populates="role")


class User(Base):
    """用户表"""
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True, comment="用户名")
    password = Column(String(255), nullable=False, comment="密码(bcrypt)")
    real_name = Column(String(50), comment="真实姓名")
    email = Column(String(100), comment="邮箱")
    phone = Column(String(20), comment="手机号")
    avatar = Column(String(255), comment="头像URL")
    department_id = Column(BigInteger, ForeignKey("departments.id", ondelete="SET NULL"), comment="部门ID")
    role_id = Column(BigInteger, ForeignKey("roles.id", ondelete="SET NULL"), comment="角色ID")
    dingtalk_user_id = Column(String(100), comment="钉钉用户ID")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    last_login_at = Column(DateTime, comment="最后登录时间")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    department = relationship("Department", back_populates="users")
    role = relationship("Role", back_populates="users")
    conversations = relationship("Conversation", back_populates="user")
    exam_records = relationship("ExamRecord", back_populates="user")
