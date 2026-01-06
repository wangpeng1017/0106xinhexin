"""
@file models/training.py
@desc 培训考试模块 ORM 模型
@see TECH: docs/TECH.md#1.4-培训考试模块
"""
from sqlalchemy import Column, BigInteger, String, Text, Integer, SmallInteger, DateTime, Date, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class TrainingScene(Base):
    """培训场景表"""
    __tablename__ = "training_scenes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, comment="场景名称")
    description = Column(Text, comment="描述")
    icon = Column(String(50), comment="图标")
    sort_order = Column(Integer, default=0, comment="排序")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    questions = relationship("Question", back_populates="scene")
    exams = relationship("Exam", back_populates="scene")
    certificates = relationship("Certificate", back_populates="scene")


class Question(Base):
    """题目表"""
    __tablename__ = "questions"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    scene_id = Column(BigInteger, ForeignKey("training_scenes.id", ondelete="CASCADE"), nullable=False, comment="场景ID")
    type = Column(Enum("single", "multiple", "judge", "fill"), nullable=False, comment="题型")
    content = Column(Text, nullable=False, comment="题目内容")
    options = Column(JSON, comment="选项(选择题)")
    answer = Column(Text, nullable=False, comment="答案")
    analysis = Column(Text, comment="解析")
    difficulty = Column(SmallInteger, default=2, comment="难度: 1简单 2中等 3困难")
    score = Column(Integer, default=1, comment="分值")
    tags = Column(JSON, comment="标签/知识点")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    scene = relationship("TrainingScene", back_populates="questions")


class Exam(Base):
    """试卷表"""
    __tablename__ = "exams"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    scene_id = Column(BigInteger, ForeignKey("training_scenes.id", ondelete="CASCADE"), nullable=False, comment="场景ID")
    title = Column(String(200), nullable=False, comment="试卷标题")
    description = Column(Text, comment="描述")
    duration = Column(Integer, default=60, comment="考试时长(分钟)")
    total_score = Column(Integer, default=100, comment="总分")
    pass_score = Column(Integer, default=60, comment="及格分")
    question_ids = Column(JSON, comment="题目ID列表")
    shuffle_questions = Column(SmallInteger, default=0, comment="是否打乱题目顺序")
    shuffle_options = Column(SmallInteger, default=0, comment="是否打乱选项顺序")
    show_answer = Column(SmallInteger, default=1, comment="交卷后是否显示答案")
    allow_retry = Column(SmallInteger, default=1, comment="是否允许重考")
    max_retry = Column(Integer, default=3, comment="最大重考次数")
    start_time = Column(DateTime, comment="开始时间")
    end_time = Column(DateTime, comment="结束时间")
    status = Column(SmallInteger, default=1, comment="状态: 1启用 0禁用")
    created_by = Column(BigInteger, comment="创建人")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    scene = relationship("TrainingScene", back_populates="exams")
    records = relationship("ExamRecord", back_populates="exam")


class ExamRecord(Base):
    """考试记录表"""
    __tablename__ = "exam_records"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    exam_id = Column(BigInteger, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False, comment="试卷ID")
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    score = Column(Integer, comment="得分")
    answers = Column(JSON, comment="用户答案")
    correct_count = Column(Integer, default=0, comment="正确题数")
    wrong_count = Column(Integer, default=0, comment="错误题数")
    start_time = Column(DateTime, comment="开始时间")
    submit_time = Column(DateTime, comment="提交时间")
    duration = Column(Integer, comment="实际用时(秒)")
    status = Column(SmallInteger, default=0, comment="状态: 0进行中 1已完成 2已放弃")
    retry_count = Column(Integer, default=0, comment="重考次数")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # 关系
    exam = relationship("Exam", back_populates="records")
    user = relationship("User", back_populates="exam_records")


class Certificate(Base):
    """证书表"""
    __tablename__ = "certificates"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, comment="用户ID")
    scene_id = Column(BigInteger, ForeignKey("training_scenes.id", ondelete="CASCADE"), nullable=False, comment="场景ID")
    exam_record_id = Column(BigInteger, comment="考试记录ID")
    cert_no = Column(String(50), nullable=False, unique=True, comment="证书编号")
    cert_name = Column(String(200), nullable=False, comment="证书名称")
    issue_date = Column(Date, nullable=False, comment="颁发日期")
    expire_date = Column(Date, comment="过期日期")
    cert_url = Column(String(500), comment="证书图片URL")
    created_at = Column(DateTime, server_default=func.now())

    # 关系
    scene = relationship("TrainingScene", back_populates="certificates")
