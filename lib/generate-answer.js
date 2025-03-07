/*
 * @Author: zi.yang
 * @Date: 2025-03-04 22:01:02
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-07 09:11:58
 * @Description: 使用 DeepSeek API 生成面试题解析答案
 * @FilePath: /runner/lib/generate-answer.js
 */
import fs from 'node:fs';
import OpenAI from "openai";
import fm from 'front-matter';
import yaml from 'js-yaml';
import path from 'node:path';
import { applyFixes } from "markdownlint";
import { lint as lintSync } from "markdownlint/sync";
const openai = new OpenAI({ baseURL: process.env.OPEN_AI_API_URL, apiKey: process.env.OPEN_AI_API_KEY });

const systemPrompt = `
# 前端面试题解析助手指令

**角色设定**：你是一名资深前端面试官，具备10年一线开发经验，熟悉JavaScript核心技术、主流框架原理及性能优化方案。请用面试官的思维逆向拆解问题考点，输出符合以下结构的解析：

## 回答要求

1. ​**考察点分析**​（100-200字）
   - 从面试官视角拆解题目意图，指出该题考核的【核心能力维度】（如JS原理/框架机制/工程化思维等）
   - 列举3-5个具体技术评估点（例：事件循环机制、作用域链理解、DOM渲染优化等）

2. **参考答案**
   - 使用清晰明了且专业的语言回答面试题，但是避免教科书式回答
   - 结合技术解析，给出面试题参考答案
   - 参考答案中提及的技术点，需与技术解析部分一一对应

3. ​**技术解析**​（300-500字）
   - ​**关键知识点**：按优先级列出相关技术栈（如：Event Loop > 作用域链 > 闭包）
   - ​**原理剖析**：用专业术语解释底层机制，必要时配合流程图/伪代码
   - ​**常见误区**：列举候选人高频错误（如变量提升误解、微任务执行顺序混淆）

4. ​**解决方案**
   - ​**编码示例**：提供ES6+规范代码，要求：
     - 关键逻辑添加中文注释
     - 包含边界条件处理
     - 复杂度优化说明（时间/空间复杂度）
   - ​**可扩展性建议**：说明如何适配不同场景（如大流量、低端设备）

5. ​**深度追问**​（2-3个衍生问题）
   - 预测面试官可能追问的方向（例如："如何用Performance API监控执行耗时？"）
   - 每个追问附带20字内简要回答提示

## 格式规范

1. 使用二级标题划分模块，三级标题突出重点
2. 技术术语中英文对照（如：调用栈 Call Stack）
3. 代码块标注语言类型（示例：\`\`\`javascript）
4. 对复杂机制提供现实场景类比（例如："微任务队列类似VIP通道"）
5. 使用段落而非列表描述原理（例如："微任务队列的工作机制是..."）
6. 仅输出核心解析内容，不包含兜底话术（如："以上就是我对这个问题的理解"）

请严格遵循上述框架，用专业但易于理解的方式输出解析，避免教科书式说教，侧重体现候选人的技术判断力。
`

async function aiResponse(question, description) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `问题：${question}\n题目描述：${description}` },
    ],
    model: process.env.OPEN_AI_MODEL,
    stream: false
  });
  return completion.choices[0].message.content;
}


function readFiles(url) {
  const fileList = fs.readdirSync(url, { encoding: 'utf8', withFileTypes: true, recursive: true })
  return fileList.filter(dirent => {
    return dirent.isFile() && !['example.md', '_index.md'].includes(dirent.name) && dirent.name.endsWith('.md')
  })
}

/**
 * 主函数，用于处理给定URL的面试题
 *
 * @param url 目标URL, 例： engineering/npm
 * @returns 无返回值
 */
async function main(url) {
  if (!url) {
    console.error('请提供正确的URL, 例如：engineering/npm');
    return;
  }
  const fullPath = path.join(process.env.PROJECT_BASE_PATH, 'content/docs', url)
  const fileList = readFiles(fullPath);
  for (const dirent of fileList) {
    try {
      const content = fs.readFileSync(`${dirent.parentPath}/${dirent.name}`, 'utf8');
      const { attributes, body } = fm(content);
      if (body.length > 20) continue;
      const response = await aiResponse(attributes.title, attributes.description);
      // 使用 markdownlint 检查并修正markdown格式
      const results = lintSync({ "strings": { "content": response } });
      const fixedResult = applyFixes(response, results.content);
      // yaml
      const yamlMetadata = yaml.dump(attributes).trim();
      const result = `---\n${yamlMetadata}\n---\n\n${fixedResult}`;
      fs.writeFileSync(`${dirent.parentPath}/${dirent.name}`, result);
      console.log(`${dirent.parentPath}/${dirent.name} 已更新`);
    } catch (e) {
      console.error(`${dirent.parentPath}/${dirent.name} 更新失败: ${e}`);
    }
  }
}

export default main