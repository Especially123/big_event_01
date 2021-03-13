$(function () {
    // console.log(1);
    // 开发环境服务配置
    let baseURL = 'http://api-breakingnews-web.itheima.net';
    // 测试环境服务配置
    // let baseURL = 'http://api-breakingnews-web.itheima.net';
    // 生产环境服务配置
    // let baseURL = 'http://api-breakingnews-web.itheima.net';
    // 拦截可以得到 get post ajax 的请求 属性值等等
    $.ajaxPrefilter(function (options) {
        // console.log(options.url);
        options.url = baseURL + options.url;
    })
})