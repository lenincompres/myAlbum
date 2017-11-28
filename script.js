/**
 * @file handling a playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.1
 **/

'use strict';

(function() {

  var audio = document.getElementById('audio');
  var tracklist = $('#tracklist li');
  var audioBox = $('#audio').first(),
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
  let i = 1
  tracklist.each(function() {
    $(this).prepend('<span>' + (i > 9 ? "" : "0") + i++ + ' - </span>').attr("index", i);
  });

  /* controls */

  tracklist.click(function() {
    let song = $(this);
    if (!song.hasClass('active')) {

      //selects and updates active song
      if (activeSong !== null) {
        activeSong.removeClass('active');
      }
      activeSong = song.addClass('active').append(stopBtn.detach());
      let title = song.find('a').first().text();

      //plays song
      audio.pause();
      audio.src = 'songs/' + title.toLocaleLowerCase() + '.mp3';
      audio.play();
      audioBox.show();
      videoBox.attr('height', 0);

      //loads lyrics
      lyrics.load('lyrics/' + title.toLowerCase().replace(/ /g, "%20") + '.html', function(data, status) {
          if (status !== 'error') {
            activeSong.append(infoBtn.detach());
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
  audio.addEventListener('ended', function() {
    let i = parseInt(activeSong.attr("index"));
    if (i < tracklist.length) {
      tracklist.eq(i).click();
    } else {
      //stops audio upon finishing the last song
      stopBtn.click();
    }
  });

})();
