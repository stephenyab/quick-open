const fs = require('node:fs')
const path = require('node:path')
const { exec } = require('node:child_process')
const { shell } = require('electron')

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 读文件
  readFile (file) {
    return fs.readFileSync(file, { encoding: 'utf-8' })
  },
  // 文本写入到下载目录
  writeTextFile (text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt')
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
    return filePath
  },
  // 图片写入到下载目录
  writeImageFile (base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
    if (!matchs) return
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1])
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' })
    return filePath
  },
  // 打开文件或文件夹
  openPath (paths) {
    if (!paths) return
    const pathList = paths.split('\n').filter(v => v.trim())
    pathList.forEach(v => {
      shell.openPath(v.trim())
    })
  },
  // 执行 shell 脚本
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
  // 检查路径是否存在
  checkPathExists (dirPath) {
    return fs.existsSync(dirPath)
  },
  // 创建目录
  createDirectory (dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    return true
  },
  // 写入备份文件
  writeBackupFile (dirPath, fileName, content) {
    const filePath = path.join(dirPath, fileName)
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' })
    return filePath
  },
  // 读取备份文件列表
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
  // 读取备份文件内容
  readBackupFile (filePath) {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
  }
}
