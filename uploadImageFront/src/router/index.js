import { createRouter, createWebHistory } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import ViewImg from '../components/ViewImg.vue'


export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: HelloWorld,
        },
        {
            path: '/viewimg',
            component: ViewImg,
        }
    ]
})

