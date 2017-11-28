/**
 * @file handling a playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.1
 **/

'use strict';

(function() {

  //var audio = document.getElementById('audio');
  var audioFiles = [];
  var tracklist = $('#tracklist li');
  var audioBox = $('#audio').first(),
    audio = audioBox[0],
    loader = $('#loader').first(),
    lyricsBox = $('#lyrics').first(),
    lyrics = $('#lyrics').find('div').first(),
    videoBox = $("#video").first();
  var stopBtn = $('#stop').first(),
    infoBtn = $('#info').first(),
    closeBtn = $('#close').first();
  var activeSong = null;
  var videoH = videoBox.width() * 9 / 16;

  /* set up */

  //sets video for css to animate to correct aspect ratio
  videoBox.attr('height', videoH);

  //makes sure the lyrics page has the height of the tracklist
  lyricsBox.height($('main').height());

  //adds the index number in front of each track on the list
  var index = 1
  tracklist.each(function() {
    let song = $(this);
    let f = 'songs/' + song.find('a').first().text().toLocaleLowerCase() + '.mp3';
    audioFiles.push(f);

    //preps the song link
    song.prepend('<span>' + (index > 9 ? "" : "0") + index + ' - </span>').attr("index", index++);//.addClass("disabled");
  });
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

  tracklist.click(function() {
    let song = $(this);
    if (!song.hasClass('active') && !song.hasClass('disabled')) {

      //selects and updates active song
      if (activeSong !== null) {
        activeSong.removeClass('active');
      }
      activeSong = song.addClass('active').append(stopBtn.detach()).append(infoBtn.detach());
      let title = song.find('a').first().text();

      //plays song
      audio.pause();
      audio.src = audioFiles[activeSong.attr("index") - 1];
      audio.addEventListener('ended', audioEnded);
      audio.play();
      audioBox.show();
      videoBox.attr('height', 0);

      //loads lyrics
      lyrics.load('lyrics/' + title.toLowerCase().replace(/ /g, "%20") + '.html', function(data, status) {
        if (status === 'error') {
          infoBtn.hide();
          lyricsBox.removeClass('active');
        } else {
          infoBtn.click();
        }
      });
    }
  });

  //stops playing the active song
  stopBtn.click(function() {
    videoBox.attr('height', videoH);
    setTimeout(function() {
      activeSong.removeClass('active');
      activeSong = null;
      audio.pause();
      audioBox.hide();
    }, 10);
    closeBtn.click();
  });

  //opens and closes the lyrics pane
  infoBtn.click(function() {
    lyricsBox.addClass('active');
  });
  closeBtn.click(function() {
    lyricsBox.removeClass('active');
  });

  /* events */

  //plays next song when the active one ends
  function audioEnded() {
    let i = parseInt(activeSong.attr("index"));
    if (i < tracklist.length) {
      tracklist.eq(i).click();
    } else {
      //stops audio upon finishing the last song
      stopBtn.click();
    }
  }

})();
