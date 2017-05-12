(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _index = require(2);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

QUnit.module("browserify require"); /**
                                     * browserify test 
                                     */

QUnit.test("videojs-offset should be requireable via browserify", function (assert) {
  assert.ok(_index2["default"], "videojs-offset is required properly");
});

},{"2":2}],2:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Default options for the plugin.
var defaults = {};

// Cross-compatibility for Video.js 5 and 6.
var registerPlugin = _video2['default'].registerPlugin || _video2['default'].plugin;
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
    onPlayerReady(_this, _video2['default'].mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('offset', offset);
// Include the version number.
offset.VERSION = '2.0.0-beta.0';

exports['default'] = offset;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L3Rlc3QvYnJvd3NlcmlmeS5zdGFydC5qcyIsInNyYy9qcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7OztBQUVBLE1BQU0sTUFBTixDQUFhLG9CQUFiLEUsQ0FMQTs7OztBQU1BLE1BQU0sSUFBTixDQUFXLHFEQUFYLEVBQWtFLFVBQUMsTUFBRCxFQUFZO0FBQzVFLFNBQU8sRUFBUCxxQkFBZSxxQ0FBZjtBQUNELENBRkQ7Ozs7Ozs7O0FDTkE7Ozs7OztBQUVBO0FBQ0EsSUFBTSxXQUFXLEVBQWpCOztBQUVBO0FBQ0EsSUFBTSxpQkFBaUIsbUJBQVEsY0FBUixJQUEwQixtQkFBUSxNQUF6RDtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FBYUEsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFxQjtBQUN6QyxTQUFPLEVBQVAsQ0FBVSxZQUFWLEVBQXdCLFlBQVc7QUFDakMsUUFBTSxPQUFPLEtBQUssV0FBTCxFQUFiOztBQUVBLFFBQUksT0FBTyxDQUFYLEVBQWM7QUFDWixXQUFLLFdBQUwsQ0FBaUIsQ0FBakI7QUFDQSxXQUFLLElBQUw7QUFDRDtBQUNELFFBQUksS0FBSyxVQUFMLEdBQWtCLENBQWxCLElBQXVCLE9BQVEsS0FBSyxVQUFMLEdBQWtCLEtBQUssWUFBMUQsRUFBeUU7QUFDdkUsV0FBSyxLQUFMO0FBQ0EsVUFBSSxDQUFDLEtBQUssaUJBQVYsRUFBNkI7QUFDM0IsYUFBSyxXQUFMLENBQWlCLEtBQUssVUFBTCxHQUFrQixLQUFLLFlBQXhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxPQUFMLENBQWEsV0FBYjtBQUNBLGFBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNEO0FBQ0Y7QUFDRixHQWhCRDtBQWlCRCxDQWxCRDs7QUFvQkE7Ozs7Ozs7Ozs7OztBQVlBLElBQU0sU0FBUyxTQUFULE1BQVMsQ0FBUyxPQUFULEVBQWtCO0FBQUE7O0FBQy9CLFlBQVUsV0FBVyxFQUFyQjtBQUNBLE1BQU0sU0FBUyxLQUFLLFdBQXBCOztBQUVBLE9BQUssWUFBTCxHQUFvQixRQUFRLEtBQVIsSUFBaUIsQ0FBckM7QUFDQSxPQUFLLFVBQUwsR0FBa0IsUUFBUSxHQUFSLElBQWUsQ0FBakM7QUFDQSxPQUFLLGlCQUFMLEdBQXlCLFFBQVEsaUJBQVIsSUFBNkIsS0FBdEQ7O0FBRUEsTUFBSSxDQUFDLE9BQU8sU0FBUixJQUFxQixDQUFDLE9BQU8sU0FBUCxDQUFpQixZQUEzQyxFQUF5RDtBQUN2RCxXQUFPLFNBQVAsR0FBbUI7QUFDakIsb0JBQWMsSUFERztBQUVqQixnQkFBVSxPQUFPLFNBQVAsQ0FBaUIsUUFGVjtBQUdqQixtQkFBYSxPQUFPLFNBQVAsQ0FBaUIsV0FIYjtBQUlqQix1QkFBaUIsT0FBTyxTQUFQLENBQWlCLGVBSmpCO0FBS2pCLHFCQUFlLE9BQU8sU0FBUCxDQUFpQjtBQUxmLEtBQW5COztBQVFBLFdBQU8sU0FBUCxDQUFpQixRQUFqQixHQUE0QixZQUFXO0FBQ3JDLFVBQUksS0FBSyxVQUFMLEdBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGVBQU8sS0FBSyxVQUFMLEdBQWtCLEtBQUssWUFBOUI7QUFDRDtBQUNELGFBQU8sT0FBTyxTQUFQLENBQWlCLFFBQWpCLENBQTBCLEtBQTFCLENBQWdDLElBQWhDLEVBQXNDLFNBQXRDLElBQW1ELEtBQUssWUFBL0Q7QUFDRCxLQUxEOztBQU9BLFdBQU8sU0FBUCxDQUFpQixXQUFqQixHQUErQixVQUFTLE9BQVQsRUFBa0I7QUFDL0MsVUFBSSxZQUFZLFNBQWhCLEVBQTJCO0FBQ3pCLGVBQU8sT0FBTyxTQUFQLENBQWlCLFdBQWpCLENBQ0YsSUFERSxDQUNHLElBREgsRUFDUyxVQUFVLEtBQUssWUFEeEIsSUFDd0MsS0FBSyxZQURwRDtBQUVEO0FBQ0QsYUFBTyxPQUFPLFNBQVAsQ0FBaUIsV0FBakIsQ0FDRixLQURFLENBQ0ksSUFESixFQUNVLFNBRFYsSUFDdUIsS0FBSyxZQURuQztBQUVELEtBUEQ7O0FBU0EsV0FBTyxTQUFQLENBQWlCLGFBQWpCLEdBQWlDLFlBQVc7QUFDMUMsVUFBSSxPQUFPLEtBQUssV0FBTCxFQUFYOztBQUVBLFVBQUksT0FBTyxLQUFLLFlBQWhCLEVBQThCO0FBQzVCLGVBQU8sQ0FBUDtBQUNEO0FBQ0QsYUFBTyxLQUFLLFFBQUwsS0FBa0IsSUFBekI7QUFDRCxLQVBEOztBQVNBLFdBQU8sU0FBUCxDQUFpQixXQUFqQixHQUErQixZQUFXO0FBQ3hDLGFBQU8sS0FBSyxZQUFaO0FBQ0QsS0FGRDs7QUFJQSxXQUFPLFNBQVAsQ0FBaUIsU0FBakIsR0FBNkIsWUFBVztBQUN0QyxVQUFJLEtBQUssVUFBTCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixlQUFPLEtBQUssVUFBWjtBQUNEO0FBQ0QsYUFBTyxLQUFLLFFBQUwsRUFBUDtBQUNELEtBTEQ7QUFNRDs7QUFFRCxPQUFLLEtBQUwsQ0FBVyxZQUFNO0FBQ2YseUJBQW9CLG1CQUFRLFlBQVIsQ0FBcUIsUUFBckIsRUFBK0IsT0FBL0IsQ0FBcEI7QUFDRCxHQUZEO0FBR0QsQ0F6REQ7O0FBMkRBO0FBQ0EsZUFBZSxRQUFmLEVBQXlCLE1BQXpCO0FBQ0E7QUFDQSxPQUFPLE9BQVAsR0FBaUIsYUFBakI7O3FCQUVlLE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBicm93c2VyaWZ5IHRlc3QgXG4gKi9cbmltcG9ydCBwa2cgZnJvbSBcIi4uLy4uL3NyYy9qcy9pbmRleC5qc1wiO1xuXG5RVW5pdC5tb2R1bGUoXCJicm93c2VyaWZ5IHJlcXVpcmVcIik7XG5RVW5pdC50ZXN0KFwidmlkZW9qcy1vZmZzZXQgc2hvdWxkIGJlIHJlcXVpcmVhYmxlIHZpYSBicm93c2VyaWZ5XCIsIChhc3NlcnQpID0+IHtcbiAgYXNzZXJ0Lm9rKHBrZywgXCJ2aWRlb2pzLW9mZnNldCBpcyByZXF1aXJlZCBwcm9wZXJseVwiKTtcbn0pOyIsImltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuLy8gQ3Jvc3MtY29tcGF0aWJpbGl0eSBmb3IgVmlkZW8uanMgNSBhbmQgNi5cbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcbi8vIGNvbnN0IGRvbSA9IHZpZGVvanMuZG9tIHx8IHZpZGVvanM7XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqICAgICAgICAgICBBIFZpZGVvLmpzIHBsYXllci5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLm9uKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgIGlmIChjdXJyIDwgMCkge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCAmJiBjdXJyID4gKHRoaXMuX29mZnNldEVuZCAtIHRoaXMuX29mZnNldFN0YXJ0KSkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgaWYgKCF0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUodGhpcy5fb2Zmc2V0RW5kIC0gdGhpcy5fb2Zmc2V0U3RhcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdsb2Fkc3RhcnQnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIG9mZnNldFxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBvZmZzZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBQbGF5ZXIgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gIHRoaXMuX29mZnNldFN0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCAwO1xuICB0aGlzLl9vZmZzZXRFbmQgPSBvcHRpb25zLmVuZCB8fCAwO1xuICB0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nID0gb3B0aW9ucy5yZXN0YXJ0X2JlZ2lubmluZyB8fCBmYWxzZTtcblxuICBpZiAoIVBsYXllci5fX3N1cGVyX18gfHwgIVBsYXllci5fX3N1cGVyX18uX19vZmZzZXRJbml0KSB7XG4gICAgUGxheWVyLl9fc3VwZXJfXyA9IHtcbiAgICAgIF9fb2Zmc2V0SW5pdDogdHJ1ZSxcbiAgICAgIGR1cmF0aW9uOiBQbGF5ZXIucHJvdG90eXBlLmR1cmF0aW9uLFxuICAgICAgY3VycmVudFRpbWU6IFBsYXllci5wcm90b3R5cGUuY3VycmVudFRpbWUsXG4gICAgICBidWZmZXJlZFBlcmNlbnQ6IFBsYXllci5wcm90b3R5cGUuYnVmZmVyZWRQZXJjZW50LFxuICAgICAgcmVtYWluaW5nVGltZTogUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lXG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9vZmZzZXRFbmQgPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmR1cmF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5jdXJyZW50VGltZSA9IGZ1bmN0aW9uKHNlY29uZHMpIHtcbiAgICAgIGlmIChzZWNvbmRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY3VycmVudFRpbWVcbiAgICAgICAgICAgIC5jYWxsKHRoaXMsIHNlY29uZHMgKyB0aGlzLl9vZmZzZXRTdGFydCkgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmN1cnJlbnRUaW1lXG4gICAgICAgICAgLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgICAgaWYgKGN1cnIgPCB0aGlzLl9vZmZzZXRTdGFydCkge1xuICAgICAgICBjdXJyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uKCkgLSBjdXJyO1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLnN0YXJ0T2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZW5kT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0RW5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24oKTtcbiAgICB9O1xuICB9XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnJlZ2lzdGVyUGx1Z2luKCdvZmZzZXQnLCBvZmZzZXQpO1xuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5vZmZzZXQuVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbmV4cG9ydCBkZWZhdWx0IG9mZnNldDtcbiJdfQ==
