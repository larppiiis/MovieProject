import { createApp } from 'vue'
import App from './App.vue'

import moment from 'moment'

const app = createApp(App)
app.config.globalProperties.$moment = moment

app.use(App).mount('#app')
