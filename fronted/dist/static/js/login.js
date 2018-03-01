// 通过<a>标签实现选项卡
(function () {
  var aLink = document.querySelectorAll('a');
  // 用偏函数闭包实现
  var linkPartial = function (k) {
    var i = k;
    return function () {
      var choiceItem = document.querySelectorAll('.choiceItem');
      var j = 0;
      for (; j < choiceItem.length; j++) {
        if (choiceItem[j].style.display != 'none') break;
      }
      if (j != i) {
        choiceItem[j].style.display = 'none';
        choiceItem[i].style.display = 'block';
      }
    }
  }
  for (var i = 0; i < aLink.length; i++) {
    aLink[i].onclick = linkPartial(i);
  }
})();

// login检查
(function () {
    var btnLogin = document.querySelector('#login');
    btnLogin.onclick = function (event) {
        event.preventDefault();
        var user = document.querySelector('input[name="loginId"]');
        var password = document.querySelector('input[name="password"]');
        // password = CryptoJS.md5(password.nodeValue)
        var xhr = new XMLHttpRequest();
        if (typeof xhr.withCredentials === undefined){
          console.log("the browser doesn't support html5 XMLHttpRequest level2.");
        }else {
          // listen for event load
          xhr.onload = function () {
            var code = parseInt(xhr.responseText);
            console.log(code);
            if (code === 1) {
              window.location.href = "home/"+user.value;
            }else {
              alert('fail');
              document.querySelector('.loginItem span').style.visibility = 'visible';
            }
          }
          // listen for event error
          xhr.onerror = function(e) {
            console.log(e);
          }
          // post method
          userdata = user.value;
          passworddata = password.value;
          xhr.open("POST", '/api/login/',true);
          var csrftoken = Cookies.get('csrftoken');
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
          xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
          xhr.send("user="+userdata+"&password="+passworddata);
        }
        
    }
})();

// 注册register
(function (){
  var userInput = document.querySelector('.registerItem input[name="username"]');
  userInput.onchange = function(event) {
    event.preventDefault;
    var xhr = new XMLHttpRequest();
    xhr.onerror = function(e) {
      console.log(e);
    };
    xhr.onload = function(){
      var useralert = document.querySelector('span[class*="user"]');
      if (parseInt(xhr.responseText) == -1){
        useralert.style.visibility = 'visible';
      }else{
        useralert.style.visibility = 'hidden';
      }
      
    };
    xhr.open('POST','/api/register/',true);
    var csrftoken = Cookies.get('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
    xhr.send(userInput.name+'='+userInput.value);
  
  }
  
  var btnRegister = document.querySelector('#register');
  btnRegister.onclick = function (event) {
    event.preventDefault();
    var registeritem = document.querySelectorAll('.registerItem input');
    var registerInfo = '';
    for (var i=0; i<registeritem.length;i++){
      registerInfo+=registeritem[i].name+'='+registeritem[i].value+'&';
    }
    console.log(registerInfo);
    registerInfo.slice(-1,1);
    var xhr = new XMLHttpRequest();
    xhr.onerror = function(e) {
      console.log(e);
    };
    xhr.onload = function(){
      if (parseInt(xhr.responseText) === 1){
        alert('register successfully')
      }else{
        alert('fail');
        document.querySelector('.psw').style.visibility = 'visible';
      }
    };
    xhr.open("POST", '/api/register/',true);
    var csrftoken = Cookies.get('csrftoken');
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
    xhr.send(registerInfo);
  }
})();
