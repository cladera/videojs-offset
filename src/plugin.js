import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Checks whether the clip should be ended.
 *
 * @function onPlayerTimeUpdate
 *
 */
const onPlayerTimeUpdate = function() {
  const curr = this.currentTime();

  if (curr < 0) {
    this.currentTime(0);
    this.play();
  }
  if (this._offsetEnd > 0 && curr > (this._offsetEnd - this._offsetStart)) {
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
const onPlayerReady = (player, options) => {
  player.one('play', () => {
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
const offset = function(options) {
  options = options || {};
  const Player = this.constructor;

  this._offsetStart = parseFloat(options.start || '0');
  this._offsetEnd = parseFloat(options.end || '0');
  this._restartBeginning = options.restart_beginning || false;

  if (!Player.__super__ || !Player.__super__.__offsetInit) {
    Player.__super__ = {
      __offsetInit: true,
      duration: Player.prototype.duration,
      currentTime: Player.prototype.currentTime,
      bufferedPercent: Player.prototype.bufferedPercent,
      remainingTime: Player.prototype.remainingTime
    };

    Player.prototype.duration = function() {
      if (this._offsetEnd > 0) {
        return this._offsetEnd - this._offsetStart;
      }
      return Player.__super__.duration.apply(this, arguments) - this._offsetStart;
    };

    Player.prototype.currentTime = function(seconds) {
      if (seconds !== undefined) {
        return Player.__super__.currentTime
          .call(this, seconds + this._offsetStart);
      }

      return Player.__super__.currentTime
        .apply(this) - this._offsetStart;
    };

    Player.prototype.remainingTime = function() {
      return this.duration() - this.currentTime();
    };

    Player.prototype.startOffset = function() {
      return this._offsetStart;
    };

    Player.prototype.endOffset = function() {
      if (this._offsetEnd > 0) {
        return this._offsetEnd;
      }
      return this.duration();
    };
  }

  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('offset', offset);
// Include the version number.
offset.VERSION = VERSION;

export default offset;
