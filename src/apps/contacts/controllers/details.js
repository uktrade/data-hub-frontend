const contactsRepository = require('../repos')
const companyRepository = require('../../companies/repos')
const {
  ACTIVITY_STREAM_FEATURE_FLAG,
} = require('../../companies/apps/activity-feed/constants')

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
    const contact = res.locals.contact
    const companyAddress = res.locals.company.address
    const isActivityStreamFeatureFlagEnabled =
      res.locals.userFeatures?.includes(ACTIVITY_STREAM_FEATURE_FLAG)

    res.render('contacts/views/details', {
      props: {
        contactId: contactId,
        contact: contact,
        isActivityStreamFeatureFlagEnabled,
        companyAddress: companyAddress,
      },
      isActivityStreamFeatureFlagEnabled,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
  getCommon,
}
