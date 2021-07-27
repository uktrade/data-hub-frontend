module.exports = (req, res, next) => {
  try {
    res.render('contacts/views/create-and-edit', {
      props: {
        contactId: req.params.contactId,
        companyId: req.query.company,
      },
    })
  } catch (e) {
    next(e)
  }
}
