var announcementArticles = require('../fixtures/help-centre/announcement.js')
var feeds = require('../fixtures/help-centre/feed.js')

exports.announcement = function (req, res) {
  if (req.query.test === 'help-centre-unavailable') {
    return res.status(503)
  } else if (req.query.test === 'help-centre-empty') {
    return res.json(announcementArticles.emptyAnnouncement)
  } else {
    return res.json(announcementArticles.announcement)
  }
}

exports.feed = function (req, res) {
  if (req.query.test == 'feed-empty') {
    return res.json(feeds.emptyFeed)
  }
  return res.json(feeds.feeds)
}
