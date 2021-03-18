$(function () {
    // 定义密码规则
    let form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 新密码不能与旧密码相同
        samepwd: function (value) {
            if (value == $('[name=oldPwd]').val().trim()) {
                return "新密码和原密码不能相同"
            }
        },
        // 两次新密码必须相同
        repwd: function (value) {
            if (value != $('[name=newPwd]').val().trim()) {
                return "两次密码输入不一致"
            }
        }
    });

    // 修改密码
    $('#form_pwd').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: (res) => {
                //    console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg('修改密码成功！')
                // 重置表单
                $('#form_pwd')[0].reset();
            }
        })
    })
})


