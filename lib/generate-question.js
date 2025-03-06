/*
 * @Author: zi.yang
 * @Date: 2025-03-04 09:42:36
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 14:52:13
 * @Description: 
 * @FilePath: /runner/lib/generate-question.js
 */
import fs from 'fs';
import { getProjectRoot } from '../utils/util.js';

const __dirname = getProjectRoot();

/**
 * 从指定路径读取文件并返回解析后的 JSON 数据列表
 *
 * @param {string} path - 文件路径，data 和 面试题目录需要保持一致，例：'engineering/npm'
 * @returns {Array} - 解析后的 JSON 数据列表
 */
function readFiles(path) {
  const fileList = fs.readdirSync(`${__dirname}/data/${path}`, { encoding: 'utf8', withFileTypes: true })
  return fileList.filter(dirent => dirent.isFile()).map(dirent => {
    const data = fs.readFileSync(`${__dirname}/data/${path}/${dirent.name}`, { encoding: 'utf8' })
    return JSON.parse(data)
  })
}

/**
 * 将文件内容写入指定路径
 *
 * @param fileList 文件列表，包含嵌套数组
 * @param basePath 基础路径
 */
function writeFileContent(fileList, basePath) {
  const data = fileList.flat(1);
  const type = basePath.split('/').at(-1)
  const baseURL = process.env.PROJECT_BASE_PATH

  for (let idx = 0; idx < data.length; idx++) {
    const item = data[idx]
    const date = new Date().toISOString()
    const description = item.description.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    const content = `
---
weight: ${1000 + 100 * (idx + 1)}
date: "${date}"
draft: false
author: "zi.Yang"
title: "${item.question}"
icon: "icon/npm.svg"
toc: true
description: "${description}"
tags: [${[type, ...item.tag].map(tag => `"${tag}"`).join(', ')}]
---

## 解答

待补充...

`
    fs.writeFileSync(`${baseURL}/content/docs/${basePath}/${type}-${(idx + 1).toString().padStart(2, 0)}.md`, content.trim() + '\n')
  }
}

/**
 * 主函数，用于处理指定路径下的文件
 *
 * @param {string} basePath - 要处理的文件路径
 */
function main(basePath) {
  const fileList = readFiles(basePath)
  writeFileContent(fileList, basePath)
}

export default main;