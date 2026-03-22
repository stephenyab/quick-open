/**
 * 插件入口钩子模块
 * 处理 uTools 插件进入时的逻辑
 */
import {onMounted} from 'vue'
import {getData} from '@/utils/utoolsUtil'
import {ENTRY_TYPE_FILE, ENTRY_TYPE_SHELL, ENTRY_TYPE_ARGS} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/utils/messageCodec'

/**
 * 插件进入钩子
 * 当用户通过关键字触发插件时执行相应操作
 * 支持三种类型：文件/文件夹打开、Shell 脚本执行、参数传入执行
 */
export function usePluginEnter() {
    onMounted(() => {
        window.utools.onPluginEnter((action) => {
            const code = action.code
            if (code === 'quickOpenSetting') {
                return
            }
            
            window.utools.hideMainWindow()
            
            const dbData = getData(code)
            if (!dbData || !dbData.data) {
                window.utools.outPlugin()
                return
            }
            
            const { type, message } = dbData.data
            const messageList = normalizeMessageToArray(message)
            
            if (type === ENTRY_TYPE_FILE && messageList.length > 0) {
                window.services.openPath(messageList[0])
            } else if (type === ENTRY_TYPE_SHELL) {
                messageList.forEach(cmd => {
                    if (cmd.trim()) {
                        window.services.execShell(cmd)
                    }
                })
            } else if (type === ENTRY_TYPE_ARGS) {
                if (action.type === 'over') {
                    window.services.execShellWithArgs(messageList, action.payload)
                }
            }
            
            window.utools.outPlugin()
        })
    })
}
