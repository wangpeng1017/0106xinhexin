"""
@file main.py
@desc FastAPI 应用入口
@see PRD: docs/PRD.md
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化
    await init_db()
    yield
    # 关闭时清理


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="半导体企业知识库 + 智能体 + 培训考试一体化平台",
    lifespan=lifespan,
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境需要限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """根路径"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/health")
async def health():
    """健康检查"""
    return {"status": "ok"}


# 注册路由
# from .routers import auth, users, knowledge, agents, training
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
# app.include_router(users.router, prefix="/api/v1/users", tags=["用户管理"])
# app.include_router(knowledge.router, prefix="/api/v1", tags=["知识库"])
# app.include_router(agents.router, prefix="/api/v1", tags=["智能体"])
# app.include_router(training.router, prefix="/api/v1/training", tags=["培训考试"])
