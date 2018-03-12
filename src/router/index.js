import Vue from "vue";
import store from "@/store/index";
import Router from "vue-router";

Vue.use(Router);

import { CacheKeys } from "@/conf/constants";

// 公共路由（无需登录）
const publicRoute = [
    {
        path: "/proxy_login",
        meta: {
            title: "用户注册",
            permission: "public"
        },
        component: (resolve) => require(["@/h5/common/proxy_login.vue"], resolve)
    },
    {
        path: "/login",
        meta: {
            title: "用户注册",
            permission: "public"
        },
        component: (resolve) => require(["@/h5/common/login.vue"], resolve)
    },
    {
        path: "/bind",
        meta: {
            title: "用户注册",
            permission: "public"
        },
        component: (resolve) => require(["@/h5/common/bind.vue"], resolve)
    },
    {
        path: "/error",
        meta: {
            title: "出错啦",
            permission: "public"
        },
        component: (resolve) => require(["@/h5/common/error.vue"], resolve)
    },
    {
        path: "/*",
        meta: {
            title: "路由出错",
            permission: "public"
        },
        component: (resolve) => require(["@/h5/common/not_found.vue"], resolve)
    }
];

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            redirect: "/home/index"
        },
        {
            meta: {
                title: "home-index"
            },
            path: "/home/index",
            component: (resolve) => require(["@/h5/home/index.vue"], resolve)
        },
        ...publicRoute
    ]
});

router.beforeEach((to, from, next) => {
    const isLogin = store.state.isLogin;
    Vue.logger.log("from to =>", from.path, to.path, isLogin, to.meta);
    if (isLogin) {
        next();
    } else {
        // 判断是否登录，（可以通过接口，Vuex状态 token）
        // 没有登录走下面逻辑
        if (to.meta.permission === "public") {
            next();
        } else {
            const redirect = to.path;
            Vue.store.dispatch("redirectLoginView", redirect).catch(err => {
                Vue.logger.warn("redirectLoginView err", err);
                next(false);
            });
        }
    }
});

export default router;
