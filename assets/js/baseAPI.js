$(function () {
    // console.log(1);
    // 开发环境服务配置
    // let baseURL = 'http://api-breakingnews-web.itheima.net';
    let baseURL = 'http://127.0.0.1:2020';
    // 测试环境服务配置
    // let baseURL = 'http://api-breakingnews-web.itheima.net';
    // 生产环境服务配置
    // let baseURL = 'http://api-breakingnews-web.itheima.net';
    // 拦截可以得到 get post ajax 的请求 属性值等等

    $.ajaxPrefilter(function (options) {
        // console.log(options.url);
        if (options.url === 'http://127.0.0.1:5500/index.html') return;
        options.url = baseURL + options.url;

        //判断 ulr有/my/ 手动添加 Authorization
        //身份认证
        if (options.url.indexOf('/my/') != -1) {
            // 重新登录 token过期事件12个小时

            options.headers = { Authorization: 'Bearer ' + localStorage.getItem('token') || "" }
            //身份拦截
            options.complete = function (res) {
                // console.log(res.responseJSON);
                // console.log(res);
                let obj = res.responseJSON;
                if (obj.status == 1 && obj.message == '身份认证失败！') {
                    //  清除数据
                    localStorage.removeItem('token')
                    // 页面跳转
                    location.href = '/login.html';
                }
            }
        }

    })
})