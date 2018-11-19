var musicArr = 0
var clock
var audio = new Audio()
var musicList = []
audio.autoplay = true


function $(selector){
  return document.querySelector(selector)
 }


audio.ontimeupdate = function(){
  $('.music-now').style.width = this.currentTime/this.duration*100 +'%'
}

audio.onplay = function(){
  clock = setInterval(function(){
    var min = Math.floor(audio.currentTime/60)
    var sec = Math.floor(audio.currentTime)%60 + ''
    sec = sec.length === 2?sec:'0' + sec
    $('.music-time').innerText = min + ':' + sec
  },1000)
}

audio.onpause = function(){
  clearInterval(clock)
}

audio.onended = function(){
  musicArr = (++musicArr) % musicList.length
  loadMusic(musicList[musicArr])
}

$('.but-play').addEventListener('click',function(){
  if(audio.paused){
    audio.play()
    $('.but-play .iconfont').classList.remove('icon-play')
    $('.but-play .iconfont').classList.add('icon-stop')
  }else{
    audio.pause()
    $('.but-play .iconfont').classList.add('icon-play')
    $('.but-play .iconfont').classList.remove('icon-stop')
  }
})

$('.but-up').onclick = function(){
  musicArr = (++musicArr) % musicList.length
  loadMusic(musicList[musicArr])
}

$('.but-on').onclick = function(){
  musicArr = (musicList.length + (--musicArr)) % musicList.length
  loadMusic(musicList[musicArr])
}

$('.music-bar').onclick  = function(e){
  var percent = e.offsetX/parseInt(getComputedStyle(this).width)
  console.log(percent)
  audio.currentTime = audio.duration*percent
}



getMusicList(function(list){
  musicList = list
  loadMusic(list[musicArr])
})

function getMusicList(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('GET','/music.json',true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300) || xhr.stastus === 304){
      callback(JSON.parse(xhr.responseText))
    }else{
      console.log('获取数据失败')
    }
  }
  xhr.onerror = function(){
    console('网络异常')
  }
  xhr.send()
}

function loadMusic(musicObj){
  $('.track').innerText = musicObj.track
  $('.author').innerText = musicObj.author
  $('.cover').style.backgroundImage = 'url(' + musicObj.image + ')'
  audio.src = musicObj.src
}




