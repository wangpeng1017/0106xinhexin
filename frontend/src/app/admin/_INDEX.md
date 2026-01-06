# frontend/src/app/admin 架构说明

管理后台页面目录，包含所有管理员功能页面
⚠️ 文件夹变化时请更新此文件

## 文件清单

| 文件/目录 | 地位 | 功能 |
|----------|------|------|
| page.tsx | 核心 | 控制台首页，数据大屏展示 |
| layout.tsx | 核心 | 管理后台布局（侧边栏+顶部导航） |
| knowledge/ | 模块 | 知识库管理页面 |
| agents/ | 模块 | 智能体管理页面 |
| training/ | 模块 | 培训考试模块（子页面） |
| system/ | 模块 | 系统管理模块（用户/角色/部门/日志） |
| profile/ | 功能 | 个人中心页面 |

## 路由结构

```
/admin                    # 控制台首页
/admin/knowledge          # 知识库管理
/admin/agents             # 智能体管理
/admin/training           # 培训概览
/admin/training/scenes    # 培训场景
/admin/training/questions # 题库管理
/admin/training/exams     # 试卷管理
/admin/training/records   # 考试记录
/admin/system/users       # 用户管理
/admin/system/roles       # 角色管理
/admin/system/departments # 部门管理
/admin/system/logs        # 操作日志
/admin/profile            # 个人中心
```
