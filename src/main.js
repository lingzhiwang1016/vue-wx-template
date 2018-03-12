// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from "vue";
import init from "@/init";
import store from "@/store";
import router from "@/router";
import logger from "@/utils/logger";
import weixin from "@/utils/weixin";

import App from "@/App";

/* eslint-disable no-new */
const render = () => {
    const vm = new Vue({
        el: "#app",
        router,
        store,
        template: "<App/>",
        components: { App }
    });
    Vue.vm = vm;
    window.Vue = Vue;
};

// 初始化
Promise.all([
    store.dispatch("init"),
    weixin()
]).then(res => {
    logger.log("init res", res);
    render();
}).catch(err => {
    logger.warn("init err", err);
    render();
});
