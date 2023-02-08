const contactsRepository = require('../repos')
const companyRepository = require('../../companies/repos')

async function getCommon(req, res, next) {
  try {
    const contact = (res.locals.contact = await contactsRepository.getContact(
      req,
      req.params.contactId,
      res.locals.features
    ))

    res.locals.company = await companyRepository.getDitCompany(
      req,
      contact.company.id
    )
    res.locals.companies = [res.locals.company]
    res.locals.id = req.params.contactId

    res.breadcrumb(
      `${contact.first_name} ${contact.last_name}`,
      `/contacts/${contact.id}`
    )

    next()
  } catch (error) {
    next(error)
  }
}

function getDetails(req, res, next) {
  try {
    const contactId = req.params.contactId
    const companyAddress = res.locals?.company.address
    const permissions = res.locals?.user.permissions

    res.render('contacts/views/details', {
      props: {
        contactId,
        companyAddress,
        permissions,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
  getCommon,
}
