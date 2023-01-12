async function getAudit(req, res, next) {
  try {
    const contactId = req.params.contactId
    const contact = res.locals?.contact

    return res.breadcrumb('Audit history').render('contacts/views/audit', {
      props: {
        contactId: contactId,
        contact: contact,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAudit,
}
