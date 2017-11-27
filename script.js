/**
 * @file handling the album playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.1
 **/

'use strict';

(function() {

  var audio = document.getElementById('audio');
  var tracklist = $('#tracklist li');
  var audioContainer = $('#audio').first(),
    lyricsContainer = $('#lyrics').first(),
    videoContainer = $("#video").first();
  var videoH = videoContainer.width() * 9 / 16;
  var stopBtn = $('#stop').first(),
    infoBtn = $('#info').first(),
    closeBtn = $('#close').first();
  var activeSong = null;
  videoContainer.attr('height', videoH);

  /* auxiliary functions */

  var playNext = function() {
    let i = parseInt(activeSong.attr("index"));
    console.log(tracklist.length, i);
    if (i < tracklist.length) {
      tracklist.eq(i).click();
    } else {
      stopBtn.click();
    }
  }
  audio.addEventListener('ended', playNext);

  /* controls */

  var index = 1;
  tracklist.each(function() {
    //adds the index number in front of the track name
    let i = index > 9 ? index : "0" + index;
    let song = $(this);
    song.prepend('<span>' + i + ' - </span>').attr("index", index++)
      .click(function() {
        if (!song.hasClass('active')) {

          //switch active song
          if (activeSong !== null) {
            activeSong.removeClass('active');
          }
          activeSong = song.addClass('active').append(stopBtn.detach());
          let title = song.find('a').first().text();

          //play song
          audio.pause();
          audio.src = 'songs/' + title.toLocaleLowerCase() + '.mp3';
          audio.play();
          audioContainer.show();
          videoContainer.attr('height', 0);

          //load lyrics
          lyricsContainer.find('div').first()
            .load('lyrics/' + title.toLowerCase().replace(/ /g, "%20") + '.html', function(data, status) {
              if (status !== 'error') {
                activeSong.append(infoBtn.detach());
              }
            });
        }
      });
  });

  stopBtn.click(function() {
    videoContainer.attr('height', videoH);
    setTimeout(function() {
      activeSong.removeClass('active');
      activeSong = null;
      audio.removeEventListener('ended', playNext);
      audio.pause();
      audioContainer.hide();
    }, 10);
  });

  infoBtn.click(function() {
    lyricsContainer.addClass('active');
  });

  closeBtn.click(function() {
    lyricsContainer.removeClass('active');
  });

  //make sure the lyrics page has the height of the tracklist
  lyricsContainer.height($('main').height());

})();
