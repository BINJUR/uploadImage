import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import VueLazyLoad from 'vue-lazyload'
import router from './router'

const app = createApp(App)

app.use(store).use(VueLazyLoad,{
    preLoad: 1,
    error: '/404.png',
    attempt: 2,
}).use(router).mount('#app')
