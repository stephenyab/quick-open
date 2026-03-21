import {ref, provide, inject} from 'vue'

const HINT_KEY = Symbol('hint')

export function createHintService() {
    const hint = ref(false)
    const hintTimeout = ref(2000)
    const hintMessage = ref('')
    const hintColor = ref('success')

    const showHint = (message, color = 'success', timeout = 2000) => {
        hint.value = true
        hintMessage.value = message
        hintColor.value = color
        hintTimeout.value = timeout
    }

    const showSuccess = (message, timeout = 2000) => {
        showHint(message, 'success', timeout)
    }

    const showError = (message, timeout = 2000) => {
        showHint(message, 'error', timeout)
    }

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
