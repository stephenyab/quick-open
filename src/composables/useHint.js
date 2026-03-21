import {ref} from 'vue'

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

export function useHint() {
    return {
        hint,
        hintTimeout,
        hintMessage,
        hintColor,
        showHint,
        showSuccess,
        showError,
        showInfo
    }
}
