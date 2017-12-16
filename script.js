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
    videoBox = document.querySelector("#video"),
    stopBtn = document.querySelector('#stop'),
    infoBtn = document.querySelector('#info'),
    closeBtn = document.querySelector('#close');
  var tracksArray = [];
  var activeSongLink = null;
  var videoH = videoBox.offsetWidth * 9 / 16;

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

  /* set up */

  /* populates songs from json file */
  var tracks = [];
  readFile('album.json', function(data, success) {
    if (success) {
      let album = JSON.parse(data);
      tracks = album["tracks"];
      setUpTracks();
    } else {
      //unable to load album info
    }
  });

  function setUpTracks() {
    for (let i = 0; i < tracks.length; i++) {
      let item = tracks[i];
      let line = null;
      if (item.label) {
        line = document.createElement("h2");
        line.innerHTML = item.label;
      } else {
        item.filename = item.title.toLocaleLowerCase();
        tracksArray.push(item);
        line = document.createElement("li");

        let index = tracksArray.length;
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
      }
      tracklist.append(line);
    }

    //makes sure the lyrics page has the height of the tracklist
    lyricsBox.style.height = document.querySelector('#tracklist').offsetHeight + 'px';
  }

  //sets video for css to animate to correct aspect ratio
  videoBox.style.height = videoH + 'px';

  function selectSong(e) {
    let songLink = e.currentTarget,
      track = tracksArray[songLink.getAttribute("index") - 1];
    if (track && !songLink.classList.contains('active') && !songLink.classList.contains('disabled')) {

      //selects and updates active song
      if (activeSongLink !== null) {
        activeSongLink.classList.remove('active');
      }
      songLink.classList.add('active');
      activeSongLink = songLink;
      songLink.append(infoBtn); //getting an wierd error
      songLink.append(stopBtn);
      stopBtn.classList.remove("hidden");

      //plays song
      audio.pause();
      audio.src = 'songs/' + track.filename + '.mp3';
      audio.addEventListener('ended', audioEnded);
      audio.play();
      audio.classList.remove("hidden");
      videoBox.style.height = 0;

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
      while (tracksArray[i]) {
        var a = new Audio();
        let n = i;
        a.addEventListener('canplaythrough', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.addEventListener('load', function() {
          audioLoaded(parseInt(n));
        }, false);
        a.preload = 'auto';
        a.src = tracksArray[n];
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
      activeSongLink.classList.remove('active');
      activeSongLink = null;
      audio.pause();
      audio.classList.add("hidden");
    }, 10);
    closeBtn.click();
    stopBtn.classList.add("hidden");
    infoBtn.classList.add("hidden");
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
    let i = parseInt(activeSongLink.getAttribute("index"));
    if (i < tracksArray.length) {
      querySelector("li[index='" + i + "']").click();
    } else {
      stopBtn.click(); //stops after last song
    }
  }

})();
