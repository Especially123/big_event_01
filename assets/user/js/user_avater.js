// 上传文件图片优先使用 window 方法 作为入口换函数 它是加载完文件才执行下一步
$(window).on('load', function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 选择文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })
    // 修改裁剪图片
    $("#file").on('change', function (e) {
        // 1. 拿到用户选择的文件
        let file = e.target.files[0]
        if (!file) {
            return '请选择需要更换的图片'
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //上传头像
    $('#btnUpload').on('click', function () {
        // 获取base64类型的头像字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // console.log(dataURL);
        // 发送请求
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: { userPic: dataURL },
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜你，更换头像成功!");
                window.parent.getUserInof();
            }
        })
    })
    /*  $('#btnChooseImage').on('click', function () {
         $('#file').click();
     })
     $('#file').change(function (e) {
         let file = e.target.files[0];
         // console.log(file);
         if (!file) {
             return alert('选择个头像呗')
         }
         let fn = new FormData();
         fn.append('file_data', file)
         $.ajax({
             type: 'post',
             url: '/my/uploadpic',
             data: fn,
             processData: false,
             contentType: false,
             success: (res) => {
                 // console.log(res);
                 const { status, src } = res;
                 // return console.log(status, src);
                 if (status != 1) {
                     $.ajax({
                         type: 'post',
                         url: '/my/userinfo',
                         data: {
                             userPic: src
                         },
                         success: (res) => {
                             // console.log(res);
                             alert("上传成功")
                             window.parent.getUserInof();
                         }
                     })
                 }
             }
         })
     }) */

})



