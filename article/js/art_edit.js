$(function () {
    // 文章 初始化分类
    let form = layui.form;
    let layer = layui.layer;
    initCate();
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取列表失败');
                }
                // 渲染
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 渲染裁剪
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]
        if (!file) {
            return "你可以选择一张图片作为封面"
        }
        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //设置状态
    let state = '已发布';
    // $('#btnSave1').click(function () {
    //     state = '已发布';
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 上传文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        let fd = new FormData(this);
        fd.append('state', state);
        // console.log(...fd);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);

                // console.log(...fd);
                // 上传数据
                publishArricle(fd);
            });
    })
    // 封住添加文章方法
    function publishArricle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功 跳转
                layer.msg('恭喜你，发布文章成功');
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1000)

            }
        })
    }
})