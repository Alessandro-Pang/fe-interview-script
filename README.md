# fe-interview-script

用于对前端面试题库进行批量生成以及 AI 回答

## 使用

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
