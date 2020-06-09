var announcementArticles = require('../fixtures/help-centre/announcement.js')

exports.announcement = function(req, res) {
  res.json(announcementArticles.announcement)
}
