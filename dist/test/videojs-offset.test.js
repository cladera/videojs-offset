(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require(1);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"1":1}],3:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var document = _interopDefault(require(2));
var QUnit = _interopDefault((typeof window !== "undefined" ? window['QUnit'] : typeof global !== "undefined" ? global['QUnit'] : null));
var sinon = _interopDefault((typeof window !== "undefined" ? window['sinon'] : typeof global !== "undefined" ? global['sinon'] : null));
var videojs = _interopDefault((typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null));

// Default options for the plugin.
var defaults = {};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Checks whether the clip should be ended.
 *
 * @function onPlayerTimeUpdate
 *
 */
var onPlayerTimeUpdate = function onPlayerTimeUpdate() {
  var curr = this.currentTime();

  if (curr < 0) {
    this.currentTime(0);
    this.play();
  }
  if (this._offsetEnd > 0 && curr > this._offsetEnd - this._offsetStart) {
    this.off('timeupdate', onPlayerTimeUpdate);
    this.pause();
    this.trigger('ended');

    if (!this._restartBeginning) {
      this.currentTime(this._offsetEnd - this._offsetStart);
    } else {
      this.trigger('loadstart');
      this.currentTime(0);
    }
  }
};
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
  player.one('play', function () {
    player.on('timeupdate', onPlayerTimeUpdate);
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
offset.VERSION = '2.0.0-beta.1';

var Player = videojs.getComponent('Player');

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

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"2":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsInRlc3QvcGx1Z2luLnRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ2pCQTs7OztBQUVBLFNBQVMsZUFBVCxDQUEwQixFQUExQixFQUE4QjtBQUFFLFNBQVEsTUFBTyxRQUFPLEVBQVAseUNBQU8sRUFBUCxPQUFjLFFBQXJCLElBQWtDLGFBQWEsRUFBaEQsR0FBc0QsR0FBRyxTQUFILENBQXRELEdBQXNFLEVBQTdFO0FBQWtGOztBQUVsSCxJQUFJLFdBQVcsZ0JBQWdCLFFBQVEsaUJBQVIsQ0FBaEIsQ0FBZjtBQUNBLElBQUksUUFBUSxnQkFBZ0IsUUFBUSxPQUFSLENBQWhCLENBQVo7QUFDQSxJQUFJLFFBQVEsZ0JBQWdCLFFBQVEsT0FBUixDQUFoQixDQUFaO0FBQ0EsSUFBSSxVQUFVLGdCQUFnQixRQUFRLFVBQVIsQ0FBaEIsQ0FBZDs7QUFFQTtBQUNBLElBQU0sV0FBVyxFQUFqQjs7QUFFQTtBQUNBLElBQU0saUJBQWlCLFFBQVEsY0FBUixJQUEwQixRQUFRLE1BQXpEO0FBQ0E7O0FBRUE7Ozs7OztBQU1BLElBQU0scUJBQXFCLFNBQXJCLGtCQUFxQixHQUFXO0FBQ3BDLE1BQU0sT0FBTyxLQUFLLFdBQUwsRUFBYjs7QUFFQSxNQUFJLE9BQU8sQ0FBWCxFQUFjO0FBQ1osU0FBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0EsU0FBSyxJQUFMO0FBQ0Q7QUFDRCxNQUFJLEtBQUssVUFBTCxHQUFrQixDQUFsQixJQUF1QixPQUFRLEtBQUssVUFBTCxHQUFr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QUFOLENBQVcsZ0NBQVgsRUFBNkMsVUFBUyxNQUFULEVBQWlCO0FBQzVELFNBQU8sTUFBUCxDQUFjLENBQWQ7O0FBRUEsU0FBTyxXQUFQLFNBQ1MsT0FBTyxTQUFQLENBQWlCLE1BRDFCLEdBRUUsVUFGRixFQUdFLHNDQUhGOztBQU1BLE9BQUssTUFBTCxDQUFZLE1BQVosQ0FBbUI7QUFDakIsV0FBTyxFQURVO0FBRWpCLFNBQUs7QUFGWSxHQUFuQjs7QUFLQTtBQUNBLE9BQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsQ0FBaEI7O0FBRUEsU0FBTyxFQUFQLENBQ0UsS0FBSyxNQUFMLENBQVksUUFBWixPQUEyQixHQUQ3QixFQUVFLGlFQUZGO0FBSUQsQ0FyQkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIiwidmFyIHRvcExldmVsID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOlxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93IDoge31cbnZhciBtaW5Eb2MgPSByZXF1aXJlKCdtaW4tZG9jdW1lbnQnKTtcblxudmFyIGRvY2N5O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGRvY2N5ID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXTtcblxuICAgIGlmICghZG9jY3kpIHtcbiAgICAgICAgZG9jY3kgPSB0b3BMZXZlbFsnX19HTE9CQUxfRE9DVU1FTlRfQ0FDSEVANCddID0gbWluRG9jO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2NjeTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX2ludGVyb3BEZWZhdWx0IChleCkgeyByZXR1cm4gKGV4ICYmICh0eXBlb2YgZXggPT09ICdvYmplY3QnKSAmJiAnZGVmYXVsdCcgaW4gZXgpID8gZXhbJ2RlZmF1bHQnXSA6IGV4OyB9XG5cbnZhciBkb2N1bWVudCA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCdnbG9iYWwvZG9jdW1lbnQnKSk7XG52YXIgUVVuaXQgPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgncXVuaXQnKSk7XG52YXIgc2lub24gPSBfaW50ZXJvcERlZmF1bHQocmVxdWlyZSgnc2lub24nKSk7XG52YXIgdmlkZW9qcyA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCd2aWRlby5qcycpKTtcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuLy8gQ3Jvc3MtY29tcGF0aWJpbGl0eSBmb3IgVmlkZW8uanMgNSBhbmQgNi5cbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcbi8vIGNvbnN0IGRvbSA9IHZpZGVvanMuZG9tIHx8IHZpZGVvanM7XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGNsaXAgc2hvdWxkIGJlIGVuZGVkLlxuICpcbiAqIEBmdW5jdGlvbiBvblBsYXllclRpbWVVcGRhdGVcbiAqXG4gKi9cbmNvbnN0IG9uUGxheWVyVGltZVVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zdCBjdXJyID0gdGhpcy5jdXJyZW50VGltZSgpO1xuXG4gIGlmIChjdXJyIDwgMCkge1xuICAgIHRoaXMuY3VycmVudFRpbWUoMCk7XG4gICAgdGhpcy5wbGF5KCk7XG4gIH1cbiAgaWYgKHRoaXMuX29mZnNldEVuZCA+IDAgJiYgY3VyciA+ICh0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydCkpIHtcbiAgICB0aGlzLm9mZigndGltZXVwZGF0ZScsIG9uUGxheWVyVGltZVVwZGF0ZSk7XG4gICAgdGhpcy5wYXVzZSgpO1xuICAgIHRoaXMudHJpZ2dlcignZW5kZWQnKTtcblxuICAgIGlmICghdGhpcy5fcmVzdGFydEJlZ2lubmluZykge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSh0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudHJpZ2dlcignbG9hZHN0YXJ0Jyk7XG4gICAgICB0aGlzLmN1cnJlbnRUaW1lKDApO1xuICAgIH1cbiAgfVxufTtcbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqICAgICAgICAgICBBIFZpZGVvLmpzIHBsYXllci5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLm9uZSgncGxheScsICgpID0+IHtcbiAgICBwbGF5ZXIub24oJ3RpbWV1cGRhdGUnLCBvblBsYXllclRpbWVVcGRhdGUpO1xuICB9KTtcbn07XG5cbi8qKlxuICogQSB2aWRlby5qcyBwbHVnaW4uXG4gKlxuICogSW4gdGhlIHBsdWdpbiBmdW5jdGlvbiwgdGhlIHZhbHVlIG9mIGB0aGlzYCBpcyBhIHZpZGVvLmpzIGBQbGF5ZXJgXG4gKiBpbnN0YW5jZS4gWW91IGNhbm5vdCByZWx5IG9uIHRoZSBwbGF5ZXIgYmVpbmcgaW4gYSBcInJlYWR5XCIgc3RhdGUgaGVyZSxcbiAqIGRlcGVuZGluZyBvbiBob3cgdGhlIHBsdWdpbiBpcyBpbnZva2VkLiBUaGlzIG1heSBvciBtYXkgbm90IGJlIGltcG9ydGFudFxuICogdG8geW91OyBpZiBub3QsIHJlbW92ZSB0aGUgd2FpdCBmb3IgXCJyZWFkeVwiIVxuICpcbiAqIEBmdW5jdGlvbiBvZmZzZXRcbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3Qgb2Zmc2V0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgY29uc3QgUGxheWVyID0gdGhpcy5jb25zdHJ1Y3RvcjtcblxuICB0aGlzLl9vZmZzZXRTdGFydCA9IG9wdGlvbnMuc3RhcnQgfHwgMDtcbiAgdGhpcy5fb2Zmc2V0RW5kID0gb3B0aW9ucy5lbmQgfHwgMDtcbiAgdGhpcy5fcmVzdGFydEJlZ2lubmluZyA9IG9wdGlvbnMucmVzdGFydF9iZWdpbm5pbmcgfHwgZmFsc2U7XG5cbiAgaWYgKCFQbGF5ZXIuX19zdXBlcl9fIHx8ICFQbGF5ZXIuX19zdXBlcl9fLl9fb2Zmc2V0SW5pdCkge1xuICAgIFBsYXllci5fX3N1cGVyX18gPSB7XG4gICAgICBfX29mZnNldEluaXQ6IHRydWUsXG4gICAgICBkdXJhdGlvbjogUGxheWVyLnByb3RvdHlwZS5kdXJhdGlvbixcbiAgICAgIGN1cnJlbnRUaW1lOiBQbGF5ZXIucHJvdG90eXBlLmN1cnJlbnRUaW1lLFxuICAgICAgYnVmZmVyZWRQZXJjZW50OiBQbGF5ZXIucHJvdG90eXBlLmJ1ZmZlcmVkUGVyY2VudCxcbiAgICAgIHJlbWFpbmluZ1RpbWU6IFBsYXllci5wcm90b3R5cGUucmVtYWluaW5nVGltZVxuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLmR1cmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0RW5kIC0gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gUGxheWVyLl9fc3VwZXJfXy5kdXJhdGlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIC0gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuY3VycmVudFRpbWUgPSBmdW5jdGlvbihzZWNvbmRzKSB7XG4gICAgICBpZiAoc2Vjb25kcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmN1cnJlbnRUaW1lXG4gICAgICAgICAgLmNhbGwodGhpcywgc2Vjb25kcyArIHRoaXMuX29mZnNldFN0YXJ0KSAtIHRoaXMuX29mZnNldFN0YXJ0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY3VycmVudFRpbWVcbiAgICAgICAgLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgICAgaWYgKGN1cnIgPCB0aGlzLl9vZmZzZXRTdGFydCkge1xuICAgICAgICBjdXJyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uKCkgLSBjdXJyO1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLnN0YXJ0T2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZW5kT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0RW5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24oKTtcbiAgICB9O1xuICB9XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnJlZ2lzdGVyUGx1Z2luKCdvZmZzZXQnLCBvZmZzZXQpO1xuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5vZmZzZXQuVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbmNvbnN0IFBsYXllciA9IHZpZGVvanMuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKTtcblxuUVVuaXQudGVzdCgndGhlIGVudmlyb25tZW50IGlzIHNhbmUnLCBmdW5jdGlvbihhc3NlcnQpIHtcbiAgYXNzZXJ0LnN0cmljdEVxdWFsKHR5cGVvZiBBcnJheS5pc0FycmF5LCAnZnVuY3Rpb24nLCAnZXM1IGV4aXN0cycpO1xuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIHNpbm9uLCAnb2JqZWN0JywgJ3Npbm9uIGV4aXN0cycpO1xuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIHZpZGVvanMsICdmdW5jdGlvbicsICd2aWRlb2pzIGV4aXN0cycpO1xuICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9mZnNldCwgJ2Z1bmN0aW9uJywgJ3BsdWdpbiBpcyBhIGZ1bmN0aW9uJyk7XG59KTtcblxuUVVuaXQubW9kdWxlKCd2aWRlb2pzLW9mZnNldCcsIHtcblxuICBiZWZvcmVFYWNoKCkge1xuXG4gICAgLy8gTW9jayB0aGUgZW52aXJvbm1lbnQncyB0aW1lcnMgYmVjYXVzZSBjZXJ0YWluIHRoaW5ncyAtIHBhcnRpY3VsYXJseVxuICAgIC8vIHBsYXllciByZWFkaW5lc3MgLSBhcmUgYXN5bmNocm9ub3VzIGluIHZpZGVvLmpzIDUuIFRoaXMgTVVTVCBjb21lXG4gICAgLy8gYmVmb3JlIGFueSBwbGF5ZXIgaXMgY3JlYXRlZDsgb3RoZXJ3aXNlLCB0aW1lcnMgY291bGQgZ2V0IGNyZWF0ZWRcbiAgICAvLyB3aXRoIHRoZSBhY3R1YWwgdGltZXIgbWV0aG9kcyFcbiAgICB0aGlzLmNsb2NrID0gc2lub24udXNlRmFrZVRpbWVycygpO1xuXG4gICAgdGhpcy5maXh0dXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F1bml0LWZpeHR1cmUnKTtcbiAgICB0aGlzLnZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB0aGlzLmZpeHR1cmUuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XG4gICAgdGhpcy5wbGF5ZXIgPSB2aWRlb2pzKHRoaXMudmlkZW8pO1xuICB9LFxuXG4gIGFmdGVyRWFjaCgpIHtcbiAgICB0aGlzLnBsYXllci5kaXNwb3NlKCk7XG4gICAgdGhpcy5jbG9jay5yZXN0b3JlKCk7XG4gIH1cbn0pO1xuXG5RVW5pdC50ZXN0KCdyZWdpc3RlcnMgaXRzZWxmIHdpdGggdmlkZW8uanMnLCBmdW5jdGlvbihhc3NlcnQpIHtcbiAgYXNzZXJ0LmV4cGVjdCgyKTtcblxuICBhc3NlcnQuc3RyaWN0RXF1YWwoXG4gICAgdHlwZW9mIFBsYXllci5wcm90b3R5cGUub2Zmc2V0LFxuICAgICdmdW5jdGlvbicsXG4gICAgJ3ZpZGVvanMtb2Zmc2V0IHBsdWdpbiB3YXMgcmVnaXN0ZXJlZCdcbiAgKTtcblxuICB0aGlzLnBsYXllci5vZmZzZXQoe1xuICAgIHN0YXJ0OiAxMCxcbiAgICBlbmQ6IDMwMFxuICB9KTtcblxuICAvLyBUaWNrIHRoZSBjbG9jayBmb3J3YXJkIGVub3VnaCB0byB0cmlnZ2VyIHRoZSBwbGF5ZXIgdG8gYmUgXCJyZWFkeVwiLlxuICB0aGlzLmNsb2NrLnRpY2soMSk7XG5cbiAgYXNzZXJ0Lm9rKFxuICAgIHRoaXMucGxheWVyLmR1cmF0aW9uKCkgPT09IDI5MCxcbiAgICAndGhlIHBsdWdpbiBhbHRlcnMgdmlkZW8gZHVyYXRpb24gYWRqdXN0aW5nIHRvIHN0YXJ0fGVuZCBvcHRpb25zJ1xuICApO1xufSk7XG4iXX0=
