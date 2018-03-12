export default{
    tableSet: function (table, key, value) {
        table = table || "vankely";
        table = "table_" + table;
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        // 如果settings为null，则删除表
        let data = {};
        try {
            data = JSON.parse(localStorage[table]);
        } catch (e) {
            data = {};
        }
        data[key] = value;
        localStorage[table] = JSON.stringify(data);
    },

    tableGet: function (table, key) {
        table = table || "vankely";
        table = "table_" + table;
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        // 如果settings为null，则删除表
        let data = {};
        try {
            data = JSON.parse(localStorage[table]);
        } catch (e) {
            data = {};
        }
        return data[key];
    },

    tableRemoveKey: function (table, key) {
        table = table || "vankely";
        table = "table_" + table;
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        // 如果settings为null，则删除表
        let data = {};
        try {
            data = JSON.parse(localStorage[table]);
        } catch (e) {
            data = {};
        }
        delete data[key];
        localStorage[table] = JSON.stringify(data);
    },

    tableRemove: function (table) {
        table = table || "vankely";
        table = "table_" + table;
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        return delete localStorage[table];
    },

    cacheSet: function (key, value, expire) {
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        let expireMils = -1;
        if (expire) {
            expireMils = Date.now() + expire;
        }
        const data = {
            value: value,
            expire: expireMils
        };
        localStorage[key] = JSON.stringify(data);
    },

    cacheGet: function (key) {
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        // 如果settings为null，则删除表
        let data = {};
        try {
            data = JSON.parse(localStorage[key]);
        } catch (e) {
            return;
        }
        if (data.expire === -1) {
            return data.value;
        }
        if (data.expire > Date.now()) {
            return data.value;
        }
    },

    cacheRemove: function (key) {
        const win = window;
        if (!win.JSON || !win.JSON.parse) return;
        // 如果settings为null，则删除表
        return localStorage.removeItem(key);
    }
};
