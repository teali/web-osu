//test
$(function () {
  var songUrl = ['https://www.student.cs.uwaterloo.ca/~ml3li/web_osu/m_normal.osu',
  'https://www.student.cs.uwaterloo.ca/~ml3li/web_osu/test.osu'];
  $('.song').click(function () {
      $('.main-container').css( { 'opacity': 0, 'display': 'none'});
      $('body').append('<div class="game">');
      $.get(songUrl[$('.song').index(this)], function (data) {
      var testOsu = new Engine($('.game'), parseNotes(parseOsu(data)), 'https://www.student.cs.uwaterloo.ca/~ml3li/web_osu/test.mp3');
      testOsu.start(function () {
        $('.game').remove();
        $('.main-container').css( { 'opacity': 1, 'display': 'block'});
      });
    });  
  });
});
