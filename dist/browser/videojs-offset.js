(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsOffset = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _interopDefault(ex) {
  return ex && (typeof ex === 'undefined' ? 'undefined' : _typeof(ex)) === 'object' && 'default' in ex ? ex['default'] : ex;
}

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

module.exports = offset;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7Ozs7QUFFQSxTQUFTLGVBQVQsQ0FBMEIsRUFBMUIsRUFBOEI7QUFBRSxTQUFRLE1BQU8sUUFBTyxFQUFQLHlDQUFPLEVBQVAsT0FBYyxRQUFyQixJQUFrQyxhQUFhLEVBQWhELEdBQXNELEdBQUcsU0FBSCxDQUF0RCxHQUFzRSxFQUE3RTtBQUFrRjs7QUFFbEgsSUFBSSxVQUFVLGdCQUFnQixRQUFRLFVBQVIsQ0FBaEIsQ0FBZDs7QUFFQTtBQUNBLElBQU0sV0FBVyxFQUFqQjs7QUFFQTtBQUNBLElBQU0saUJBQWlCLFFBQVEsY0FBUixJQUEwQixRQUFRLE1BQXpEO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNLGdCQUFnQixTQUFoQixhQUFnQixDQUFDLE1BQUQsRUFBUyxPQUFULEVBQXFCO0FBQ3pDLFNBQU8sRUFBUCxDQUFVLFlBQVYsRUFBd0IsWUFBVztBQUNqQyxRQUFNLE9BQU8sS0FBSyxXQUFMLEVBQWI7O0FBRUEsUUFBSSxPQUFPLENBQVgsRUFBYztBQUNaLFdBQUssV0FBTCxDQUFpQixDQUFqQjtBQUNBLFdBQUssSUFBTDtBQUNEO0FBQ0QsUUFBSSxLQUFLLFVBQUwsR0FBa0IsQ0FBbEIsSUFBdUIsT0FBUSxLQUFLLFVBQUwsR0FBa0IsS0FBSyxZQUExRCxFQUF5RTtBQUN2RSxXQUFLLEtBQUw7QUFDQSxVQUFJLENBQUMsS0FBSyxpQkFBVixFQUE2QjtBQUMzQixhQUFLLFdBQUwsQ0FBaUIsS0FBSyxVQUFMLEdBQWtCLEtBQUssWUFBeEM7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLE9BQUwsQ0FBYSxXQUFiO0FBQ0EsYUFBSyxXQUFMLENBQWlCLENBQWpCO0FBQ0Q7QUFDRjtBQUNGLEdBaEJEO0FBaUJELENBbEJEOztBQW9CQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTSxTQUFTLFNBQVQsTUFBUyxDQUFTLE9BQVQsRUFBa0I7QUFBQTs7QUFDL0IsWUFBVSxXQUFXLEVBQXJCO0FBQ0EsTUFBTSxTQUFTLEtBQUssV0FBcEI7O0FBRUEsT0FBSyxZQUFMLEdBQW9CLFFBQVEsS0FBUixJQUFpQixDQUFyQztBQUNBLE9BQUssVUFBTCxHQUFrQixRQUFRLEdBQVIsSUFBZSxDQUFqQztBQUNBLE9BQUssaUJBQUwsR0FBeUIsUUFBUSxpQkFBUixJQUE2QixLQUF0RDs7QUFFQSxNQUFJLENBQUMsT0FBTyxTQUFSLElBQXFCLENBQUMsT0FBTyxTQUFQLENBQWlCLFlBQTNDLEVBQXlEO0FBQ3ZELFdBQU8sU0FBUCxHQUFtQjtBQUNqQixvQkFBYyxJQURHO0FBRWpCLGdCQUFVLE9BQU8sU0FBUCxDQUFpQixRQUZWO0FBR2pCLG1CQUFhLE9BQU8sU0FBUCxDQUFpQixXQUhiO0FBSWpCLHVCQUFpQixPQUFPLFNBQVAsQ0FBaUIsZUFKakI7QUFLakIscUJBQWUsT0FBTyxTQUFQLENBQWlCO0FBTGYsS0FBbkI7O0FBUUEsV0FBTyxTQUFQLENBQWlCLFFBQWpCLEdBQTRCLFlBQVc7QUFDckMsVUFBSSxLQUFLLFVBQUwsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsZUFBTyxLQUFLLFVBQUwsR0FBa0IsS0FBSyxZQUE5QjtBQUNEO0FBQ0QsYUFBTyxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsS0FBMUIsQ0FBZ0MsSUFBaEMsRUFBc0MsU0FBdEMsSUFBbUQsS0FBSyxZQUEvRDtBQUNELEtBTEQ7O0FBT0EsV0FBTyxTQUFQLENBQWlCLFdBQWpCLEdBQStCLFVBQVMsT0FBVCxFQUFrQjtBQUMvQyxVQUFJLFlBQVksU0FBaEIsRUFBMkI7QUFDekIsZUFBTyxPQUFPLFNBQVAsQ0FBaUIsV0FBakIsQ0FDRixJQURFLENBQ0csSUFESCxFQUNTLFVBQVUsS0FBSyxZQUR4QixJQUN3QyxLQUFLLFlBRHBEO0FBRUQ7QUFDRCxhQUFPLE9BQU8sU0FBUCxDQUFpQixXQUFqQixDQUNGLEtBREUsQ0FDSSxJQURKLEVBQ1UsU0FEVixJQUN1QixLQUFLLFlBRG5DO0FBRUQsS0FQRDs7QUFTQSxXQUFPLFNBQVAsQ0FBaUIsYUFBakIsR0FBaUMsWUFBVztBQUMxQyxVQUFJLE9BQU8sS0FBSyxXQUFMLEVBQVg7O0FBRUEsVUFBSSxPQUFPLEtBQUssWUFBaEIsRUFBOEI7QUFDNUIsZUFBTyxDQUFQO0FBQ0Q7QUFDRCxhQUFPLEtBQUssUUFBTCxLQUFrQixJQUF6QjtBQUNELEtBUEQ7O0FBU0EsV0FBTyxTQUFQLENBQWlCLFdBQWpCLEdBQStCLFlBQVc7QUFDeEMsYUFBTyxLQUFLLFlBQVo7QUFDRCxLQUZEOztBQUlBLFdBQU8sU0FBUCxDQUFpQixTQUFqQixHQUE2QixZQUFXO0FBQ3RDLFVBQUksS0FBSyxVQUFMLEdBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGVBQU8sS0FBSyxVQUFaO0FBQ0Q7QUFDRCxhQUFPLEtBQUssUUFBTCxFQUFQO0FBQ0QsS0FMRDtBQU1EOztBQUVELE9BQUssS0FBTCxDQUFXLFlBQU07QUFDZix5QkFBb0IsUUFBUSxZQUFSLENBQXFCLFFBQXJCLEVBQStCLE9BQS9CLENBQXBCO0FBQ0QsR0FGRDtBQUdELENBekREOztBQTJEQTtBQUNBLGVBQWUsUUFBZixFQUF5QixNQUF6QjtBQUNBO0FBQ0EsT0FBTyxPQUFQLEdBQWlCLGFBQWpCOztBQUVBLE9BQU8sT0FBUCxHQUFpQixNQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wRGVmYXVsdCAoZXgpIHsgcmV0dXJuIChleCAmJiAodHlwZW9mIGV4ID09PSAnb2JqZWN0JykgJiYgJ2RlZmF1bHQnIGluIGV4KSA/IGV4WydkZWZhdWx0J10gOiBleDsgfVxuXG52YXIgdmlkZW9qcyA9IF9pbnRlcm9wRGVmYXVsdChyZXF1aXJlKCd2aWRlby5qcycpKTtcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuLy8gQ3Jvc3MtY29tcGF0aWJpbGl0eSBmb3IgVmlkZW8uanMgNSBhbmQgNi5cbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcbi8vIGNvbnN0IGRvbSA9IHZpZGVvanMuZG9tIHx8IHZpZGVvanM7XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqICAgICAgICAgICBBIFZpZGVvLmpzIHBsYXllci5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLm9uKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgIGlmIChjdXJyIDwgMCkge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCAmJiBjdXJyID4gKHRoaXMuX29mZnNldEVuZCAtIHRoaXMuX29mZnNldFN0YXJ0KSkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgaWYgKCF0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUodGhpcy5fb2Zmc2V0RW5kIC0gdGhpcy5fb2Zmc2V0U3RhcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdsb2Fkc3RhcnQnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIG9mZnNldFxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBvZmZzZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBQbGF5ZXIgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gIHRoaXMuX29mZnNldFN0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCAwO1xuICB0aGlzLl9vZmZzZXRFbmQgPSBvcHRpb25zLmVuZCB8fCAwO1xuICB0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nID0gb3B0aW9ucy5yZXN0YXJ0X2JlZ2lubmluZyB8fCBmYWxzZTtcblxuICBpZiAoIVBsYXllci5fX3N1cGVyX18gfHwgIVBsYXllci5fX3N1cGVyX18uX19vZmZzZXRJbml0KSB7XG4gICAgUGxheWVyLl9fc3VwZXJfXyA9IHtcbiAgICAgIF9fb2Zmc2V0SW5pdDogdHJ1ZSxcbiAgICAgIGR1cmF0aW9uOiBQbGF5ZXIucHJvdG90eXBlLmR1cmF0aW9uLFxuICAgICAgY3VycmVudFRpbWU6IFBsYXllci5wcm90b3R5cGUuY3VycmVudFRpbWUsXG4gICAgICBidWZmZXJlZFBlcmNlbnQ6IFBsYXllci5wcm90b3R5cGUuYnVmZmVyZWRQZXJjZW50LFxuICAgICAgcmVtYWluaW5nVGltZTogUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lXG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9vZmZzZXRFbmQgPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmR1cmF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5jdXJyZW50VGltZSA9IGZ1bmN0aW9uKHNlY29uZHMpIHtcbiAgICAgIGlmIChzZWNvbmRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY3VycmVudFRpbWVcbiAgICAgICAgICAgIC5jYWxsKHRoaXMsIHNlY29uZHMgKyB0aGlzLl9vZmZzZXRTdGFydCkgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmN1cnJlbnRUaW1lXG4gICAgICAgICAgLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgICAgaWYgKGN1cnIgPCB0aGlzLl9vZmZzZXRTdGFydCkge1xuICAgICAgICBjdXJyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uKCkgLSBjdXJyO1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLnN0YXJ0T2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZW5kT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0RW5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24oKTtcbiAgICB9O1xuICB9XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnJlZ2lzdGVyUGx1Z2luKCdvZmZzZXQnLCBvZmZzZXQpO1xuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5vZmZzZXQuVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbm1vZHVsZS5leHBvcnRzID0gb2Zmc2V0O1xuIl19
