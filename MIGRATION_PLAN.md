# Next.js + Prisma + Postgres 迁移方案

## 架构变更

### 当前架构
- Express + Vite React + SQLite
- 本地开发服务器

### 目标架构
- Next.js 14 App Router
- Prisma ORM
- Postgres (Supabase/Neon)
- Vercel 部署

## 迁移步骤

1. 创建 Next.js 项目结构
2. 配置 Prisma 和数据库模型
3. 迁移 API 路由到 Route Handlers
4. 迁移前端组件到 App Router
5. 保持样式和交互不变

## 文件映射

| 原文件 | 新位置 | 说明 |
|--------|--------|------|
| server.ts | app/api/**/route.ts | API 路由迁移 |
| src/App.tsx | app/page.tsx | 主页面 |
| src/components/*.tsx | app/components/*.tsx | 组件迁移 |
| src/types.ts | app/types/index.ts | 类型定义 |
| SQLite | Prisma + Postgres | 数据库迁移 |

## 数据库 Schema (Prisma)

```prisma
model History {
  id            Int      @id @default(autoincrement())
  time          String
  question      String
  age           String
  gender        String
  tosses        Json     // 存储六爻结果数组
  interpretation String  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@map("history")
}
```

## API 路由映射

| 原路由 | 新路由 | 方法 |
|--------|--------|------|
| POST /api/divine | app/api/divine/route.ts | POST |
| GET /api/history | app/api/history/route.ts | GET |
| POST /api/history | app/api/history/route.ts | POST |
| DELETE /api/history/:id | app/api/history/[id]/route.ts | DELETE |

## 环境变量

```env
# Database
DATABASE_URL="postgresql://postgres:password@host:5432/dbname?schema=public"

# AI API
OPENROUTER_API_KEY="sk-or-v1-xxx"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
