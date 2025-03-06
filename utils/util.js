/*
 * @Author: zi.yang
 * @Date: 2025-03-06 11:16:26
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 14:02:36
 * @Description: 
 * @FilePath: /runner/utils/util.js
 */
import { fileURLToPath } from 'node:url';
import fs from 'node:fs'
import path from 'node:path';

export function getFileList(path) {
  const fileList = fs.readdirSync(path, { encoding: 'utf-8', withFileTypes: true, recursive: true })
  return fileList.filter(file => file.isFile())
}

export function getProjectRoot() {
  const __filename = fileURLToPath(import.meta.url);
  return path.join(path.dirname(__filename), '..'); // 根据文件位置调整层级
}