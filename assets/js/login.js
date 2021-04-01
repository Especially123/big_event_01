$(function () {
    //需求1：点击a链接切换显示注册登录模块
    //去注册
    $('#link_reg').on('click', () => {
        $('.login-box').hide();
        $('.reg-box').show();

    })
    //去登录
    $('#link_login').on('click', () => {
        $('.reg-box').hide();
        $('.login-box').show();

    })

    // 需求2：自定义密码规则
    // console.log(layui.form);
    let form = layui.form;
    // 密码规则 .verify()为对象
    form.verify({
        // 参数可是数组或者函数
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 密码确认规则 
        // value值  item为dom对象
        repwd: function (value, item) {
            // console.log(value, item);
            // console.log($('.reg-box input[name=password]').val().trim());
            // 判断密码与确认密码是否一样
            if (value != $('.reg-box input[name=password]').val().trim()) {
                // 不一样返回提示
                return "两次密码输入不一致";
            }
        }
    });
    //需求3：注册用户
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发送数据
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('.reg-box input[name=username]').val().trim(),
                password: $('.reg-box input[name=password]').val().trim()
            },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 提交成功
                layer.msg('恭喜你，用户注册成功', { icon: 6 });
                // 返回登录
                $('#link_login').click();
                // 重置表单
                $('#form_reg')[0].reset();
            }
        })
    })

    //需求4：登录
    $('#form_login').on('submit', function (e) {
        // console.log($(this).serialize());
        e.preventDefault();
        // 发送数据
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                //保存数据
                localStorage.setItem('token', res.token)
                // 跳转
                location.href = "/index.html";
                // 提交成功
                // layer.msg('恭喜你，用户注册成功', { icon: 6 });
            }
        })
    })

})