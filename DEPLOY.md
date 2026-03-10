# 部署指南

## 方式一：GitHub Actions 自动部署

### 1. 配置 Secrets

在 GitHub 仓库页面：
`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

需要添加以下 Secrets：

| Secret Name | 说明 | 示例 |
|------------|------|------|
| `SSH_PRIVATE_KEY` | 服务器私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST` | 服务器IP或域名 | `192.168.1.100` 或 `yourdomain.com` |
| `SERVER_USER` | 服务器用户名 | `root` 或 `ubuntu` |
| `DEPLOY_PATH` | 服务器部署路径 | `/var/www/yao-gua` |

### 2. 获取服务器私钥

在本地终端执行：
```bash
# 如果还没有 SSH 密钥，先生成
cat ~/.ssh/id_rsa

# 复制输出的内容（包括 BEGIN 和 END 行）
```

### 3. 自动部署流程

每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 运行测试和构建
2. 将构建文件部署到服务器

---

## 方式二：Docker 部署

### 本地构建运行

```bash
# 构建 Docker 镜像
docker build -t yao-gua .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e OPENROUTER_API_KEY=你的APIKey \
  -v $(pwd)/divination.db:/app/divination.db \
  --name yao-gua \
  yao-gua
```

### Docker Hub 自动推送

配置以下 Secrets 后，每次推送会自动构建并推送镜像：
- `DOCKER_USERNAME`: Docker Hub 用户名
- `DOCKER_PASSWORD`: Docker Hub 密码或 Access Token

---

## 方式三：手动部署到服务器

```bash
# 1. 在服务器上克隆仓库
git clone https://github.com/RyanMeg123/yao-gua.git
cd yao-gua

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 OPENROUTER_API_KEY

# 3. 安装依赖
npm install

# 4. 构建并运行
npm run build
npm start

# 或使用 PM2 守护进程
npm install -g pm2
pm2 start npm --name "yao-gua" -- start
```

---

## 方式四：Cloudflare Pages / Vercel (前端静态部署)

如果只需要部署前端静态页面：

```bash
# 构建静态文件
npm run build

# dist/ 目录包含静态文件，可上传到任何静态托管服务
```

注意：这种方式需要单独部署后端 API。

---

## 健康检查

部署完成后，访问以下地址检查状态：
- `http://your-domain/` - 首页
- `http://your-domain/health` - 健康检查接口

---

## 故障排查

### 部署失败
1. 检查 GitHub Actions 日志
2. 确认 Secrets 配置正确
3. 检查服务器防火墙是否开放 3000 端口

### 环境变量不生效
1. 确认 `.env` 文件已上传到服务器（注意：生产环境建议使用环境变量而非 .env 文件）
2. 检查 Docker 运行时的 `-e` 参数

### 数据库权限问题
```bash
# 修复数据库权限
chmod 666 divination.db
```
