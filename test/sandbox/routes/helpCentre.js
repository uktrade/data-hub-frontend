var announcementArticles = require('../fixtures/help-centre/announcement.js')

exports.announcement = function (req, res) {
  if (req.query.test === 'help-centre-unavailable') {
    return res.status(503)
  } else if (req.query.test === 'help-centre-empty') {
    return res.json(announcementArticles.emptyAnnouncement)
  } else {
    return res.json(announcementArticles.announcement)
  }
}
