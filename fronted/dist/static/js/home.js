//display the tweets posted by the page's owner and comments
app = new Vue({
    el: '#display',
    data: {
        tweets: []
    },
    created: function () {
        var _self = this;
        var owner = $('head title').html();
        //截取owner的名字
        var ownername = owner.substring(0, owner.search(/\'s/));
        $.ajax({
            type: 'get',
            url: '/api/tweets/get',
            data: {
                'ownername': ownername,
                'limit': 10,
                'offset': 0
            },
            success: function (results) {
                if (parseInt(results) !== -1) {
                    results = JSON.parse(results);
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].fields.img === "") {
                            results[i].fields.imgshow = false;

                        } else {
                            results[i].fields.imgshow = true;
                        }
                    }
                    _self.tweets = results;
                }
            },
            error: function (e) { console.log(e) }

        });
    },
    updated: function () {
        var _self = this;
        if (_self.tweets.length !== 0) {
            $('.tweetcontainer').css('display', 'block');
        }

    }
});

(function () {
    //send tweet
    $('#tweetSend').click(function (event) {
        event.preventDefault();
        var tweetInput = $('input[class="tweetArea"]').val();
        var tweetImg = $('input[class="tweetImg"]');
        if (tweetInput !== '') {
            var dataform = new FormData();
            dataform.append('tweetText', tweetInput);
            if (tweetImg !== '') {
                //只能得到上传路径
                dataform.append('tweetImg', tweetImg.val());
                //可以得到上传文件
                dataform.append('tweetfiles', tweetImg[0].files[0])
            }
            $.ajax({
                type: 'post',
                url: '/api/tweet/post/',
                data: dataform,
                contentType: false,
                processData: false,
                beforeSend: function (request) {
                    request.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
                },
                success: function (result) {
                    if (parseInt(result) !== -1) {
                        alert('发表成功');
                        //console.log(result);
                        result = JSON.parse(result);
                        if (result.fields.img === "") {
                            result.fields.imgshow = false;
                        } else {
                            result.fields.imgshow = true;
                        }
                        tweetImg.val("");
                        app._data.tweets = [result].concat(app._data.tweets);

                    } else {
                        alert('发表失败');
                        console.log(result);
                    }
                },
                error: function (result) { alert('发表失败'); }
            });
        }

    })

})();

// scroll for refreshing automatically
$(window).scroll(
    function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        //由于是float类型的值，需要转成int比较
        if (parseInt(Math.round(scrollTop + windowHeight)) == parseInt(scrollHeight)) {
            // 此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
            var offset = $('#display ul li').length;
            var limit = offset + 10;
            var owner = $('head title').html();
            //截取owner的名字
            var ownername = owner.substring(0, owner.search(/\'s/));
            $.ajax({
                type: 'get',
                url: '/api/tweets/get',
                data: {
                    'ownername': ownername,
                    'limit': limit,
                    'offset': offset
                },
                success: function (results) {
                    //console.log(results)
                    if (parseInt(results) !== -1) {
                        results = JSON.parse(results);
                        //console.log(results);
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].fields.img === "") {
                                results[i].fields.imgshow = false;

                            } else {
                                results[i].fields.imgshow = true;
                            }
                        }
                        app._data.tweets = app._data.tweets.concat(results);
                    }
                },
                error: function (e) { console.log(e) }
            });
        }
    });