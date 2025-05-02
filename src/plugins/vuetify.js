// vuetify
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import {VBtn, VCard, VDialog} from 'vuetify/components'

import {createVuetify} from 'vuetify'

export default createVuetify({
    icons: {
        defaultSet: 'mdi', aliases, sets: {
            mdi,
        },
    }, components: {
        VBtn, VCard, VDialog
    }
})
