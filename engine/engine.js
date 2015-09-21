function Engine (container, songData, songUrl) {
  function createCanvas(name, layer) {
    return $('<canvas>', {
      class: 'game-canvas',
      id: name,
      css: {
        'z-index': layer  
      },
           attr: {
             height: container.height() + 'px',
           width: container.height()*1.333 + 'px'
           }
    });  
  }

  var self = this;
  this.root = container;
  this.songData = songData;
  this.audio = new Audio(songUrl);

  this.currentTime = -1;
  this.c = {};
  this.e = {
    bg: createCanvas('bg', 0),
    ui: createCanvas('ui', 1),
    slider: createCanvas('slider', 2),
    note: createCanvas('note', 3),
    cursorArea: createCanvas('cursor-area', 4)
  };
  console.log(songData);
  this.scale = this.root.height()/384;

  _.forOwn(this.e,function (x) {x.appendTo(self.root);}); 

  //resize
  $(window).resize(function () {
    _.each(self.e, function (v, k) {
      v.attr({
        'height': self.root.height() + 'px',
        'width': self.root.height()*1.333 + 'px'
      });
    }); 
    self.scale = self.root.height()/384;
  });

  //setup
  this.e.bg.css('background-color','#333');

  //get all canvas contexts
  _.each(self.e, function(v, k) {
    self.c[k] = document.getElementById(v.attr('id')).getContext('2d');
  });
  console.log(self.c);
  this.ar = 9;
}

Engine.prototype = {
  maxWidth: 512,
  maxHeight: 384,
  health: 1,
  accuracy: 0.4545,
  drawHealth: function (ctx) {
    var HEALTH_LEN = 220;
    var HEALTH_THICK = 8;

    ctx.save();
    ctx.fillStyle = '#FFF';
    ctx.fillRect(10, 10, HEALTH_LEN*this.health, HEALTH_THICK);  
    ctx.restore();
  },
  drawUIScore: function (ctx) { 
    //draw score
    ctx.font = '25px Nova Square';
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'right';
    ctx.fillText('00100020', 505, 25);

    //percentage
    ctx.font = '15px Nova Square';
    ctx.fillText((this.accuracy*100).toFixed(2) + '%', 505, 40);

    var tempComp = 0.4;
    //completion
    var cLeft = 430;
    var cTop = 35;

    ctx.fillStyle = '#AAA';
    ctx.beginPath();
    ctx.arc(cLeft, cTop, 7, 1.5*Math.PI, 2*Math.PI*tempComp);
    ctx.lineTo(cLeft, cTop);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(cLeft, cTop,7,0,2*Math.PI);
    ctx.moveTo(cLeft,cTop);
    ctx.arc(cLeft,cTop,0.5,0,2*Math.PI);
    ctx.stroke();
  },
  start: function() {
    var self = this;

    //queues for different stages of notes
    self.entranceQueue = {
      start: 0,
      end: 0
    };
    self.playQueue = {
      start: 0,
      end: 0
    };
    self.exitQueue = {
      start: 0,
      end: 0
    };

    self.audio.volume = 0.00;
    self.audio.play();
    self.render();
  },
  render: function () {
    var self = this;
    var noteC = self.c.note;
    var sliderC = self.c.slider;

    _.each(self.c, function(v, k) {
      v.save();
      v.scale(self.scale, self.scale);
    });

    //sets UI layer
    var testSlider = 11;
    self.c.ui.clearRect(0, 0, 512, 384);
    self.drawHealth(self.c.ui);
    self.drawUIScore(self.c.ui);

    var curTime = self.audio.currentTime*1000;
    //console.log(self.entranceQueue);
    //configure entrance queue
    while (true) {
      //console.log('%f %f',self.songData[self.entranceQueue.start].time,curTime);
      if (self.songData[self.entranceQueue.start].time <= curTime) {
        self.entranceQueue.start++;
      } else {
        break;
      }
    }
    while (true) {
      if (self.songData[self.entranceQueue.end].time <= curTime + self.ar * 30) {
        self.entranceQueue.end++;
      } else {
        break;
      }
    }

    //renders entrance
    for (var i = self.entranceQueue.start; i < self.entranceQueue.end; i++) {
      var curNote = self.songData[i];

      if (curNote.sliderType == null) {
        noteC.beginPath();
        noteC.arc(curNote.x, curNote.y, 10, 0, Math.PI);
        noteC.stroke();
      } else {

      }
    }

    /*
    self.c.ui.beginPath();
    self.c.ui.moveTo(self.songData[testSlider].points[0][0].x, self.songData[testSlider].points[0][0].y);
    _.forEach(self.songData[testSlider].points, function(x) {
      self.c.ui.bezierCurveTo(x[1].x, x[1].y, x[2].x, x[2].y, x[3].x, x[3].y);
    });
    
    self.c.ui.stroke();
    var arc = self.songData[14].arc;
    self.c.ui.beginPath();
    self.c.ui.arc(arc.x, arc.y, arc.r, arc.startAngle, arc.endAngle, arc.ccw);
    self.c.ui.stroke();

    _.forEach(self.songData[testSlider].path, function(x) {
      self.c.ui.beginPath();
      self.c.ui.arc(x.x,x.y,2,0,2*Math.PI);
      self.c.ui.stroke();
    });

    _.forEach(self.songData[14].path, function(x) {
      self.c.ui.beginPath();
      self.c.ui.arc(x.x, x.y, 2, 0, 2*Math.PI);
      self.c.ui.stroke();
    });

    self.c.ui.beginPath();
    self.c.ui.moveTo(self.songData[0].points[0].x, self.songData[0].points[0].y);
    self.c.ui.lineTo(self.songData[0].points[1].x, self.songData[0].points[1].y);
    self.c.ui.stroke();

    _.forEach(self.songData[0].path, function(x) {
      self.c.ui.beginPath();
      self.c.ui.arc(x.x, x.y, 2, 0, 2*Math.PI);
      self.c.ui.stroke();
    });
*/
    _.each(self.c, function(v, k) {
      v.restore();
    });
    
    requestAnimationFrame(self.render.bind(self));
  }
};














