/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _video = __webpack_require__(2);

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
offset.VERSION = '__VERSION__';

exports['default'] = offset;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(0);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

QUnit.module("webpack require"); /**
                                  * webpack test 
                                  */

QUnit.test("videojs-offset should be requireable via webpack", function (assert) {
  assert.ok(_index2["default"], "videojs-offset is required properly");
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = videojs;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmJiMDM2YWU4NzQ5MzY0YzYwN2IiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL2Rpc3QvdGVzdC93ZWJwYWNrLnN0YXJ0LmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcInZpZGVvanNcIiJdLCJuYW1lcyI6WyJkZWZhdWx0cyIsInJlZ2lzdGVyUGx1Z2luIiwicGx1Z2luIiwib25QbGF5ZXJSZWFkeSIsInBsYXllciIsIm9wdGlvbnMiLCJvbiIsImN1cnIiLCJjdXJyZW50VGltZSIsInBsYXkiLCJfb2Zmc2V0RW5kIiwiX29mZnNldFN0YXJ0IiwicGF1c2UiLCJfcmVzdGFydEJlZ2lubmluZyIsInRyaWdnZXIiLCJvZmZzZXQiLCJQbGF5ZXIiLCJjb25zdHJ1Y3RvciIsInN0YXJ0IiwiZW5kIiwicmVzdGFydF9iZWdpbm5pbmciLCJfX3N1cGVyX18iLCJfX29mZnNldEluaXQiLCJkdXJhdGlvbiIsInByb3RvdHlwZSIsImJ1ZmZlcmVkUGVyY2VudCIsInJlbWFpbmluZ1RpbWUiLCJhcHBseSIsImFyZ3VtZW50cyIsInNlY29uZHMiLCJ1bmRlZmluZWQiLCJjYWxsIiwic3RhcnRPZmZzZXQiLCJlbmRPZmZzZXQiLCJyZWFkeSIsIm1lcmdlT3B0aW9ucyIsIlZFUlNJT04iLCJRVW5pdCIsIm1vZHVsZSIsInRlc3QiLCJhc3NlcnQiLCJvayJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FB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QUFqQixHQUFpQyxZQUFXO0FBQzFDLFVBQUluQixPQUFPLEtBQUtDLFdBQUwsRUFBWDs7QUFFQSxVQUFJRCxPQUFPLEtBQUtJLFlBQWhCLEVBQThCO0FBQzVCSixlQUFPLENBQVA7QUFDRDtBQUNELGFBQU8sS0FBS2dCLFFBQUwsS0FBa0JoQixJQUF6QjtBQUNELEtBUEQ7O0FBU0FTLFdBQU9RLFNBQVAsQ0FBaUJRLFdBQWpCLEdBQStCLFlBQVc7QUFDeEMsYUFBTyxLQUFLckIsWUFBWjtBQUNELEtBRkQ7O0FBSUFLLFdBQU9RLFNBQVAsQ0FBaUJTLFNBQWpCLEdBQTZCLFlBQVc7QUFDdEMsVUFBSSxLQUFLdkIsVUFBTCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixlQUFPLEtBQUtBLFVBQVo7QUFDRDtBQUNELGFBQU8sS0FBS2EsUUFBTCxFQUFQO0FBQ0QsS0FMRDtBQU1EOztBQUVELE9BQUtXLEtBQUwsQ0FBVyxZQUFNO0FBQ2YvQix5QkFBb0IsbUJBQVFnQyxZQUFSLENBQXFCbkMsUUFBckIsRUFBK0JLLE9BQS9CLENBQXBCO0FBQ0QsR0FGRDtBQUdELENBekREOztBQTJEQTtBQUNBSixlQUFlLFFBQWYsRUFBeUJjLE1BQXpCO0FBQ0E7QUFDQUEsT0FBT3FCLE9BQVAsR0FBaUIsYUFBakI7O3FCQUVlckIsTTs7Ozs7Ozs7O0FDbkhmOzs7Ozs7QUFFQXNCLE1BQU1DLE1BQU4sQ0FBYSxpQkFBYixFLENBTEE7Ozs7QUFNQUQsTUFBTUUsSUFBTixDQUFXLGtEQUFYLEVBQStELFVBQUNDLE1BQUQsRUFBWTtBQUN6RUEsU0FBT0MsRUFBUCxxQkFBZSxxQ0FBZjtBQUNELENBRkQsRTs7Ozs7O0FDTkEseUIiLCJmaWxlIjoid2VicGFjay50ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyYmIwMzZhZTg3NDkzNjRjNjA3YiIsImltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuLy8gQ3Jvc3MtY29tcGF0aWJpbGl0eSBmb3IgVmlkZW8uanMgNSBhbmQgNi5cbmNvbnN0IHJlZ2lzdGVyUGx1Z2luID0gdmlkZW9qcy5yZWdpc3RlclBsdWdpbiB8fCB2aWRlb2pzLnBsdWdpbjtcbi8vIGNvbnN0IGRvbSA9IHZpZGVvanMuZG9tIHx8IHZpZGVvanM7XG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIHBsYXllciBpcyByZWFkeS5cbiAqXG4gKiBUaGlzIGlzIGEgZ3JlYXQgcGxhY2UgZm9yIHlvdXIgcGx1Z2luIHRvIGluaXRpYWxpemUgaXRzZWxmLiBXaGVuIHRoaXNcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlIHBsYXllciB3aWxsIGhhdmUgaXRzIERPTSBhbmQgY2hpbGQgY29tcG9uZW50c1xuICogaW4gcGxhY2UuXG4gKlxuICogQGZ1bmN0aW9uIG9uUGxheWVyUmVhZHlcbiAqIEBwYXJhbSAgICB7UGxheWVyfSBwbGF5ZXJcbiAqICAgICAgICAgICBBIFZpZGVvLmpzIHBsYXllci5cbiAqIEBwYXJhbSAgICB7T2JqZWN0fSBbb3B0aW9ucz17fV1cbiAqICAgICAgICAgICBBbiBvYmplY3Qgb2Ygb3B0aW9ucyBsZWZ0IHRvIHRoZSBwbHVnaW4gYXV0aG9yIHRvIGRlZmluZS5cbiAqL1xuY29uc3Qgb25QbGF5ZXJSZWFkeSA9IChwbGF5ZXIsIG9wdGlvbnMpID0+IHtcbiAgcGxheWVyLm9uKCd0aW1ldXBkYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgIGlmIChjdXJyIDwgMCkge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIHRoaXMucGxheSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCAmJiBjdXJyID4gKHRoaXMuX29mZnNldEVuZCAtIHRoaXMuX29mZnNldFN0YXJ0KSkge1xuICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgaWYgKCF0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUodGhpcy5fb2Zmc2V0RW5kIC0gdGhpcy5fb2Zmc2V0U3RhcnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCdsb2Fkc3RhcnQnKTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSgwKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuLyoqXG4gKiBBIHZpZGVvLmpzIHBsdWdpbi5cbiAqXG4gKiBJbiB0aGUgcGx1Z2luIGZ1bmN0aW9uLCB0aGUgdmFsdWUgb2YgYHRoaXNgIGlzIGEgdmlkZW8uanMgYFBsYXllcmBcbiAqIGluc3RhbmNlLiBZb3UgY2Fubm90IHJlbHkgb24gdGhlIHBsYXllciBiZWluZyBpbiBhIFwicmVhZHlcIiBzdGF0ZSBoZXJlLFxuICogZGVwZW5kaW5nIG9uIGhvdyB0aGUgcGx1Z2luIGlzIGludm9rZWQuIFRoaXMgbWF5IG9yIG1heSBub3QgYmUgaW1wb3J0YW50XG4gKiB0byB5b3U7IGlmIG5vdCwgcmVtb3ZlIHRoZSB3YWl0IGZvciBcInJlYWR5XCIhXG4gKlxuICogQGZ1bmN0aW9uIG9mZnNldFxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICogICAgICAgICAgIEFuIG9iamVjdCBvZiBvcHRpb25zIGxlZnQgdG8gdGhlIHBsdWdpbiBhdXRob3IgdG8gZGVmaW5lLlxuICovXG5jb25zdCBvZmZzZXQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBQbGF5ZXIgPSB0aGlzLmNvbnN0cnVjdG9yO1xuXG4gIHRoaXMuX29mZnNldFN0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCAwO1xuICB0aGlzLl9vZmZzZXRFbmQgPSBvcHRpb25zLmVuZCB8fCAwO1xuICB0aGlzLl9yZXN0YXJ0QmVnaW5uaW5nID0gb3B0aW9ucy5yZXN0YXJ0X2JlZ2lubmluZyB8fCBmYWxzZTtcblxuICBpZiAoIVBsYXllci5fX3N1cGVyX18gfHwgIVBsYXllci5fX3N1cGVyX18uX19vZmZzZXRJbml0KSB7XG4gICAgUGxheWVyLl9fc3VwZXJfXyA9IHtcbiAgICAgIF9fb2Zmc2V0SW5pdDogdHJ1ZSxcbiAgICAgIGR1cmF0aW9uOiBQbGF5ZXIucHJvdG90eXBlLmR1cmF0aW9uLFxuICAgICAgY3VycmVudFRpbWU6IFBsYXllci5wcm90b3R5cGUuY3VycmVudFRpbWUsXG4gICAgICBidWZmZXJlZFBlcmNlbnQ6IFBsYXllci5wcm90b3R5cGUuYnVmZmVyZWRQZXJjZW50LFxuICAgICAgcmVtYWluaW5nVGltZTogUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lXG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZHVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9vZmZzZXRFbmQgPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRFbmQgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmR1cmF0aW9uLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5jdXJyZW50VGltZSA9IGZ1bmN0aW9uKHNlY29uZHMpIHtcbiAgICAgIGlmIChzZWNvbmRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIFBsYXllci5fX3N1cGVyX18uY3VycmVudFRpbWVcbiAgICAgICAgICAgIC5jYWxsKHRoaXMsIHNlY29uZHMgKyB0aGlzLl9vZmZzZXRTdGFydCkgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBQbGF5ZXIuX19zdXBlcl9fLmN1cnJlbnRUaW1lXG4gICAgICAgICAgLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgLSB0aGlzLl9vZmZzZXRTdGFydDtcbiAgICB9O1xuXG4gICAgUGxheWVyLnByb3RvdHlwZS5yZW1haW5pbmdUaW1lID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY3VyciA9IHRoaXMuY3VycmVudFRpbWUoKTtcblxuICAgICAgaWYgKGN1cnIgPCB0aGlzLl9vZmZzZXRTdGFydCkge1xuICAgICAgICBjdXJyID0gMDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmR1cmF0aW9uKCkgLSBjdXJyO1xuICAgIH07XG5cbiAgICBQbGF5ZXIucHJvdG90eXBlLnN0YXJ0T2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0U3RhcnQ7XG4gICAgfTtcblxuICAgIFBsYXllci5wcm90b3R5cGUuZW5kT2Zmc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fb2Zmc2V0RW5kID4gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0RW5kO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb24oKTtcbiAgICB9O1xuICB9XG5cbiAgdGhpcy5yZWFkeSgoKSA9PiB7XG4gICAgb25QbGF5ZXJSZWFkeSh0aGlzLCB2aWRlb2pzLm1lcmdlT3B0aW9ucyhkZWZhdWx0cywgb3B0aW9ucykpO1xuICB9KTtcbn07XG5cbi8vIFJlZ2lzdGVyIHRoZSBwbHVnaW4gd2l0aCB2aWRlby5qcy5cbnJlZ2lzdGVyUGx1Z2luKCdvZmZzZXQnLCBvZmZzZXQpO1xuLy8gSW5jbHVkZSB0aGUgdmVyc2lvbiBudW1iZXIuXG5vZmZzZXQuVkVSU0lPTiA9ICdfX1ZFUlNJT05fXyc7XG5cbmV4cG9ydCBkZWZhdWx0IG9mZnNldDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9pbmRleC5qcyIsIi8qKlxuICogd2VicGFjayB0ZXN0IFxuICovXG5pbXBvcnQgcGtnIGZyb20gXCIuLi8uLi9zcmMvanMvaW5kZXguanNcIjtcblxuUVVuaXQubW9kdWxlKFwid2VicGFjayByZXF1aXJlXCIpO1xuUVVuaXQudGVzdChcInZpZGVvanMtb2Zmc2V0IHNob3VsZCBiZSByZXF1aXJlYWJsZSB2aWEgd2VicGFja1wiLCAoYXNzZXJ0KSA9PiB7XG4gIGFzc2VydC5vayhwa2csIFwidmlkZW9qcy1vZmZzZXQgaXMgcmVxdWlyZWQgcHJvcGVybHlcIik7XG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9kaXN0L3Rlc3Qvd2VicGFjay5zdGFydC5qcyIsIm1vZHVsZS5leHBvcnRzID0gdmlkZW9qcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInZpZGVvanNcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9