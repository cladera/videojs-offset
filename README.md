# videojs-offset

VideoJs plugin to virtually &#34;cut&#34; an ondemand video

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Installation

- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save videojs-offset
```

## Usage

To include videojs-offset on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-offset.min.js"></script>
<script>
  var player = videojs('my-video');

  player.offset({
    start: 10,
    end: 300,
    restart_beginning: false //Should the video go to the beginning when it ends
  });
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-offset via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-offset');

var player = videojs('my-video');

player.offset({
  start: 10,
  end: 300,
  restart_beginning: false //Should the video go to the beginning when it ends
});
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-offset'], function(videojs) {
  var player = videojs('my-video');

  player.offset({
    start: 10,
    end: 300,
    restart_beginning: false //Should the video go to the beginning when it ends
  });
});
```

## License

MIT. Copyright (c) Carles Galan Cladera &lt;cgcladera@gmail.com&gt;


[videojs]: http://videojs.com/
