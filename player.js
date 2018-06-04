// global variables*********************
  let videos = document.querySelectorAll('.player-js'); // returns NodeList
  let videosArray = Array.from(videos);



  videosArray.forEach( video => {

    // creating elements******************************************
      let videoBox = document.createElement('div'); // container for video tag
      videoBox.className = 'video';
      let videoElement = document.createElement('video'); 
      let videoControls = document.createElement('div');
      videoControls.className = 'video-controls';
      let upperControls = document.createElement('div');
      upperControls.className = 'upper-controls';
      let lowerControls = document.createElement('div');
      lowerControls.className = 'lower-controls';
      let progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      let progressFilled = document.createElement('div');
      progressFilled.className = 'progress-filled';
      let controlButtons = document.createElement('div');
      controlButtons.className = 'control-buttons';
      let playButton = document.createElement('div');
      let icon = document.createElement('i');
      icon.classList.add('fas');
      icon.classList.add('fa-play');
      icon.classList.add('play-pause-button');
      let time = document.createElement('div');
      time.className = 'current-time';



    // appending elements********************************************
      videoBox.appendChild(videoElement);
      playButton.appendChild(icon);
      controlButtons.appendChild(playButton);
      controlButtons.appendChild(time);
      progressBar.appendChild(progressFilled);
      lowerControls.appendChild(progressBar);
      lowerControls.appendChild(controlButtons);
      videoControls.appendChild(upperControls);
      videoControls.appendChild(lowerControls);
      video.appendChild(videoBox);
      video.appendChild(videoControls);

      // styling elements

  videoElement.setAttribute('src',video.dataset.src);
  upperControls.textContent = video.dataset.title;
  video.setAttribute('tabindex','0');
  videoControls.style.width = video.dataset.width + 'px';
  videoControls.style.height = video.dataset.height + 'px';
  video.style.width = video.dataset.width + 'px';
  video.style.height = video.dataset.height + 'px';
  videoBox.style.width = video.dataset.width + 'px';
  videoBox.style.height = video.dataset.height + 'px';
  videoElement.onloadedmetadata = () => {
    time.innerHTML = '00:00/' + secToMin(videoElement.duration);
  }

  });


// function declarations *******************************
let videoPlayToggle = (video) => {
    if(video.paused) video.play();
    else video.pause();
    video.parentElement.parentElement.focus();
};


let secToMin = (seconds) => {
  let min = Math.floor(seconds/60);
  let sec = Math.ceil(seconds % 60);
  if(min<10) min = '0' + min;
  if(sec<10) sec = '0' + sec;
  return min + ':' + sec;
}

let interval;
let updateData = (video,progressFilled,currentTime) => {
      interval = setInterval(function(){
      progressFilled.style.width = video.currentTime / video.duration * 100 + '%';
      let current = video.currentTime;
      let total = video.duration;
      currentTime.innerHTML = secToMin(current)+"/"+secToMin(total);
    },1000);
}


let iconUpdate = (video) => {
    let x = video.querySelector('.play-pause-button');
    x.classList.toggle('fa-play');
    x.classList.toggle('fa-pause');
}

let keyPressed = (video,e) => {
  e.preventDefault();
  if(e.keyCode == 37)
    video.currentTime += -10;
  else if(e.keyCode == 39)
    video.currentTime += 10;
  else if(e.keyCode == 32)
    videoPlayToggle(video);
  else if(e.keyCode == 38)
    if(video.volume<1) video.volume += 0.1;
  else if(e.keyCode == 40)
    if(video.volume>0.1) video.volume += -0.1;
}

let toggleFullScreen = (video) => {
  let checkFullScreen = document.fullscreenElement ||
	document.webkitFullscreenElement ||
	document.mozFullScreenElement ||
	document.msFullscreenElement;

  let requestFullScreen = video.requestFullscreen ||
   video.msRequestFullscreen || video.mozRequestFullScreen
  || video.webkitRequestFullscreen;

  let cancelFullScreen = document.exitFullscreen ||
   document.msExitFullscreen || document.mozCancelFullScreen
   || document.webkitExitFullscreen;

   let controls = video.parentElement.parentElement.querySelector('.video-controls');

  if(!checkFullScreen){
    requestFullScreen.call(video);
    controls.style.height = '100%';
    controls.style.width = '100%';
  }

  else{
    cancelFullScreen.call(document);
    controls.style.height = video.dataset.height + 'px';
    controls.style.width = video.dataset.width + 'px';
  }
}

// event listeners *************************************************

  videos.forEach(video => {
    let vid = video.querySelector('video');
    let controls = video.querySelector('.video-controls');
    let progressFilled = video.querySelector('.progress-filled');
    let currentTime = video.querySelector('.current-time');
    video.addEventListener('click',() => {videoPlayToggle(vid)});
    vid.addEventListener('play',() => {
      iconUpdate(video);
      updateData(vid,progressFilled,currentTime);
    });
    vid.addEventListener('pause',() => {
      iconUpdate(video);
      clearInterval(interval);
    });
    video.addEventListener('keydown',(e) => {keyPressed(vid,e)});
    video.addEventListener('dblclick',() => {toggleFullScreen(vid)});
  });

// customization **********************************************
let playerSettings = (obj) => {
  videos.forEach(video => {
    let progressFilled = video.querySelector('.progress-filled');
    let vid = video.querySelector('video');
    let videoBackground = video.querySelector('.video');
    progressFilled.style.background = obj.progressBar;
    if(obj.autoplay)vid.setAttribute('autoplay',obj.autoplay);
    videoBackground.style.background = obj.backDrop;
  });
}
