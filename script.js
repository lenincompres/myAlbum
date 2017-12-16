/**
 * @file handling a playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.2
 **/


(function() {

  "use strict";

  var tracklist = document.querySelector('#tracklist'),
    audio = document.querySelector('#audio'),
    //loader = document.querySelector('#loader'),
    lyricsBox = document.querySelector('#lyrics'),
    video = document.querySelector("#video"),
    stopBtn = document.querySelector('#stop'),
    infoBtn = document.querySelector('#info'),
    closeBtn = document.querySelector('#close');
  var activeSongLink = null;
  var videoH = video.offsetWidth * 9 / 16;

  /* Auxiliary functions */
  function readFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText, true);
        return true;
      } else {
        callback(null, false);
      }
    }
    rawFile.send(null);
  }

  //sets video for css to animate to correct aspect ratio
  function openVideo(src, autoplay) {
    console.log(src);
    if (!src) {
      return;
    }
    if (autoplay) {
      src += (src.indexOf('?') > 0 ? '&' : '?') + "autoplay=1";
    }
    console.log(src);
    video.setAttribute("src", src);
    video.style.height = videoH + 'px';
    window.scrollTo(0, 0);
  }

  function closeVideo() {
    video.style.height = 0;
  }

  /* set up */

  /* populates songs from json file */
  var tracks = [],
    album;
  readFile('album.json', function(data, success) {
    if (success) {
      album = JSON.parse(data);
      document.querySelector('#title').innerHTML = album.title;
      document.querySelector('title').innerHTML = album.title;
      document.querySelector('#notes').innerHTML = album.notes;
      document.querySelector('#copyright').innerHTML = album.copyright;
      openVideo(album.videoIntro);
      setUpTracks();
    } else {
      //unable to load album info
    }
  });

  function setUpTracks() {
    for (let i = 0; i < album.tracks.length; i++) {
      let item = album.tracks[i];
      let line = null;
      if (item.section) {
        let section = document.createElement("h2");
        section.innerHTML = item.section;
        tracklist.append(section);
      }
      item.filename = item.title.toLocaleLowerCase();
      line = document.createElement("li");

      let index = i + 1;
      let info = "";
      if (item.original) {
        info += item.original;
      }
      if (item.cover) {
        info += " (" + item.author + ")";
        line.classList.add("cover");
      }
      line.innerHTML = "<span>" + (index > 9 ? "" : "0") + index + ' - </span><a>' + item.title + "</a><i>" + info + "</i>";
      line.setAttribute("index", index);

      line.addEventListener("click", selectSong);
      //line.classList.add("disabled");
      tracklist.append(line);
    }

    //makes sure the lyrics page has the height of the tracklist
    lyricsBox.style.height = document.querySelector('#tracklist').offsetHeight + 'px';
  }

  function selectSong(e) {
    let songLink = e.currentTarget,
      track = album.tracks[songLink.getAttribute("index") - 1];
    if (track && !songLink.classList.contains('active') && !songLink.classList.contains('disabled')) {

      //selects and updates active song
      if (activeSongLink !== null) {
        activeSongLink.classList.remove('active');
      }
      songLink.classList.add('active');
      activeSongLink = songLink;
      songLink.append(stopBtn);
      stopBtn.classList.remove("hidden");

      //plays song
      audio.pause();
      if (track.video) {
        openVideo(track.video, true);
        audio.classList.add("hidden");
      } else {
        closeVideo();
        audio.src = 'songs/' + track.filename + '.mp3';
        audio.play();
        audio.classList.remove("hidden");
      }

      //loads lyrics
      readFile('lyrics/' + track.filename.replace(/ /g, "%20") + '.html', function(data, success) {
        if (success) {
          let lyrics = lyricsBox.querySelector('div');

          /* set title info */
          lyrics.innerHTML = "<h1>" + track.title + "</h1>";
          if (track.cover) {
            lyrics.innerHTML += "<h2 class='cover'>Original <i>" + track.original + "</i> de <i>" + track.author + "</i></h2>";
            lyrics.innerHTML += "<h2>Traducción y adaptación musical de <a href='http://lenino.net' target='_blank'>Lenino</a><i></h2>";
          } else {
            lyrics.innerHTML += "<h2>Música y letra de <a href='http://lenino.net' target='_blank'>Lenino</a><i></h2>";
          }
          if (track.extra) {
            lyrics.innerHTML += "<h2>" + track.extra + "</h2>";
          }

          lyrics.innerHTML += data;
          songLink.append(infoBtn);
          infoBtn.classList.remove("hidden");
          infoBtn.click();
        } else {
          infoBtn.classList.add("hidden");
          lyricsBox.classList.remove('active');
        }
      });
    }
  }

  /*
    //preloads songs
    $(document).ready(function() {
      let i = 0;
      while (album.tracks[i]) {
        var a = new Audio();
        let n = i;
        a.addEventListener('canplaythrough', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.addEventListener('load', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.preload = 'auto';
        a.src = album.tracks[n];
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
    stopSong();
    openVideo(album.videoIntro);
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
  function stopSong() {
    setTimeout(function() {
      activeSongLink.classList.remove('active');
      activeSongLink = null;
      audio.pause();
      audio.classList.add("hidden");
    }, 10);
    closeBtn.click();
    stopBtn.classList.add("hidden");
    infoBtn.classList.add("hidden");
  }

  function audioEnded() {
    let i = parseInt(activeSongLink.getAttribute("index"));
    if (i < album.tracks.length) {
      tracklist.querySelectorAll("li")[i].click();
    } else {
      stopSong();
      openVideo(album.videoOutro, true);
    }
  }
  audio.addEventListener('ended', audioEnded);

})();
