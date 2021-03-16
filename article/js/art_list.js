$(function () {
    //向模板引擎中导入  变量/函数  定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());

        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d}-${hh}:${mm}:${ss}`;
    }

    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    //    定义查询参数
    let q = {
        pagenum: 1, //页码值
        pagesize: 2,	//每页显示多少条数据
        cate_id: "",	//文章分类的 Id
        state: "",	//文章的状态，可选值有：已发布、草稿
    }

    // 初始化文章列表
    let layer = layui.layer;
    initTable();
    // 封装初始化函数
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取列表失败');
                }
                let htmlStr = template('tpl-table', { lits: res.data })
                $('tbody').html(htmlStr);

                // 调用分页函数
                renderPage(res.total);
            }
        })
    }

    // 文章 初始化分类
    let form = layui.form;
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

    //筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取值
        let state = $('[name=state]').val().trim();
        let cate_id = $('[name=cate_id]').val().trim();

        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        //初始化文章列表
        initTable();
    })

    //分页
    function renderPage(total) {
        let laypage = layui.laypage;

        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页几条
            curr: q.pagenum,//第几页
            limits: [2, 4, 6, 8], //每页多少条数据;
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip', 'refresh'],
            // 触发jump ,分页发生改变就会触发 obj参数对象  first 是否第一次初始化分页
            jump: function (obj, first) {
                // 判断,不是第一次初始化分页  才能调用初始化文章列表
                if (!first) {
                    q.pagenum = obj.curr;
                    // 重新指定每页多少条数据
                    q.pagesize = obj.limit
                    // 初始化页面
                    initTable();
                }
            }
        });
    }


    //删除
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        // alert(Id)
        // 弹出框
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + Id,
                success: (res) => {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg('获取列表失败');
                    }
                    // 页面汇总删除按钮个数等于1 页码大于一
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    // 删除成功  更新页面
                    initTable();
                    layer.msg("文章删除成功");
                }
            })

            layer.close(index);
        });
    })

})