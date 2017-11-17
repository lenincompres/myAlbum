// JavaScript Document

'use strict';

var audio = document.getElementById('audio');
var currentsong = -1;
$('#tracklist li').each(function () {
	var n = $('#tracklist li').index(this) + 1;
	n = n > 9 ? "" + n : "0" + n;
	$(this).prepend('<span>' + n + ' - </span>');
}).click(function () {
	var index = $('#tracklist li').index(this);
	if (index === currentsong) {
		return;
	}
	var a = $(this).find('a').first();
	playAudio('songs/' + a.text().toLocaleLowerCase() + '.mp3');
	$(this).addClass('active');
	currentsong = index;
	checkLyrics(a.text());
	var alt = a.attr('alt');
	if (alt) {
		a.append('<span>' + alt + '</span>');
	}
});

function stopAudio() {
	$('.active a span').remove();
	$('li.active').removeClass('active');
	audio.removeEventListener('ended', playNext);
	audio.pause();
	$('#audio').hide();
	$("#video").attr('height', videoH);
	setTimeout(function(){openVideo();}, 1000);
}

function playAudio(url) {
	stopAudio();
	audio.src = url;
	$('#audio-container').show();
	audio.addEventListener('ended', playNext);
	audio.play();
	$('#audio').show();
	closeVideo();
}

function playNext() {
	console.log(currentsong);
	$('#tracklist li').eq(currentsong + 1).click();
}

/*  */
function checkLyrics(s) {
	$('li.active').append($('#stop').detach());
	$('#lyrics>div').load('lyrics/' + s.toLowerCase().replace(/ /g, "%20") + '.html', function (data, status) {
		if (status !== 'error') {
			$('li.active').append($('#info').detach());
		}
	});
}

function openLyrics() {
	$('#lyrics').addClass('active');
}

function closeLyrics() {
	$('#lyrics').removeClass('active');
}

$('#stop').click(function () {
	setTimeout(function () {
		stopAudio();
		currentsong = -1;
	}, 10);
});
$('#info').click(openLyrics);
$('#lyrics').append($('#close').detach());
$('#close').click(closeLyrics);

/*  */
var videoH = $('#video').width() * 9 / 16;
openVideo();

function openVideo() {
	if (audio.paused) {
		$("#video").attr('height', videoH);
	}
}

function closeVideo() {
	$("#video").attr('height', 0);
}
