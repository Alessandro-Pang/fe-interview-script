/*
 * @Author: zi.yang
 * @Date: 2025-03-06 08:40:52
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 14:34:00
 * @Description: 重新排序脚本，用于更新文章的排序权重
 * @FilePath: /runner/lib/resort.js
 */
import fs from 'node:fs'
import fm from 'front-matter';
import yaml from 'js-yaml';

function getFileList(path) {
  const fileList = fs.readdirSync(path, { encoding: 'utf-8', withFileTypes: true, recursive: true })
  return fileList.filter(file => {
    if (file.parentPath.includes('febobo')) return false
    return file.isFile() && file.name.endsWith('.md') && !['example.md', '_index.md'].includes(file.name)
  })
}

const sortDir = ['html', 'css', 'javascript', 'vue2', 'vue3', 'react', 'typescript', 'npm', 'webpack', 'vite', 'network']

const dictMap = {}

const errorList = []
function getSortedFileList(fileList) {
  const sortedFileList = fileList.map((file) => {
    try {
      const dirSortNum = sortDir.findIndex((item) => file.parentPath.includes(`/${item}`))
      const content = fs.readFileSync(`${file.path}/${file.name}`, 'utf-8')
      const matter = fm(content)
      dictMap[dirSortNum] = (dictMap[dirSortNum] || 0) + 1
      const sort = dictMap[dirSortNum] * 1000 + (+`${dirSortNum + 1}000000`);
      matter.attributes.weight = sort;
      return { file, matter, sort }
    } catch (error) {
      console.error(`${file.path}/${file.name} 读取失败`)
      errorList.push(`${file.path}/${file.name} 读取失败`)
    }
  }).filter(Boolean)
  return sortedFileList
}

/**
 * 主函数，用于处理指定路径下的文件列表
 *
 * @param path 指定处理的路径
 */
function main(path) {
  const fileList = getFileList(path || process.env.PROJECT_BASE_PATH + '/content')
  const sortedFileList = getSortedFileList(fileList)
  sortedFileList.forEach(sf => {
    try {
      const yamlMetadata = yaml.dump(sf.matter.attributes);
      const result = `---\n${yamlMetadata}---\n\n${sf.matter.body}`;
      fs.writeFileSync(`${sf.file.path}/${sf.file.name}`, result)
      console.log(`${sf.file.path}/${sf.file.name} 已更新`)
    } catch (error) {
      console.error(`${sf.file.path}/${sf.file.name} 更新失败`)
      errorList.push(`${sf.file.path}/${sf.file.name} 更新失败`)
    }
  });

  console.log(`\n${'-'.repeat(20)}\n所有文件更新完成\n${'-'.repeat(20)}\n错误列表：`, errorList.join('\n'));
}

export default main