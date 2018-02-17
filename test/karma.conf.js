module.exports = function(config) {
  // On Travis CI, we can only run in Firefox and Chrome; so, enforce that.
  if (process.env.TRAVIS) {
    config.browsers = ['Firefox', 'travisChrome'];
  }

  // If no browsers are specified, assume is dev env and run ChromeHeadless
  // TODO: re-enable detect browsers when figure out how to make test work in
  // Safari
  if (!config.browsers.length) {
    config.browsers = ['ChromeHeadless']
  }

  config.set({
    basePath: '..',
    frameworks: ['qunit'],
    files: [
      'node_modules/video.js/dist/video-js.css',
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/video.js/dist/video.js',
      'test/dist/bundle.js'
    ],
    customLaunchers: {
      travisChrome: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity
  });
};
