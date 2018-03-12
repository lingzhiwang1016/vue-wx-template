<template>
    <div class="vk-login">
        <div v-wechat-title="$route.meta.title"></div>

        <input v-model="form.phone" placeHolder="手机号"></input>
        <input class="input-style" v-model="form.smsCode" placeHolder="短信验证码">
        <span @click="onGetSMSCode" slot class="msg-button">{{timerStr}}</span>
        </input>
        <yd-button type="primary" size="large" class="bind-button-style" @click.native="bindPhone">登录</yd-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    phone: "",
                    captcha: "",
                    smsCode: ""
                },
                captchaUrl: this.$api.captcha_for_bind + "?d=" + Date.now(),

                timer: 0, //默认倒数30秒
                interval: null, //setInterval的对象

                sendMsgDisable: true //可以发送验证码
            };
        },

        computed: {
            paramswxToken() {
                return this.$route.query.wxToken;
            },
            timerStr() {
                if (this.interval) {
                    return this.timer + "s";
                } else {
                    return "获取验证码";
                }
            }
        },

        asyncComputed: {},

        watch: {},

        components: {},

        methods: {
            newPage() {
                location.href = location.origin + "/agreement";
            },
            update() {
                this.timer--;
                if (this.timer <= 0) {
                    this.stopTimer();
                }
            },

            stopTimer() {
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            },

            startTimer() {
                if (this.interval) {
                    return;
                }
                this.interval = setInterval(this.update, 1000);
                this.timer = 60;
            },

            onGetCaptcha() {
                this.captchaUrl = this.$api.captcha_for_bind + "?d=" + Date.now();
            },

            onGetSMSCode() {
                if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.form.phone)) {
                    this.$toast("请填写正确的手机号");
                    return;
                }
                if (this.interval) {
                    return;
                }
                if (!this.sendMsgDisable) {
                    return;
                }
                this.sendMsgDisable = false;
                // this.$vkLoadingToast.show("验证码获取中");
                this.$request({
                    url: this.$api.smscode,
                    path: {
                        telephone: this.form.phone,
                        type: "login"
                    }
                }).then(res => {
                    //成功后开始计时器
                    this.$logger.log("smscode res", res);
                    this.sendMsgDisable = true;
                    this.startTimer();
                }).catch(err => {
                    this.$logger.warn("smscode err", err);
                    this.sendMsgDisable = true;
                    this.$toast(err.message);
                });
            },

            bindPhone() {
                // 回调
                this.$logger.log("bindPhone code", this.paramswxToken);
                if (!this.form.phone) {
                    this.$toast("请输入手机号！");
                    return;
                } else if (!this.form.smsCode) {
                    this.$toast("请输入验证码！");
                    return;
                }
                this.$store.dispatch("wxBind", { wxToken: this.paramswxToken, telephone: this.form.phone, smsCode: this.form.smsCode }).then(res => {
                }).catch(async err => {
                    this.$toast(err.message);
                    this.$logger.warn("bindPhone fail", err);
                    await this.$utils.sleep(2000);
                }).catch(err => {
                    this.$toast(err.message);
                });
            }
        },

        mounted() {
        },

        created: function () {
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped type="text/less">

</style>
