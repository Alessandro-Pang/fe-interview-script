# fe-interview-script

用于对前端面试题库进行批量生成以及 AI 回答

## 使用

### 安装依赖

```bash
npm install
```

### 配置环境变量

在项目根目录下创建 `.env.local` 文件，并配置以下环境变量：

默认使用腾讯云大模型 API，如果要使用其他大模型 API，请修改 `.env.local` 文件中的 `OPEN_AI_API_URL` 和 `OPEN_AI_MODEL` 变量。

```conf
# 前端面试仓库本地路径
PROJECT_BASE_PATH = ''

# 大模型 api url 默认腾讯云大模型 API
OPEN_AI_API_URL = 'https://api.lkeap.cloud.tencent.com/v1'

# 大模型 api key
OPEN_AI_API_KEY = ''

# 设置模型，默认 腾讯云[DeepSeek-R1]
OPEN_AI_MODEL = 'deepseek-r1'
```

### 使用命令行工具

```bash
node index --<command> <options>

示例：
node index --generate-answer javascript
```

## 目录结构

```text
├── lib
│   ├── format-document.js ----------------------- 格式化文档
│   ├── generate-answer.js ----------------------- AI 生成答案
│   ├── generate-question.js --------------------- 生成题目
│   ├── getTitle.js ------------------------------ 获取题目标题
│   └── resort.js -------------------------------- 重新排序题目
```
