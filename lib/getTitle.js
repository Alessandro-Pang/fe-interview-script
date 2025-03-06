/*
 * @Author: zi.yang
 * @Date: 2025-03-05 20:03:56
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 14:25:38
 * @Description: 
 * @FilePath: /runner/lib/getTitle.js
 */

import fs from 'node:fs';
import { getProjectRoot } from '../utils/util.js'

function getFileList(path) {
  const fileList = fs.readdirSync(path, { encoding: 'utf-8', withFileTypes: true, recursive: true })
  return fileList.filter(file => file.isFile() && file.name.endsWith('.md'))
}

function getMarkdownTitle(filePath, level) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n')
  const reg = new RegExp(`^${'#'.repeat(level)}\\s+(.*)`)
  return lines.map((line) => line.match(reg)?.[1]).filter(Boolean)
}

/**
 * 获取指定路径下所有Markdown文件的标题
 *
 * @param path 项目基础路径，默认为环境变量PROJECT_BASE_PATH的值
 * @param level 标题级别，默认为1
 * @param output 输出方式，默认为0（控制台输出）, 1为写入文件
 */
function main(path = process.env.PROJECT_BASE_PATH, level = 1, output = 0) {
  const titles = []
  getFileList(path).forEach(file => {
    const title = getMarkdownTitle(`${file.parentPath}/${file.name}`, level)
    titles.push(title)
  })
  if (output === 1 || output === '1') {
    const projectRoot = getProjectRoot()
    const outputPath = `${projectRoot}/output`
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }
    fs.writeFileSync(`${outputPath}/titles.json`, JSON.stringify(titles))
    console.log('写入成功: /output/titles.json')
  } else {
    console.log(titles)
  }
}

export default main