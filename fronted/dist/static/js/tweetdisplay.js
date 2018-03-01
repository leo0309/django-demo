//display the tweets posted by the page's owner and comments
app = new Vue({
    el: '#display',
    data:{
        tweets:[]
    },
    created: function (){
        _self = this;
        owner = $('head title').html();
        //截取owner的名字
        ownername = owner.substring(0,owner.search(/\'s/));
        $.ajax({
            type: 'get',
            url: '/api/tweets/get',
            data:{
                'ownername':ownername,
                'limit':10,
                'offset':0
            },
            success:function(results){
                if (parseInt(results) !== -1){
                    results = JSON.parse(results);
                    console.log(results);
                    for (var i=0;i<results.length;i++) {
                        if (results[i].fields.img === "") {
                            results[i].fields.imgshow = false;
                            
                        }else{
                            results[i].fields.imgshow = true;
                        }
                    }
                    _self.tweets = results;
                    console.log(_self.tweets);
                }
               },
            error: function(e){console.log(e)}
            
        });
    },
    updated: function(){
        console.log(_self.tweets.length);
        if (_self.tweets.length !== 0 ){
            $('.tweetcontainer').css('display','block');
        }
        
    }
})