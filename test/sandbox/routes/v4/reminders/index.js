exports.getEstimatedLandDateSubscriptions = function (req, res) {
  res.json({
    reminder_days: [60, 30],
    email_reminders_enabled: false,
  })
}

exports.getNoRecentInteractionsSubscriptions = function (req, res) {
  res.json({
    reminder_days: [30, 50, 70],
    email_reminders_enabled: false,
  })
}
