# 爻卦测算 - Next.js 版本

基于 Next.js 14 + Prisma + PostgreSQL 的爻卦测算应用。

## 架构

- **框架**: Next.js 14 App Router
- **数据库**: PostgreSQL (Prisma ORM)
- **样式**: Tailwind CSS
- **部署**: Vercel

## 本地开发

### 1. 安装依赖

```bash
cd nextjs-app
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/yao_gua?schema=public"
OPENROUTER_API_KEY="sk-or-v1-xxx"
```

### 3. 初始化数据库

```bash
npx prisma db push
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git add nextjs-app
git commit -m "Add Next.js version"
git push origin main
```

### 2. Vercel 部署

1. 登录 https://vercel.com
2. Import GitHub 仓库
3. 配置环境变量:
   - `DATABASE_URL`: PostgreSQL 连接字符串
   - `OPENROUTER_API_KEY`: OpenRouter API Key
4. Deploy

### 3. 数据库配置

使用 **Supabase** 或 **Neon** 创建 PostgreSQL 数据库:

- Supabase: https://supabase.com
- Neon: https://neon.tech

获取连接字符串并配置到 Vercel 环境变量。

## 与原项目的区别

| 特性 | 原项目 (Express) | 新项目 (Next.js) |
|------|-----------------|-----------------|
| 架构 | Express + Vite | Next.js App Router |
| 数据库 | SQLite | PostgreSQL |
| ORM | 无 | Prisma |
| 部署 | Docker/手动 | Vercel |
| API | Express routes | Next.js Route Handlers |

## API 路由

- `POST /api/divine` - AI 解卦
- `GET /api/history` - 获取历史记录
- `POST /api/history` - 保存记录
- `DELETE /api/history/[id]` - 删除记录
