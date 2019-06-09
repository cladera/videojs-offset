import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-offset', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
    this.sandbox = sinon.createSandbox();
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
    this.sandbox.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    typeof Player.prototype.offset,
    'function',
    'videojs-offset plugin was registered'
  );

  this.player.offset({
    start: 10,
    end: 300
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  assert.ok(
    this.player.duration() === 290,
    'the plugin alters video duration adjusting to start|end options'
  );
});

QUnit.test('remaining time', function(assert) {
  assert.expect(1);

  this.player.offset({
    start: 10,
    end: 300
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.currentTime(2);

  assert.ok(
    this.player.remainingTime() === 288,
    'the plugin alters remaining time'
  );
});

QUnit.test('configure start and end as as strings', function(assert) {
  assert.expect(1);

  this.player.offset({
    start: '10.5',
    end: '300.5'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.currentTime(2);

  assert.ok(
    this.player.currentTime() === 2,
    'the plugin alters seeking by applying the start correction'
  );
});

QUnit.test('should override buffered method', function(assert) {
  assert.expect(2);

  const initRange = videojs.createTimeRanges([[0, 30]]);

  this.sandbox
    .stub(Player.__super__, 'buffered')
    .returns(initRange);

  this.player.offset({
    start: 5,
    end: 25
  });

  const buff = this.player.buffered();

  assert.ok(buff.start(0) === 0, 'start should be 0. Actual: ' + buff.start(0));
  assert.ok(buff.end(0) === 20, 'end equal to video duration. Actual: ' + buff.end(0));
});

QUnit.test('start offset and end offset getters', function(assert) {
  assert.expect(3);

  this.player.offset({
    start: 10,
    end: 300
  });

  assert.ok(this.player.startOffset() === 10, 'should return start offset');
  assert.ok(this.player.endOffset() === 300, 'should return end offset');

  // Reset the player instance
  this.player = videojs(this.video);

  this.sandbox.stub(this.player, 'duration').returns(500);

  this.player.offset({
    start: 10
  });

  assert.ok(this.player.endOffset() === 500, 'should return the video duration');

});

QUnit.test('rest time update handler when video reaches the end', function(assert) {

  let triggerReady;
  let triggerPlay;
  let triggerTimeupdate;
  let currentTime = 0;
  const _thisPlayer = this.player;

  this.sandbox.stub(this.player, 'ready').callsFake(function(cb) {
    triggerReady = function() {
      cb.call(_thisPlayer);
    };
  });

  this.sandbox.stub(this.player, 'one')
    .withArgs('play', sinon.match.any)
    .callsFake(function(event, cb) {
      triggerPlay = function() {
        cb.call(_thisPlayer);
      };
    });

  const addEventListenerStub = this.sandbox.stub(this.player, 'on');

  addEventListenerStub.withArgs('timeupdate', sinon.match.any)
    .callsFake(function(event, cb) {
      triggerTimeupdate = function(curr) {
        currentTime = curr;
        cb.call(_thisPlayer);
      };
    });
  addEventListenerStub.callThrough();

  this.sandbox.stub(this.player, 'currentTime').callsFake(function(curr) {
    if (!curr && curr !== 0) {
      return currentTime;
    }
    currentTime = curr;
  });

  this.sandbox.spy(this.player, 'off');
  this.sandbox.spy(this.player, 'pause');
  this.sandbox.spy(this.player, 'trigger');

  this.player.offset({
    start: 5,
    end: 300,
    restart_beginning: true /* eslint-disable-line */
  });

  triggerReady();
  triggerPlay();

  // Reset one so we can verify later that it was called again
  this.player.one.resetHistory();

  triggerTimeupdate(300);

  assert.ok(this.player.pause.called === true, 'should pause the video');
  assert.ok(
    this.player.off.calledWith('timeupdate', sinon.match.any),
    'should unsubscribe from timeupdate events'
  );
  assert.ok(this.player.trigger.calledWith('ended'), 'should trigger ended event');
  assert.equal(currentTime, 0, 'should get back to the beginning');
  assert.ok(
    this.player.one.calledWith('play', sinon.match.func),
    'should subscribe to next play event'
  );

  // Clean on's calls history
  this.player.on.resetHistory();
  triggerPlay();

  assert.ok(
    this.player.on.calledWith('timeupdate', sinon.match.func),
    'should subscribe to time update after the first play'
  );

});
