const { assign, get } = require('lodash')
const metadata = require('../../../lib/metadata')
const { getAllAdvisers } = require('../../adviser/repos')
const { getContactsForCompany } = require('../../contacts/repos')
const { serviceDeliveryEditFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')
const { transformInteractionResponseToForm } = require('../transformers')

async function renderEditPage (req, res, next) {
  const token = req.session.token
  const serviceDelivery = res.locals.serviceDelivery
  const recordAndFormState = assign({}, transformInteractionResponseToForm(serviceDelivery), req.body)
  let returnLink = `/service-deliveries/${get(serviceDelivery, 'id')}`
  let serviceDeliveryForm

  if (req.query.company) {
    returnLink = `/companies/${req.query.company}/interactions`
  }
  if (req.query.contact) {
    returnLink = `/contacts/${req.query.contact}/interactions`
  }

  try {
    serviceDeliveryForm =
      buildFormWithStateAndErrors(
        serviceDeliveryEditFormConfig({
          contacts: await getContactsForCompany(token, get(serviceDelivery, 'company.id')),
          services: await metadata.getServices(token),
          advisers: await getAllAdvisers(token),
        }),
        recordAndFormState,
        res.locals.formErrors,
      )
  } catch (error) {
    next(error)
  }

  res
    .breadcrumb(get(serviceDelivery, 'subject'))
    .breadcrumb(`${serviceDelivery ? 'Edit' : 'Create'} service delivery`)
    .render('service-deliveries/views/edit', {
      serviceDeliveryForm: assign(serviceDeliveryForm, {
        returnLink,
        errors: {
          summary: get(res.locals, 'formErrors.[0].detail'),
        },
        hiddenFields: {
          id: get(serviceDelivery, 'id'),
          company: get(serviceDelivery, 'company.id'),
        },
      }),
    })
}

module.exports = {
  renderEditPage,
}
