function renderContactActivityForEntity(req, res, next) {
  try {
    const { view, contactId } = res.locals?.interactions
    const permissions = res.locals?.user.permissions
    const breadcrumbTitle = 'Activity'

    res.breadcrumb(breadcrumbTitle).render(view, {
      props: {
        contactId,
        permissions,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderContactActivityForEntity,
}
