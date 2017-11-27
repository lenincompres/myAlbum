/**
 * @file handling the album playlist
 * @author Lenin Compres <lenincompres@gmail.com>
 * @version 0.1
 **/

'use strict';

(function() {

  /* audio and video functions */

  var audio = document.getElementById('audio');
  var videoH = $('#video').width() * 9 / 16;
	$("#video").attr('height', videoH);

  var stopAudio = function() {
    if (activeSong === null) {
      return;
    }
    activeSong.removeClass('active');
    activeSong = null;
    audio.removeEventListener('ended', playNext);
    audio.pause();
    $('#audio').hide();
    $("#video").attr('height', videoH);
    setTimeout(function() {
			//open video
      $("#video").attr('height', videoH);
    }, 1000);
  }

  var playAudio = function(url) {
    stopAudio();
    audio.src = url;
    $('#audio-container').show();
    audio.addEventListener('ended', playNext);
    audio.play();
    $('#audio').show();
		//close video
	  $("#video").attr('height', 0);
  }

  var playNext = function() {
    $('#tracklist li').eq(activeSong.attr("index")).click();
  }

  /* controls */

  var activeSong = null;
  var index = 1;
  $('#tracklist li').each(function() {
    //adds the index number in front of the track name
    let i = index > 9 ? "" + index : "0" + index;
    $(this).prepend('<span>' + i + ' - </span>').attr("index", index++);
  }).click(function() {
    if (!$(this).hasClass('active')) {
      //play the song
      let a = $(this).find('a').first();
      let t = a.text();
      playAudio('songs/' + t.toLocaleLowerCase() + '.mp3');
      $(this).addClass('active').append($('#stop').detach());
      activeSong = $(this);
      //set lyrics
      $('#lyrics>div').first().load('lyrics/' + t.toLowerCase().replace(/ /g, "%20") + '.html', function(data, status) {
        if (status !== 'error') {
          $('li.active').append($('#info').detach());
        }
      });
    }
  });

  $('#stop').click(function() {
    setTimeout(function() {
      stopAudio();
    }, 10);
  });

  $('#info').click(function() {
    $('#lyrics').addClass('active');
  });

  $('#close').click(function() {
    $('#lyrics').removeClass('active');
  });

  //make sure the lyrics page has the height of the tracklist
  $('#lyrics').height($('main').height());

})();
