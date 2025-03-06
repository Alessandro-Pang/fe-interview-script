/*
 * @Author: zi.yang
 * @Date: 2025-03-06 08:03:15
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 13:48:14
 * @Description: 
 * @FilePath: /runner/lib/format-document.js
 */

import fs from 'node:fs';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import fm from 'front-matter';
import yaml from 'js-yaml';

function getFileList(path) {
  const fileList = fs.readdirSync(path, { encoding: 'utf-8', withFileTypes: true, recursive: true })
  return fileList.filter(file => {
    if (file.parentPath.includes('febobo')) return false
    return file.isFile() && file.name.endsWith('.md') && !['_index.md', 'example.md'].includes(file.name)
  })
}

function getFileContent(path) {
  return fs.readFileSync(path, 'utf-8')
}

function getFileTree(content) {
  return remark().use(remarkParse).parse(content)
}

function getFileTitle(tree) {
  let title = []
  visit(tree, 'heading', (node) => {
    if (node.depth === 2) {
      title.push(node.children[0].value)
    }
  })
  return title
}


function getFileContentWithTitle(tree) {
  let content = ''
  visit(tree, 'heading', (node) => {
    if (node.depth === 1) {
      content += node.children[0].value + '\n'
    } else if (node.depth === 2) {
      content += '# ' + node.children[0].value + '\n'
    }
  })
  return content
}

const titleList = ['考察点分析', '技术解析', '问题解答', '解决方案', '深度追问']
function main(path = process.env.PROJECT_BASE_PATH) {
  const fileList = getFileList(path)
  const diffList = []
  fileList.forEach(file => {
    const content = getFileContent(`${file.parentPath}/${file.name}`)
    const tree = getFileTree(content)
    const titles = getFileTitle(tree)
    for (let i = 0; i < titles.length; i++) {
      if (titles[i] !== titleList[i]) {
        diffList.push({ path: `${file.parentPath}/${file.name}`, title: titles })
        break;
      }
    }
  })
  fs.writeFileSync('diff.json', JSON.stringify(diffList))
}

export default main