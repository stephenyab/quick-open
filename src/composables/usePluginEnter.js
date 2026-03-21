import {onMounted} from 'vue'
import {getData} from '@/utils/utoolsUtil'
import {ENTRY_TYPE_FILE, ENTRY_TYPE_SHELL, ENTRY_TYPE_ARGS} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/utils/messageCodec'

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
