/**
 * Created by vyouyou on 17-8-4.
 */

// import "@/lib/flexible.js";
// import "@/lib/makegrid.js";
import "@/ext/vue-ydui/ydui.flexible";
import "@/ext/vue-ydui/ydui.less";
// less
import "@/ext/vue-ydui/styles/base.less";
import "@/assets/less/style-vankely.less";

import Vue from "vue";
import VueWechatTitle from "vue-wechat-title";
import AsyncComputed from "vue-async-computed";
import { DateTime } from "@/ext/vue-ydui/components/datetime";
import { CellGroup, CellItem } from "@/ext/vue-ydui/components/cell";
import { Confirm, Alert, Toast, Notify, Loading } from "@/ext/vue-ydui/components/dialog";
import { Button, ButtonGroup } from "@/ext/vue-ydui/components/button";
import { ActionSheet } from "@/ext/vue-ydui/components/actionsheet";
import { Input } from "@/ext/vue-ydui/components/input";
import { Popup } from "@/ext/vue-ydui/components/popup";
import { InfiniteScroll } from "@/ext/vue-ydui/components/infinitescroll";
import { ListTheme, ListItem, ListOther } from "@/ext/vue-ydui/components/list";
import { Icons } from "@/ext/vue-ydui/components/icons";
import { Spinner } from "@/ext/vue-ydui/components/spinner";
import { CheckBox, CheckBoxGroup } from "@/ext/vue-ydui/components/checkbox";
import { Radio, RadioGroup } from "@/ext/vue-ydui/components/radio";

Vue.use(VueWechatTitle);
Vue.use(AsyncComputed);
Vue.component(DateTime.name, DateTime);
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);
Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
Vue.component(ActionSheet.name, ActionSheet);
Vue.component(Input.name, Input);
Vue.component(Popup.name, Popup);
Vue.component(InfiniteScroll.name, InfiniteScroll);
Vue.component(ListTheme.name, ListTheme);
Vue.component(ListItem.name, ListItem);
Vue.component(ListOther.name, ListOther);
Vue.component(Icons.name, Icons);
Vue.component(Spinner.name, Spinner);
Vue.component(CheckBox.name, CheckBox);
Vue.component(CheckBoxGroup.name, CheckBoxGroup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
import NetPlugin from "@/plugin/net";

Vue.use(NetPlugin);

import logger from "@/utils/logger";
import api from "@/conf/api";
import * as constants from "@/conf/constants";
import cache from "@/utils/cache";
import utils from "@/utils/utils";
import debounce from "throttle-debounce/debounce";

//components

const install = function (VueClass, opts = {}) {
    //method
    VueClass.utils = utils;
    VueClass.prototype.$utils = utils;

    VueClass.logger = logger;
    VueClass.prototype.$logger = logger;

    VueClass.api = api;
    VueClass.prototype.$api = api;

    VueClass.constants = constants;
    VueClass.prototype.$constants = constants;

    VueClass.cache = cache;
    VueClass.prototype.$cache = cache;

    const deb = (...args) => {
        if (args.length === 2) {
            return debounce.call(this, args[1], args[0]);
        } else {
            return debounce.call(this, 300, args[0]);
        }
    };
    VueClass.debounce = deb;
    VueClass.prototype.$debounce = deb;

    const toast = (args) => {
        if (typeof args === "string") {
            return Toast.call(this, { mes: args, timeout: 2000 });
        } else {
            return Toast.call(this, args);
        }
    };
    VueClass.toast = toast;
    VueClass.prototype.$toast = toast;

    VueClass.confirm = Confirm;
    VueClass.prototype.$confirm = Confirm;
};
Vue.use(install);

import store from "@/store";
import router from "@/router";

Vue.store = store;
Vue.router = router;

import Axios from "axios";
// set server response cookie save
Axios.defaults.withCredentials = true;
Axios.defaults.timeout = 8000;

import FastClick from "fastclick";

FastClick.attach(document.body);

export default { store, router };

