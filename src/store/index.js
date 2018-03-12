/**
 * Created by lijinchao(joshua) on 17/3/16.
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import * as types from "@/store/mutation-types";
import weixin from "@/store/modules/weixin";
import api from "@/conf/api";
import { CacheKeys } from "@/conf/constants";

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
    state: {
        isLogin: false,
        loginUser: {}
    },
    getters: {},
    actions: {
        async init({ dispatch, commit }, obj) {
            Vue.logger.log("init obj", obj);
            let data = {
                isLogin: false,
                loginUser: {}
            };
            try {
                data = {
                    isLogin: Vue.cache.cacheGet(CacheKeys.isLogin) || false,
                    loginUser: Vue.cache.cacheGet(CacheKeys.loginUser) || {}
                };
            } catch (err) {
                Vue.logger.warn("init", err);
            }
            try {
                if (data.isLogin) {
                    const user = await Vue.request({
                        url: api.user_info,
                        method: "get"
                    });
                    Vue.logger.log("init user info", user.data);
                    data.loginUser = user.data;
                    Vue.cache.cacheSet(CacheKeys.isLogin, true, 24 * 3600 * 1000);
                    Vue.cache.cacheSet(CacheKeys.loginUser, user.data, 24 * 3600 * 1000);
                }
            } catch (err) {
                Vue.logger.warn("init with net", err);
                Vue.cache.cacheRemove(CacheKeys.isLogin);
                Vue.cache.cacheRemove(CacheKeys.loginUser);
                data = {
                    isLogin: false,
                    loginUser: {}
                };
                // 发现用户登录信息已经过期，则需要强制登录
            }
            commit({
                type: types.init,
                ...data
            });
            return data.isLogin;
        }
    },
    mutations: {
        [types.init](state, payload) {
            state.isLogin = payload.isLogin;
            state.loginUser = payload.loginUser;
        },
        [types.loginSuccess](state, payload) {
            state.isLogin = true;
            state.loginUser = payload.loginUser;
        },
    },
    modules: {
        weixin
    },
    strict: false && debug
});
