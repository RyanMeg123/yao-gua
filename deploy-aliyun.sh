#!/bin/bash
# 爻卦测算APP - 阿里云部署脚本

set -e

echo "🚀 开始部署爻卦测算APP到阿里云服务器..."
echo "================================================"

# 配置
DOCKER_USERNAME="megryan"
IMAGE_NAME="yao-gua"
CONTAINER_NAME="yao-gua-app"
PORT="3000"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "📦 Docker 未安装，正在安装..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo "✅ Docker 安装完成，请重新登录后运行此脚本"
    exit 0
fi

echo "✅ Docker 已安装"

# 拉取最新镜像
echo ""
echo "📥 拉取最新镜像..."
docker pull $DOCKER_USERNAME/$IMAGE_NAME:latest

# 停止并删除旧容器（如果存在）
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "🛑 停止旧容器..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# 提示输入 API Key
echo ""
echo "🔑 请输入 OpenRouter API Key:"
read -s OPENROUTER_API_KEY
echo ""

# 运行新容器
echo ""
echo "🚀 启动容器..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    -e OPENROUTER_API_KEY=$OPENROUTER_API_KEY \
    --restart always \
    $DOCKER_USERNAME/$IMAGE_NAME:latest

# 检查运行状态
echo ""
echo "✅ 部署完成！检查状态..."
sleep 3
docker ps | grep $CONTAINER_NAME
docker logs --tail 20 $CONTAINER_NAME

echo ""
echo "================================================"
echo "🎉 部署成功！"
echo ""
echo "📱 访问地址:"
echo "   http://8.152.215.190:$PORT"
echo ""
echo "📋 常用命令:"
echo "   查看日志: docker logs -f $CONTAINER_NAME"
echo "   停止服务: docker stop $CONTAINER_NAME"
echo "   重启服务: docker restart $CONTAINER_NAME"
echo "   更新镜像: docker pull $DOCKER_USERNAME/$IMAGE_NAME:latest && ./deploy.sh"
echo ""
