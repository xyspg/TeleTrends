# Telegram 聊天记录分析
## 功能
- 选择聊天对象
- 数据可视化，聊天趋势，统计等
- 高频词汇
- 聊天搜索（支持中文搜索，众所周知 tg 对于中文搜索的支持几乎没有）
## 本地使用
1. 克隆本仓库或下载ZIP文件
2. 安装Docker和Docker Compose
3. 在项目的根目录中构建镜像
```bash
docker-compose up --build
```
打开浏览器并访问 http://localhost:3000 

要停止服务，请按 Ctrl+C

运行 docker-compose up 以重新启动服务