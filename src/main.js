/* videojs-offset main */

// Base function.
var vjsoffset = function(options) {
  var Player, start, end;
  Player = this.constructor;
  Player.__super__ = {
    duration: Player.prototype.duration,
    currentTime: Player.prototype.currentTime,
    bufferedPercent: Player.prototype.bufferedPercent,
    remainingTime: Player.prototype.remainingTime
  };
  start = options.start || 0;
  end = options.end || 0;

  Player.prototype.duration = function(){
    if(end > 0) {
      return end - start;
    }
    return Player.__super__.duration.apply(this, arguments) - start;
  };

  Player.prototype.currentTime = function(seconds){
    if(seconds !== undefined){
      return Player.__super__.currentTime.call(this, seconds + start) - start;
    }
    return Player.__super__.currentTime.apply(this, arguments) - start;
  };

  Player.prototype.remainingTime = function(){
    var curr = this.currentTime();
    if(curr < start) {
      curr = 0;
    }
    return this.duration() - curr;
  };

  Player.prototype.startOffset = function(){
    return start;
  };

  Player.prototype.endOffset = function(){
    if(end > 0) {
      return end;
    }
    return this.duration();
  };

  this.on('timeupdate', function(){
    var curr = this.currentTime();
    if(curr < 0){
      this.currentTime(0);
      this.play();
    }
    if(curr > (end-start)) {
      this.currentTime(end-start);
      this.pause();
    }
  });

  return this;

};


// Version.
vjsoffset.VERSION = '0.0.0';


// Export to the root, which is probably `window`.
window.vjsoffset = vjsoffset;
window.videojs.plugin('offset', vjsoffset);
