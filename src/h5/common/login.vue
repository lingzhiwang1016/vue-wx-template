<template>
    <div class="weui-loading_toast">
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

        methods: {
            loginCode (code) {
                // 回调
                this.$logger.log("loginCode code", code);
                this.$store.dispatch("wxLogin", code);
            }
        },
        created: function () {
            this.loginCode(this.paramsCode);
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
