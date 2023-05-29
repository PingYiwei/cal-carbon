import { createRouter, createWebHashHistory } from "vue-router";
import Cceqc from "../view/cceqc.vue";
import Lceca from "../view/lceca.vue";
import Login from "../view/login.vue"
import Agent from "../view/agent.vue"

const routes = [
    {
        path: '/',
        name: 'main',
        redirect: '/login',
    },
    {
        path: '/cceqc',
        component: Cceqc,
        name: 'cceqc',
    },
    {
        path: '/lceca',
        component: Lceca,
        name: 'lceca',
    },
    {
        path: '/login',
        component: Login,
        name: 'login'
    },
    {
        path: '/agent',
        component: Agent,
        name: 'agent'
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router