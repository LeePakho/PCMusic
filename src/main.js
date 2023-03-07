import * as getHttp from '@/api/index.js'
import utils from '@/utils/utils'
import app from '@/utils/app.js'
import router from '@/router'
import ElementPlus, { ElMessage } from 'element-plus'
import store from '@/store'
import 'element-plus/dist/index.css'

import '@/assets/iconfont/fonts.css'
import '@/assets/css/global.css'

app.config.globalProperties['$http'] = getHttp
app.config.globalProperties['$msg'] = ElMessage
app.config.globalProperties['$utils'] = utils

app.use(router).use(ElementPlus).use(store).mount('#app')