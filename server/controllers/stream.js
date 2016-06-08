var express = require('express'),
     router = express.Router(),
      async = require('async'),
    Twitter = require('../models/twitter'),
  Instagram = require('../models/instagram'),
 Foursquare = require('../models/foursquare'),
   Dribbble = require('../models/dribbble'),
     Tumblr = require('../models/tumblr'),
     Github = require('../models/github'),
     Lastfm = require('../models/lastfm'),
    YouTube = require('../models/youtube');

var streamPosts;

router.get('/:page', function(req, res) {
  var page = parseInt(req.params.page);
  if (!page)
    page = 0;

  async.series([
    function(cb) {
      Twitter.monthActvity(page, cb);
    },
    function(cb) {
      Instagram.monthActvity(page, cb);
    },
    function(cb) {
      Dribbble.monthActvity(page, cb);
    },
    function(cb) {
      Foursquare.monthActvity(page, cb);
    },
    function(cb) {
      Tumblr.monthActvity(page, cb);
    },
    function(cb) {
      Github.monthActvity(page, cb);
    },
    function(cb) {
      Lastfm.monthActvity(page, cb);
    },
    function(cb) {
      YouTube.monthActvity(page, cb);
    }
  ], function(err, results) {
    if (!err) {
      streamPosts = [];
      for (var i=0; i<results.length; i++) {
        var result = results[i];
        streamPosts = streamPosts.concat(result);
      }

      streamPosts.sort(function(a, b) {
        return a.date < b.date ? 1 : -1;
      });

      res.status(200).json(streamPosts);
    }
  });
});

module.exports = router;
