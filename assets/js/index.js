$(function () {
    // 调用用户数据函数
    getUserInof();
    // 退出登录
    let layer = layui.layer;
    $('#btnLogin').on('click', () => {
        // console.log(1);
        layer.confirm('确定要退出吗？', { icon: 3, title: '提示' }, function (index) {
            //  清除数据
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html';
            //关闭
            layer.close(index);
        });
    })

})




// 封装一个获取用户数据的函数
function getUserInof() {
    // 发送请求
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录 token过期事件12个小时
        //     Authorization: localStorage.getItem('token') || ""
        // },
        // 身份拦截
        // complete: function (res) {
        //     // console.log(res.responseJSON);
        //     // console.log(res);
        //     let obj = res.responseJSON;
        //     if (obj.status == 1 && obj.message == '身份认证失败！') {
        //         //  清除数据
        //         localStorage.removeItem('token')
        //         // 页面跳转
        //         location.href = '/login.html';
        //     }
        // },
        success: (res) => {

            if (res.status !== 0) {
                return layui.layer.msg(res.message, { icon: 5 });
            }
            console.log(res.data);
            // 调用头像渲染
            renderAvatar(res.data)
        }
    })
}

//封装渲染头像
function renderAvatar(user) {
    // console.log(user);
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 判定 有头像渲染头像  没有渲染文字头像

    if (user.user_pic == null) {
        $('.text-avatar').show().html(name[0].toUpperCase());
        $('.layui-nav-img').hide()

    } else {

        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();

    }

}