# videojs-offset

VideoJS plugin to play a segment of a video

## About

A JavaScript library by Carles Galan Cladera.

See the [project homepage](http://cladera.github.io/videojs-offset).

## Installation

Using Bower:

    bower install videojs-offset
    
Using npm:

    npm install videojs-offset
    
Or grab the [source](https://github.com/cladera/videojs-offset/blob/master/dist/videojs-offset.js) ([minified](https://github.com/cladera/videojs-offset/blob/master/dist/videojs-offset.min.js)).

## Usage

Basic usage is as follows:

    videojs('my-video', {
      plugins: {
        offset: {
          start: 10, //Start offset in seconds
          end: 40,    //End offset in seconds
          restart_beginning: false //Should the video go to the beginning when it ends
        }
      }
    });

Either start and end offset are referred to original video duration.

## Tricks

If you have the [LoadProgressBar](http://docs.videojs.com/docs/api/load-progress-bar.html) component overflowing like above ![](https://cloud.githubusercontent.com/assets/4100047/11180306/b0767b24-8c7f-11e5-9f81-3893631f4807.png)  
just add the following css : 

``` css
.vjs-load-progress {
  overflow-x:hidden;
}
```

## Contributing

We'll check out your contribution if you:

* Provide a comprehensive suite of tests for your fork.
* Have a clear and documented rationale for your changes.
* Package these up in a pull request.

We'll do our best to help you out with any contribution issues you may have.

## License

MIT. See `LICENSE.txt` in this directory.
