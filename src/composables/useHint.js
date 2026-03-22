/**
 * 提示消息服务模块
 * 提供全局提示消息的显示和管理功能
 */
import {ref, provide, inject} from 'vue'

const HINT_KEY = Symbol('hint')

/**
 * 创建提示消息服务
 * 在父组件中调用，提供全局提示功能
 * @returns {Object} 提示服务对象，包含响应式状态和方法
 */
export function createHintService() {
    const hint = ref(false)
    const hintTimeout = ref(2000)
    const hintMessage = ref('')
    const hintColor = ref('success')

    /**
     * 显示提示消息
     * @param {string} message - 提示消息内容
     * @param {string} color - 提示颜色（success/error/warning）
     * @param {number} timeout - 显示时长（毫秒）
     */
    const showHint = (message, color = 'success', timeout = 2000) => {
        hint.value = true
        hintMessage.value = message
        hintColor.value = color
        hintTimeout.value = timeout
    }

    /**
     * 显示成功提示
     * @param {string} message - 提示消息内容
     * @param {number} timeout - 显示时长（毫秒）
     */
    const showSuccess = (message, timeout = 2000) => {
        showHint(message, 'success', timeout)
    }

    /**
     * 显示错误提示
     * @param {string} message - 提示消息内容
     * @param {number} timeout - 显示时长（毫秒）
     */
    const showError = (message, timeout = 2000) => {
        showHint(message, 'error', timeout)
    }

    /**
     * 显示信息提示
     * @param {string} message - 提示消息内容
     * @param {number} timeout - 显示时长（毫秒）
     */
    const showInfo = (message, timeout = 2000) => {
        showHint(message, 'warning', timeout)
    }

    const service = {
        hint,
        hintTimeout,
        hintMessage,
        hintColor,
        showHint,
        showSuccess,
        showError,
        showInfo
    }

    provide(HINT_KEY, service)
    
    return service
}

/**
 * 使用提示消息服务
 * 在子组件中调用，获取父组件提供的提示功能
 * @returns {Object} 提示服务对象
 */
export function useHint() {
    const service = inject(HINT_KEY)
    if (!service) {
        console.warn('useHint: No hint service provided. Make sure createHintService() is called in a parent component.')
        return {
            hint: ref(false),
            hintTimeout: ref(2000),
            hintMessage: ref(''),
            hintColor: ref('success'),
            showHint: () => {},
            showSuccess: () => {},
            showError: () => {},
            showInfo: () => {}
        }
    }
    return service
}
