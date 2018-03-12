import Vue from "vue";

import * as types from "@/store/mutation-types";
import { CacheKeys } from "@/conf/constants";
import config from "@/conf/config";

const defaultState = {};

// getteuyrs
const getters = {};

// actions
const actions = {

    async redirectLoginView({ dispatch, commit }, originUrl) {
        Vue.logger.log("redirectLoginView: originUrl", originUrl);
        Vue.cache.cacheSet(CacheKeys.redirectUrl, originUrl, 1 * 3600 * 1000);
        const proxyOrigin = config.getProxyOrigin();
        // 避免在中转页面执行很多逻辑，把中转页面单独做出来
        let redirectUrl = `${proxyOrigin}/proxy_login.html`;
        if (config.env === "development" || config.env === "production") {
            redirectUrl = `${proxyOrigin}/login`;
        }
        Vue.logger.log("redirectLoginView:", redirectUrl);
        // 没有登录信息的时候，要向服务端获取跳转信息
        const res = await Vue.request({
            url: config.wxRedirectUrl,
            method: "get",
            params: {
                url: redirectUrl,
                state: config.env,
                publicCode: config.getPublicCode(),
                wechatCode: config.getPublicCode()
            }
        });
        window.location.replace(res.data);
    },

    async wxBind({ dispatch, commit, state }, { wxToken, telephone, smsCode }) {
        Vue.logger.log("wxToken, telephone, smsCode, wechatCode", wxToken, telephone, smsCode, config.getPublicCode());
        return Vue.request({
            url: config.wxBind,
            method: "post",
            params: {
                telephone: telephone,
                smsCode: smsCode,
                wxToken: wxToken
            }
        }).then(res => {
            Vue.logger.log("store wxBind res:", JSON.stringify(res));
            Vue.cache.cacheSet(CacheKeys.isLogin, true, 24 * 3600 * 1000);
            Vue.cache.cacheSet(CacheKeys.loginUser, res.data, 24 * 3600 * 1000);
            Vue.cache.cacheSet(CacheKeys.token, res.data.token.id, 24 * 3600 * 1000);
            commit({
                type: types.loginSuccess,
                loginUser: res.data
            });
            let originUrl = Vue.cache.cacheGet(CacheKeys.redirectUrl);
            originUrl = !originUrl ? "/" : originUrl;
            Vue.router.replace(originUrl);
            return res.data;
        });
    },

    async getToken({ dispatch, commit }, authCode) {
        const res = await Vue.request({
            url: config.wxTransToken,
            methods: "get",
            params: {
                publicCode: config.getPublicCode(),
                authCode
            }
        });
        return res.data.tokenId;
    },

    async wxLogin({ dispatch, commit }, code) {
        let token = "";
        try {
            token = await dispatch("getToken", code);
        } catch (e) {
            Vue.logger.log(e);
        }
        // 回调
        Vue.logger.log("wxLogin weixin code and wxToken", token);
        return Vue.request({
            url: config.wxLogin,
            method: "post",
            params: {
                wxToken: token
            }
        }).then(res => {
            Vue.logger.log("store wxLogin res:", JSON.stringify(res));
            Vue.cache.cacheSet(CacheKeys.isLogin, true, 24 * 3600 * 1000);
            Vue.cache.cacheSet(CacheKeys.loginUser, res.data, 24 * 3600 * 1000);
            Vue.cache.cacheSet(CacheKeys.token, res.data.token.id, 24 * 3600 * 1000);
            commit({
                type: types.loginSuccess,
                loginUser: res.data
            });
            let originUrl = Vue.cache.cacheGet(CacheKeys.redirectUrl);
            originUrl = !originUrl ? "/" : originUrl;
            Vue.router.replace(originUrl);
            return res.data;
        }).catch(async err => {
            Vue.logger.warn("wxLogin fail", err);
            if (err.code === "B20023" || err.code === "10015") {
                // 绑定用户
                Vue.router.replace(`/bind?wxToken=${token}`);
            } else {
                Vue.router.replace({
                    path: "/error",
                    query: {
                        errorMsg: err.message
                    }
                });
            }
        }).catch(err => {
            Vue.router.replace("/error");
        });
    }
};

// mutations
const mutations = {};

export default {
    state: defaultState,
    getters,
    actions,
    mutations
};
