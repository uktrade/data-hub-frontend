const renderNotificationSettingsView = async (req, res, next) => {
  if (!res.locals.isFeatureTesting) {
    next()
    return
  }

  const { investment } = res.locals
  res
    .breadcrumb('Notifications')
    .render('investments/views/notification-settings', {
      props: {
        investment,
      },
    })
}

const renderNotificationsEstimatedLandDateView = (req, res) => {
  const { investment } = res.locals
  res.render('investments/views/estimated-land-date', {
    props: {
      investment,
    },
  })
}

module.exports = {
  renderNotificationSettingsView,
  renderNotificationsEstimatedLandDateView,
}
