const fs = require('node:fs')
const path = require('node:path')
const { exec } = require('node:child_process')

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
  openPath (filePath) {
    const platform = process.platform
    let command
    if (platform === 'win32') {
      command = `start "" "${filePath}"`
    } else if (platform === 'darwin') {
      command = `open "${filePath}"`
    } else {
      command = `xdg-open "${filePath}"`
    }
    exec(command, (error) => {
      if (error) {
        console.error('打开路径失败:', error)
      }
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
  }
}
