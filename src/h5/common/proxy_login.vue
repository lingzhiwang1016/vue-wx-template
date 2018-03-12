<template>
    <div class="weui-loading_toast">
        <div class="weui-mask_transparent"></div>
        <div class="weui-toast">
            <i class="weui-loading weui-icon_toast"></i>
            <p class="weui-toast__content">登录加载中</p>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {};
        },

        computed: {
            paramsCode () {
                return this.$route.query.code;
            },
            paramsState () {
                return this.$route.query.state;
            }
        },

        asyncComputed: {},

        watch: {},

        components: {},

        mounted () {

        },

        methods: {},
        created: function () {
            this.$logger.log("proxy login state:", this.paramsState);
            const origin = this.$utils.getOrigin(this.paramsState);
            this.$logger.log("redirect to origin", origin);
            window.location = `${origin}/login?code=${this.paramsCode}&state=${this.paramsState}`;
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .msg {
        width: 100%;
        /*height: 100%;*/
    }
</style>
