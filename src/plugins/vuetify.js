// vuetify
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import {
    VBtn,
    VCard,
    VCardActions,
    VCardSubtitle,
    VCardText,
    VCardTitle,
    VContainer,
    VDialog,
    VForm,
    VList,
    VListItem,
    VListItemSubtitle,
    VListItemTitle,
    VSelect,
    VSnackbar,
    VSpacer,
    VTab,
    VTabs,
    VTabsWindow,
    VTabsWindowItem,
    VTextarea,
    VTextField
} from 'vuetify/components'

import {createVuetify} from 'vuetify'

export default createVuetify({
    icons: {
        defaultSet: 'mdi', aliases, sets: {
            mdi,
        },
    }, components: {
        VBtn,
        VCard,
        VCardText,
        VCardActions,
        VCardSubtitle,
        VCardTitle,
        VSpacer,
        VDialog,
        VForm,
        VTextField,
        VSelect,
        VContainer,
        VTextarea,
        VTab,
        VTabs,
        VTabsWindow,
        VTabsWindowItem,
        VList,
        VListItem,
        VListItemTitle,
        VListItemSubtitle,
        VSnackbar
    }
})
