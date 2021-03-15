$(function () {

    let form = layui.form;
    let layer = layui.layer;
    // 自定义校验
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 1 || value.trim().length > 6) {
                return "昵称长度为1-6位之间"
            }
        }
    })

    // 用户渲染
    initUserInof();
    function initUserInof() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功渲染
                //给表单赋值
                form.val("formUserInof", res.data)
            }
        })
    }
    // 重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 用户渲染方法实现
        initUserInof();
    })

    //修改用户
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg('用户信息修改失败')
                }
                layer.msg('修改信息成功');
                //调用父页面中更新用户信息的头像方法
                window.parent.getUserInof();
            }
        })
    })
})


