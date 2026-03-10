# 阿里云服务器部署指南

## 📋 服务器信息
- **IP**: 8.152.215.190
- **系统**: Ubuntu 22.04
- **域名**: ryanssuit.com

---

## 🚀 快速部署（5分钟）

### 步骤 1: 登录服务器

```bash
ssh root@8.152.215.190
# 或
ssh ubuntu@8.152.215.190
```

### 步骤 2: 下载并运行部署脚本

```bash
# 下载脚本
curl -o deploy.sh https://raw.githubusercontent.com/RyanMeg123/yao-gua/main/deploy-aliyun.sh
chmod +x deploy.sh

# 运行部署
./deploy.sh
```

脚本会：
1. 检查并安装 Docker
2. 拉取最新镜像
3. 提示输入 OpenRouter API Key
4. 启动容器

### 步骤 3: 配置安全组

阿里云控制台 → ECS → 安全组 → 配置规则：

| 类型 | 端口 | 授权对象 |
|------|------|----------|
| 入方向 | 3000 | 0.0.0.0/0 |
| 入方向 | 80 | 0.0.0.0/0 |
| 入方向 | 443 | 0.0.0.0/0 |

### 步骤 4: 访问网站

```
http://8.152.215.190:3000
```

---

## 🌐 配置域名 + HTTPS（推荐）

### 步骤 1: 域名实名认证

阿里云控制台 → 域名 → ryanssuit.com → 实名认证

**注意**: 域名未实名认证无法解析！

### 步骤 2: 添加 DNS 解析

阿里云控制台 → 域名 → DNS 管理：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| A | @ | 8.152.215.190 |
| A | www | 8.152.215.190 |

### 步骤 3: 安装 Nginx 和 Certbot

```bash
# 安装 Nginx
sudo apt update
sudo apt install -y nginx

# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 步骤 4: 配置 Nginx

```bash
# 下载配置文件
sudo curl -o /etc/nginx/sites-available/yao-gua https://raw.githubusercontent.com/RyanMeg123/yao-gua/main/nginx.conf

# 启用配置
sudo ln -s /etc/nginx/sites-available/yao-gua /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 步骤 5: 申请 SSL 证书

```bash
sudo certbot --nginx -d ryanssuit.com -d www.ryanssuit.com

# 按提示操作：
# 1. 输入邮箱
# 2. 同意条款
# 3. 选择是否订阅邮件
```

### 步骤 6: 访问

```
https://ryanssuit.com
```

---

## 🔄 更新部署

当代码更新后，重新部署：

```bash
# 拉取最新镜像并重启
docker pull megryan/yao-gua:latest
docker stop yao-gua-app
docker rm yao-gua-app
./deploy.sh
```

---

## 📊 常用命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs -f yao-gua-app

# 停止服务
docker stop yao-gua-app

# 重启服务
docker restart yao-gua-app

# 进入容器
docker exec -it yao-gua-app /bin/sh

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/yao-gua-error.log
```

---

## 🐛 故障排查

### 1. 无法访问网站

```bash
# 检查容器是否运行
docker ps

# 检查端口监听
netstat -tlnp | grep 3000

# 检查防火墙
sudo ufw status

# 检查安全组（阿里云控制台）
```

### 2. SSL 证书问题

```bash
# 重新申请证书
sudo certbot --nginx -d ryanssuit.com

# 强制续期
sudo certbot renew --force-renewal
```

### 3. 域名解析问题

```bash
# 检查解析
nslookup ryanssuit.com

# 检查 DNS 缓存
sudo systemd-resolve --flush-caches
```

---

## 📞 需要帮助？

查看 GitHub Issues：
https://github.com/RyanMeg123/yao-gua/issues
