$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 文章类别类表展示
    initArtCateList();

    // 封装函数
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }

                let htmlStr = template('cate', { list: res.data });
                $('tbody').html(htmlStr);

            }
        })
    }

    //添加文章类别弹出框
    $("#btnAdd").on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#add').html()
        });
    })

    //提交类别  事件代理
    let indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 清空表单  更新页面  关闭对话框
                $('#form-add')[0].reset();
                initArtCateList();
                layer.close(indexAdd);
            }
        })
    })

    //修改文字类别  事件代理
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // console.log(1);
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#edit').html()
        });
        // 渲染 修改
        // 获取自定义id
        let Id = $(this).attr('data-id');
        // alert(Id)
        // 发送请求
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + Id,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 渲染
                form.val('form-edit', res.data);
            }
        })
        // 提交修改
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    // 更新页面  关闭对话框
                    initArtCateList();
                    layer.close(indexEdit);
                    layer.msg('更新成功')
                }
            })
        })
    })

    // 删除文章类别  事件代理
    $('tbody').on('click', '.btn-delete', function () {
        // 获取自定义id
        let Id = $(this).attr('data-id');
        // alert(Id)
        //提示
        layer.confirm('确定要删除吗？', { icon: 3, title: '提示' }, function (index) {
            // 发送请求
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg('删除成功')
                }
            })
            layer.close(index);
            // 刷新页面
            initArtCateList();
        });
    })

})