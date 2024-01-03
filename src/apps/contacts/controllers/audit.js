async function getAudit(req, res, next) {
  try {
    const contactId = req.params.contactId
    const permissions = res.locals?.user.permissions

    return res.breadcrumb('Audit history').render('contacts/views/audit', {
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
  getAudit,
}
