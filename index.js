/*
 * @Author: zi.yang
 * @Date: 2025-03-06 11:10:50
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-03-06 14:48:57
 * @Description: 入口函数
 * @FilePath: /runner/index.js
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { getProjectRoot } from './utils/util.js';

dotenv.config({ path: ['.env.local', '.env'] })
const __dirname = getProjectRoot();

async function loadFunctions() {
  const libDir = path.join(__dirname, 'lib');
  const files = fs.readdirSync(libDir).filter(file => file.endsWith('.js'));

  const functions = {};

  for (const file of files) {
    const name = file.replace(/\.js$/, '');
    const modulePath = path.join(libDir, file);
    const module = await import(modulePath);
    functions[name] = module.default; // 获取默认导出的函数
  }

  return functions;
}

loadFunctions().then(async functions => {
  const args = process.argv.slice(2);

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const command = arg.slice(2);
      const func = functions[command];

      if (typeof func === 'function') {
        const args = process.argv.slice(3);
        await func(...args);
        process.exit(0);
      } else {
        console.error(`错误：未找到命令 "${command}"`);
      }
    }
  }

  // 如果没有提供有效参数
  console.error('用法：node index.js --<命令>');
  console.error('可用命令：', Object.keys(functions).join(', '));
  process.exit(1);
});