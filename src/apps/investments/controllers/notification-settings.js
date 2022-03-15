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
        investment: investment,
      },
    })
}

module.exports = {
  renderNotificationSettingsView,
}
