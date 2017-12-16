/**
 * @file handling a playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.2
 **/


(function() {

  "use strict";

  var audioFiles = [];
  var tracklist = document.querySelectorAll('#tracklist li');
  var audio = document.querySelector('#audio'),
    //loader = $('#loader').first(),
    lyricsBox = document.querySelector('#lyrics'),
    videoBox = document.querySelector("#video"),
    stopBtn = document.querySelector('#stop'),
    infoBtn = document.querySelector('#info'),
    closeBtn = document.querySelector('#close');
  var activeSong = null;
  var videoH = videoBox.offsetWidth * 9 / 16;

  /* set up */

  //sets video for css to animate to correct aspect ratio
  videoBox.style.height = videoH + 'px';

  //makes sure the lyrics page has the height of the tracklist
  lyricsBox.style.height = document.querySelector('#tracklist').offsetHeight + 'px';

  //adds the index number in front of each track on the list
  var index = 1;
  for (let i = 0; i < tracklist.length; i++) {
    let song = tracklist[i];
    let f = 'songs/' + song.querySelector('a').innerHTML.toLocaleLowerCase() + '.mp3';
    audioFiles.push(f);

    //preps the song link
    let span = document.createElement("span");
    span.innerHTML = (index > 9 ? "" : "0") + index + ' -';
    song.prepend(span);
    song.setAttribute("index", index++);
    //song.classList.add("disabled");
    song.addEventListener("click", selectSong);
  }

  function selectSong(e) {
    let song = e.target;
    if (!song.classList.contains('active') && !song.classList.contains('disabled')) {

      //selects and updates active song
      if (activeSong !== null) {
        activeSong.classList.remove('active');
      }
      song.classList.add('active');
      activeSong = song;
      song.append(stopBtn);
      song.append(infoBtn);

      //plays song
      audio.pause();
      audio.src = audioFiles[activeSong.getAttribute("index") - 1];
      audio.addEventListener('ended', audioEnded);
      audio.play();
      audio.style.display = "block";
      videoBox.style.height = 0;

      //loads lyrics
      let req = new XMLHttpRequest();
      let filename = song.querySelector('a').innerHTML.toLowerCase().replace(/ /g, "%20");
      req.open('GET', 'lyrics/' + filename + '.html');
      req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
          lyricsBox.querySelector('div').innerHTML = req.responseText;
          infoBtn.style.display = "block";
          infoBtn.click();
        } else {
          infoBtn.style.display = "none";
          lyricsBox.classList.remove('active');
        }
      };
      req.send();
    }
  }

  /*
    //preloads songs
    $(document).ready(function() {
      let i = 0;
      while (audioFiles[i]) {
        var a = new Audio();
        let n = i;
        a.addEventListener('canplaythrough', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.addEventListener('load', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.preload = 'auto';
        a.src = audioFiles[n];
        i++;
      }
    });

    //loading indicator
    function audioLoaded(n) {
      let song = tracklist.eq(n);
      if (song.hasClass('disabled')) {
        let p = (index - 1) / tracklist.length;
        loader.width(100 * p + '%').css('opacity', p);
        tracklist.eq(n).removeClass('disabled');
        index--;
      }
    }*/

  /* controls */

  //stops playing the active song
  stopBtn.addEventListener('click', function() {
    videoBox.style.height = videoH + 'px';
    setTimeout(function() {
      activeSong.classList.remove('active');
      activeSong = null;
      audio.pause();
      audio.style.display = "none";
    }, 10);
    closeBtn.click();
  });

  //opens and closes the lyrics pane
  infoBtn.addEventListener('click', function() {
    lyricsBox.classList.add('active');
  });
  closeBtn.addEventListener("click", function() {
    lyricsBox.classList.remove('active');
  });

  /* events */

  //plays next song when the active one ends
  function audioEnded() {
    let i = parseInt(activeSong.getAttribute("index"));
    if (i < tracklist.length) {
      tracklist.eq(i).click();
    } else {
      //stops audio upon finishing the last song
      stopBtn.click();
    }
  }

})();
