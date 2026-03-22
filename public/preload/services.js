/**
 * 预加载脚本 - Node.js 服务注入模块
 * 通过 window 对象向渲染进程注入 Node.js 能力
 * 提供 文件操作、Shell 执行、备份管理等功能
 */
const fs = require('node:fs')
const path = require('node:path')
const { exec } = require('node:child_process')
const { shell } = require('electron')

window.services = {
  /**
   * 同步读取文件内容
   * @param {string} file - 文件路径
   * @returns {string} 文件内容（UTF-8 编码）
   */
  readFile (file) {
    return fs.readFileSync(file, { encoding: 'utf-8' })
  },

  /**
   * 将文本写入到系统下载目录
   * @param {string} text - 要写入的文本内容
   * @returns {string} 写入的文件路径
   */
  writeTextFile (text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },

  /**
   * 将 Base64 图片写入到系统下载目录
   * @param {string} base64Url - Base64 格式的图片 URL（data:image/xxx;base64,...）
   * @returns {string|undefined} 写入的文件路径，格式无效时返回 undefined
   */
  writeImageFile (base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
    if (!matchs) return
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' })
    return filePath
  },

  /**
   * 打开文件或文件夹
   * 支持多行路径，每行一个路径
   * @param {string} paths - 文件/文件夹路径，多个路径用换行符分隔
   */
  openPath (paths) {
    if (!paths) return
    const pathList = paths.split('\n').filter(v => v.trim())
    pathList.forEach(v => {
      shell.openPath(v.trim())
    })
  },

  /**
   * 执行 Shell 脚本命令
   * @param {string} command - 要执行的 Shell 命令
   */
  execShell (command) {
    exec(command, { shell: true }, (error, stdout, stderr) => {
      if (error) {
        console.error('执行脚本失败:', error)
      }
      if (stdout) {
        console.log('脚本输出:', stdout)
      }
      if (stderr) {
        console.error('脚本错误:', stderr)
      }
    })
  },

  /**
   * 执行 Shell 脚本并传入参数
   * 参数会追加到命令末尾
   * @param {Array<string>} messageList - Shell 命令列表
   * @param {string} payload - 要传入的参数
   */
  execShellWithArgs (messageList, payload) {
    if (!messageList || messageList.length === 0) return
    messageList.forEach(cmd => {
      if (cmd.trim()) {
        const fullCommand = payload ? `${cmd.trim()} ${payload}` : cmd.trim()
        exec(fullCommand, { shell: true }, (error, stdout, stderr) => {
          if (error) {
            console.error('执行脚本失败:', error)
          }
          if (stdout) {
            console.log('脚本输出:', stdout)
          }
          if (stderr) {
            console.error('脚本错误:', stderr)
          }
        })
      }
    })
  },

  /**
   * 检查路径是否存在
   * @param {string} dirPath - 要检查的路径
   * @returns {boolean} 路径存在返回 true
   */
  checkPathExists (dirPath) {
    return fs.existsSync(dirPath)
  },

  /**
   * 创建目录（支持递归创建）
   * @param {string} dirPath - 要创建的目录路径
   * @returns {boolean} 始终返回 true
   */
  createDirectory (dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return true
  },

  /**
   * 写入备份文件
   * @param {string} dirPath - 目标目录路径
   * @param {string} fileName - 文件名
   * @param {string} content - 文件内容
   * @returns {string} 写入的文件完整路径
   */
  writeBackupFile (dirPath, fileName, content) {
    const filePath = path.join(dirPath, fileName)
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' })
    return filePath
  },

  /**
   * 读取备份文件列表
   * 只读取以 backup- 开头且 .json 结尾的文件
   * @param {string} dirPath - 备份目录路径
   * @returns {Array<{basename: string, filename: string, lastmod: string}>} 
   *          备份文件列表，按修改时间倒序排列
   */
  readBackupFileList (dirPath) {
    if (!fs.existsSync(dirPath)) return []
    const files = fs.readdirSync(dirPath)
    return files
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)
        return {
          basename: file,
          filename: filePath,
          lastmod: stat.mtime.toISOString()
        }
      })
      .sort((a, b) => new Date(b.lastmod) - new Date(a.lastmod))
  },

  /**
   * 读取备份文件内容
   * @param {string} filePath - 备份文件路径
   * @returns {string} 文件内容（UTF-8 编码）
   */
  readBackupFile (filePath) {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
  }
}
