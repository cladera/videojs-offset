(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var global = require(1);
var QUnit = _interopDefault((typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null));
var sinon = _interopDefault((typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null));
var videojs = _interopDefault((typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null));

// Default options for the plugin.
var defaults = {};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player.
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var onPlayerReady = function onPlayerReady(player, options) {
  player.on('timeupdate', function () {
    var curr = this.currentTime();

    if (curr < 0) {
      this.currentTime(0);
      this.play();
    }
    if (this._offsetEnd > 0 && curr > this._offsetEnd - this._offsetStart) {
      this.pause();
      if (!this._restartBeginning) {
        this.currentTime(this._offsetEnd - this._offsetStart);
      } else {
        this.trigger('loadstart');
        this.currentTime(0);
      }
    }
  });
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function offset
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var offset = function offset(options) {
  var _this = this;

  options = options || {};
  var Player = this.constructor;

  this._offsetStart = options.start || 0;
  this._offsetEnd = options.end || 0;
  this._restartBeginning = options.restart_beginning || false;

  if (!Player.__super__ || !Player.__super__.__offsetInit) {
    Player.__super__ = {
      __offsetInit: true,
      duration: Player.prototype.duration,
      currentTime: Player.prototype.currentTime,
      bufferedPercent: Player.prototype.bufferedPercent,
      remainingTime: Player.prototype.remainingTime
    };

    Player.prototype.duration = function () {
      if (this._offsetEnd > 0) {
        return this._offsetEnd - this._offsetStart;
      }
      return Player.__super__.duration.apply(this, arguments) - this._offsetStart;
    };

    Player.prototype.currentTime = function (seconds) {
      if (seconds !== undefined) {
        return Player.__super__.currentTime.call(this, seconds + this._offsetStart) - this._offsetStart;
      }
      return Player.__super__.currentTime.apply(this, arguments) - this._offsetStart;
    };

    Player.prototype.remainingTime = function () {
      var curr = this.currentTime();

      if (curr < this._offsetStart) {
        curr = 0;
      }
      return this.duration() - curr;
    };

    Player.prototype.startOffset = function () {
      return this._offsetStart;
    };

    Player.prototype.endOffset = function () {
      if (this._offsetEnd > 0) {
        return this._offsetEnd;
      }
      return this.duration();
    };
  }

  this.ready(function () {
    onPlayerReady(_this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('offset', offset);
// Include the version number.
offset.VERSION = '2.0.0-beta.0';

var Player = videojs.getComponent('Player');

QUnit.module('sanity tests');

QUnit.test('the environment is sane', function (assert) {
  assert.strictEqual(_typeof(Array.isArray), 'function', 'es5 exists');
  assert.strictEqual(typeof sinon === 'undefined' ? 'undefined' : _typeof(sinon), 'object', 'sinon exists');
  assert.strictEqual(typeof videojs === 'undefined' ? 'undefined' : _typeof(videojs), 'function', 'videojs exists');
  assert.strictEqual(typeof offset === 'undefined' ? 'undefined' : _typeof(offset), 'function', 'plugin is a function');
});

QUnit.module('videojs-offset', {
  beforeEach: function beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = global.document.getElementById('qunit-fixture');
    this.video = global.document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
  },
  afterEach: function afterEach() {
    this.player.dispose();
    this.clock.restore();
  }
});

QUnit.test('registers itself with video.js', function (assert) {
  assert.expect(2);

  assert.strictEqual(_typeof(Player.prototype.offset), 'function', 'videojs-offset plugin was registered');

  this.player.offset({
    start: 10,
    end: 300
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(this.player.duration() === 290, 'the plugin alters video duration adjusting to start|end options');
});

},{"1":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZ2xvYmFsL3dpbmRvdy5qcyIsInRlc3QvaW5kZXgudGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBOzs7O0FBRUEsU0FBUyxlQUFULENBQTBCLEVBQTFCLEVBQThCO0FBQUUsU0FBUSxNQUFPLFFBQU8sRUFBUCx5Q0FBTyxFQUFQLE9BQWMsUUFBckIsSUFBa0MsYUFBYSxFQUFoRCxHQUFzRCxHQUFHLFNBQUgsQ0FBdEQsR0FBc0UsRUFBN0U7QUFBa0Y7O0FBRWxILElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBYjtBQUNBLElBQUksUUFBUSxnQkFBZ0IsUUFBUSxTQUFSLENBQWhCLENBQVo7QUFDQSxJQUFJLFFBQVEsZ0JBQWdCLFFBQVEsT0FBUixDQUFoQixDQUFaO0FBQ0EsSUFBSSxVQUFVLGdCQUFnQixRQUFRLFVBQVIsQ0FBaEIsQ0FBZDs7QUFFQTtBQUNBLElBQU0sV0FBVyxFQUFqQjs7QUFFQTtBQUNBLElBQU0saUJBQWlCLFFBQVEsY0FBUixJQUEwQixRQUFRLE1BQXpEO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFDLE1BQUQsRUFBUyxPQUFULEVBQXFCO0FBQ3pDLFNBQU8sRUFBUCxDQUFVLFlBQVYsRUFBd0IsWUFBVztBQUNqQyxRQUFNLE9BQU8sS0FBSyxXQUFMLEVBQWI7O0FBRUEsUUFBSSxPQUFPLENBQVgsRUFBYztBQUNaLFdBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBLFdBQUssSUFBTDtBQUNEO0FBQ0QsUUFBSSxLQUFLLFVBQUwsR0FBa0IsQ0FBbEIsSUFBdUIsT0FBUSxLQUFLLFVBQUwsR0FBa0IsS0FBSyxZQUExRCxFQUF5RTtBQUN2RSxXQUFLLEtBQUw7QUFDQSxV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SyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFoQjs7QUFFQSxTQUFPLEVBQVAsQ0FDRSxLQUFLLE1BQUwsQ0FBWSxRQUFaLE9BQTJCLEdBRDdCLEVBRUUsaUVBRkY7QUFJRCxDQXJCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWw7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiKXtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG59IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wRGVmYXVsdCAoZXgpIHsgcmV0dXJuIChleCAmJiAodHlwZW9mIGV4ID09PSAnb2JqZWN0JykgJiYgJ2RlZmF1bHQnIGluIGV4KSA/IGV4WydkZWZhdWx0J10gOiBleDsgfVxuXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnZ2xvYmFsJyk7XG52YXIgUVVuaXQgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgncXVuaXRqcycpKTtcbnZhciBzaW5vbiA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdzaW5vbicpKTtcbnZhciB2aWRlb2pzID0gX2ludGVyb3BEZWZhdWx0KHJlcXVpcmUoJ3ZpZGVvLmpzJykpO1xuXG4vLyBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBwbHVnaW4uXG5jb25zdCBkZWZhdWx0cyA9IHt9O1xuXG4vLyBDcm9zcy1jb21wYXRpYmlsaXR5IGZvciBWaWRlby5qcyA1IGFuZCA2LlxuY29uc3QgcmVnaXN0ZXJQbHVnaW4gPSB2aWRlb2pzLnJlZ2lzdGVyUGx1Z2luIHx8IHZpZGVvanMucGx1Z2luO1xuLy8gY29uc3QgZG9tID0gdmlkZW9qcy5kb20gfHwgdmlkZW9qcztcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5LlxuICpcbiAqIFRoaXMgaXMgYSBncmVhdCBwbGFjZSBmb3IgeW91ciBwbHVnaW4gdG8gaW5pdGlhbGl6ZSBpdHNlbGYuIFdoZW4gdGhpc1xuICogZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgcGxheWVyIHdpbGwgaGF2ZSBpdHMgRE9NIGFuZCBjaGlsZCBjb21wb25lbnRzXG4gKiBpbiBwbGFjZS5cbiAqXG4gKiBAZnVuY3Rpb24gb25QbGF5ZXJSZWFkeVxuICogQHBhcmFtICAgIHtQbGF5ZXJ9IHBsYXllclxuICogICAgICAgICAgIEEgVmlkZW8uanMgcGxheWVyLlxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBvblBsYXllclJlYWR5ID0gKHBsYXllciwgb3B0aW9ucykgPT4ge1xuICBwbGF5ZXIub24oJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjdXJyID0gdGhpcy5jdXJyZW50VGltZSgpO1xuXG4gICAgaWYgKGN1cnIgPCAwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRUaW1lKDApO1xuICAgICAgdGhpcy5wbGF5KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9vZmZzZXRFbmQgPiAwICYmIGN1cnIgPiAodGhpcy5fb2Zmc2V0RW5kIC0gdGhpcy5fb2Zmc2V0U3RhcnQpKSB7XG4gICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICBpZiAoIXRoaXMuX3Jlc3RhcnRCZWdpbm5pbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSh0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ2xvYWRzdGFydCcpO1xuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lKDApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIEEgdmlkZW8uanMgcGx1Z2luLlxuICpcbiAqIEluIHRoZSBwbHVnaW4gZnVuY3Rpb24sIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaXMgYSB2aWRlby5qcyBgUGxheWVyYFxuICogaW5zdGFuY2UuIFlvdSBjYW5ub3QgcmVseSBvbiB0aGUgcGxheWVyIGJlaW5nIGluIGEgXCJyZWFkeVwiIHN0YXRlIGhlcmUsXG4gKiBkZXBlbmRpbmcgb24gaG93IHRoZSBwbHVnaW4gaXMgaW52b2tlZC4gVGhpcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBvcnRhbnRcbiAqIHRvIHlvdTsgaWYgbm90LCByZW1vdmUgdGhlIHdhaXQgZm9yIFwicmVhZHlcIiFcbiAqXG4gKiBAZnVuY3Rpb24gb2Zmc2V0XG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IG9mZnNldCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGNvbnN0IFBsYXllciA9IHRoaXMuY29uc3RydWN0b3I7XG5cbiAgdGhpcy5fb2Zmc2V0U3RhcnQgPSBvcHRpb25zLnN0YXJ0IHx8IDA7XG4gIHRoaXMuX29mZnNldEVuZCA9IG9wdGlvbnMuZW5kIHx8IDA7XG4gIHRoaXMuX3Jlc3RhcnRCZWdpbm5pbmcgPSBvcHRpb25zLnJlc3RhcnRfYmVnaW5uaW5nIHx8IGZhbHNlO1xuXG4gIGlmICghUGxheWVyLl9fc3VwZXJfXyB8fCAhUGxheWVyLl9fc3VwZXJfXy5fX29mZnNldEluaXQpIHtcbiAgICBQbGF5ZXIuX19zdXBlcl9fID0ge1xuICAgICAgX19vZmZzZXRJbml0OiB0cnVlLFxuICAgICAgZHVyYXRpb246IFBsYXllci5wcm90b3R5cGUuZHVyYXRpb24sXG4gICAgICBjdXJyZW50VGltZTogUGxheWVyLnByb3RvdHlwZS5jdXJyZW50VGltZSxcbiAgICAgIGJ1ZmZlcmVkUGVyY2VudDogUGxheWVyLnByb3RvdHlwZS5idWZmZXJlZFBlcmNlbnQsXG4gICAgICByZW1haW5pbmdUaW1lOiBQbGF5ZXIucHJvdG90eXBlLnJlbWFpbmluZ1RpbWVcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5kdXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX29mZnNldEVuZCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldEVuZCAtIHRoaXMuX29mZnNldFN0YXJ0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uZHVyYXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSAtIHRoaXMuX29mZnNldFN0YXJ0O1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLmN1cnJlbnRUaW1lID0gZnVuY3Rpb24oc2Vjb25kcykge1xuICAgICAgaWYgKHNlY29uZHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gUGxheWVyLl9fc3VwZXJfXy5jdXJyZW50VGltZVxuICAgICAgICAgICAgLmNhbGwodGhpcywgc2Vjb25kcyArIHRoaXMuX29mZnNldFN0YXJ0KSAtIHRoaXMuX29mZnNldFN0YXJ0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY3VycmVudFRpbWVcbiAgICAgICAgICAuYXBwbHkodGhpcywgYXJndW1lbnRzKSAtIHRoaXMuX29mZnNldFN0YXJ0O1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLnJlbWFpbmluZ1RpbWUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjdXJyID0gdGhpcy5jdXJyZW50VGltZSgpO1xuXG4gICAgICBpZiAoY3VyciA8IHRoaXMuX29mZnNldFN0YXJ0KSB7XG4gICAgICAgIGN1cnIgPSAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24oKSAtIGN1cnI7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuc3RhcnRPZmZzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5lbmRPZmZzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9vZmZzZXRFbmQgPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRFbmQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5kdXJhdGlvbigpO1xuICAgIH07XG4gIH1cblxuICB0aGlzLnJlYWR5KCgpID0+IHtcbiAgICBvblBsYXllclJlYWR5KHRoaXMsIHZpZGVvanMubWVyZ2VPcHRpb25zKGRlZmF1bHRzLCBvcHRpb25zKSk7XG4gIH0pO1xufTtcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxucmVnaXN0ZXJQbHVnaW4oJ29mZnNldCcsIG9mZnNldCk7XG4vLyBJbmNsdWRlIHRoZSB2ZXJzaW9uIG51bWJlci5cbm9mZnNldC5WRVJTSU9OID0gJ19fVkVSU0lPTl9fJztcblxuY29uc3QgUGxheWVyID0gdmlkZW9qcy5nZXRDb21wb25lbnQoJ1BsYXllcicpO1xuXG5RVW5pdC5tb2R1bGUoJ3Nhbml0eSB0ZXN0cycpO1xuXG5RVW5pdC50ZXN0KCd0aGUgZW52aXJvbm1lbnQgaXMgc2FuZScsIGZ1bmN0aW9uKGFzc2VydCkge1xuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIEFycmF5LmlzQXJyYXksICdmdW5jdGlvbicsICdlczUgZXhpc3RzJyk7XG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygc2lub24sICdvYmplY3QnLCAnc2lub24gZXhpc3RzJyk7XG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2YgdmlkZW9qcywgJ2Z1bmN0aW9uJywgJ3ZpZGVvanMgZXhpc3RzJyk7XG4gIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygb2Zmc2V0LCAnZnVuY3Rpb24nLCAncGx1Z2luIGlzIGEgZnVuY3Rpb24nKTtcbn0pO1xuXG5RVW5pdC5tb2R1bGUoJ3ZpZGVvanMtb2Zmc2V0Jywge1xuXG4gIGJlZm9yZUVhY2goKSB7XG5cbiAgICAvLyBNb2NrIHRoZSBlbnZpcm9ubWVudCdzIHRpbWVycyBiZWNhdXNlIGNlcnRhaW4gdGhpbmdzIC0gcGFydGljdWxhcmx5XG4gICAgLy8gcGxheWVyIHJlYWRpbmVzcyAtIGFyZSBhc3luY2hyb25vdXMgaW4gdmlkZW8uanMgNS4gVGhpcyBNVVNUIGNvbWVcbiAgICAvLyBiZWZvcmUgYW55IHBsYXllciBpcyBjcmVhdGVkOyBvdGhlcndpc2UsIHRpbWVycyBjb3VsZCBnZXQgY3JlYXRlZFxuICAgIC8vIHdpdGggdGhlIGFjdHVhbCB0aW1lciBtZXRob2RzIVxuICAgIHRoaXMuY2xvY2sgPSBzaW5vbi51c2VGYWtlVGltZXJzKCk7XG5cbiAgICB0aGlzLmZpeHR1cmUgPSBnbG9iYWwuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1bml0LWZpeHR1cmUnKTtcbiAgICB0aGlzLnZpZGVvID0gZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdGhpcy5maXh0dXJlLmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xuICAgIHRoaXMucGxheWVyID0gdmlkZW9qcyh0aGlzLnZpZGVvKTtcbiAgfSxcblxuICBhZnRlckVhY2goKSB7XG4gICAgdGhpcy5wbGF5ZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuY2xvY2sucmVzdG9yZSgpO1xuICB9XG59KTtcblxuUVVuaXQudGVzdCgncmVnaXN0ZXJzIGl0c2VsZiB3aXRoIHZpZGVvLmpzJywgZnVuY3Rpb24oYXNzZXJ0KSB7XG4gIGFzc2VydC5leHBlY3QoMik7XG5cbiAgYXNzZXJ0LnN0cmljdEVxdWFsKFxuICAgIHR5cGVvZiBQbGF5ZXIucHJvdG90eXBlLm9mZnNldCxcbiAgICAnZnVuY3Rpb24nLFxuICAgICd2aWRlb2pzLW9mZnNldCBwbHVnaW4gd2FzIHJlZ2lzdGVyZWQnXG4gICk7XG5cbiAgdGhpcy5wbGF5ZXIub2Zmc2V0KHtcbiAgICBzdGFydDogMTAsXG4gICAgZW5kOiAzMDBcbiAgfSk7XG5cbiAgLy8gVGljayB0aGUgY2xvY2sgZm9yd2FyZCBlbm91Z2ggdG8gdHJpZ2dlciB0aGUgcGxheWVyIHRvIGJlIFwicmVhZHlcIi5cbiAgdGhpcy5jbG9jay50aWNrKDEpO1xuXG4gIGFzc2VydC5vayhcbiAgICB0aGlzLnBsYXllci5kdXJhdGlvbigpID09PSAyOTAsXG4gICAgJ3RoZSBwbHVnaW4gYWx0ZXJzIHZpZGVvIGR1cmF0aW9uIGFkanVzdGluZyB0byBzdGFydHxlbmQgb3B0aW9ucydcbiAgKTtcbn0pO1xuIl19
